#include <WiFiSettingsService.h>

WiFiSettingsService::WiFiSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager) :
    _httpEndpoint(WiFiSettings::read, WiFiSettings::update, this, server, WIFI_SETTINGS_SERVICE_PATH, securityManager),
    _fsPersistence(WiFiSettings::read, WiFiSettings::update, this, fs, WIFI_SETTINGS_FILE),
    _lastConnectionAttempt(0)
#ifdef ESP32
    , _connectionRetries(0)
#endif
{
  // We want the device to come up in opmode=0 (WIFI_OFF), when erasing the flash this is not the default.
  // If needed, we save opmode=0 before disabling persistence so the device boots with WiFi disabled in the future.
  if (WiFi.getMode() != WIFI_OFF) {
    WiFi.mode(WIFI_OFF);
  }

  // Disable WiFi config persistance and auto reconnect
  WiFi.persistent(false);
  WiFi.setAutoReconnect(false);
#ifdef ESP32
  // Feed watchdog before WiFi operations
  yield();
  
  // ESP32 requires more careful WiFi mode initialization
  // First ensure WiFi is completely off
  WiFi.mode(WIFI_OFF);
  delay(200);  // Longer delay to ensure clean shutdown
  yield();
  
  // Initialize WiFi driver in NULL mode first (ESP32 specific requirement)
  WiFi.mode(WIFI_MODE_NULL);
  delay(100);
  yield();
  
  // Now safely transition to STA mode
  WiFi.mode(WIFI_STA);
  delay(100);  // Allow mode to stabilize
  yield();
  
  // Register event handlers after proper initialization
  WiFi.onEvent(
      std::bind(&WiFiSettingsService::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
      WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.onEvent(std::bind(&WiFiSettingsService::onStationModeStop, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_STOP);
#elif defined(ESP8266)
  _onStationModeDisconnectedHandler = WiFi.onStationModeDisconnected(
      std::bind(&WiFiSettingsService::onStationModeDisconnected, this, std::placeholders::_1));
#endif

  addUpdateHandler([&](const String& originId) { reconfigureWiFiConnection(); }, false);
}

void WiFiSettingsService::begin() {
  _fsPersistence.readFromFS();
#ifdef ESP32
  // ESP32: Debug output to show loaded WiFi settings
  Serial.printf("[%lu] WiFiSettingsService::begin: Loaded SSID: '%s'\n", 
                millis(), _state.ssid.c_str());
  Serial.printf("[%lu] WiFiSettingsService::begin: Password length: %d\n", 
                millis(), _state.password.length());
  Serial.printf("[%lu] WiFiSettingsService::begin: Hostname: '%s'\n", 
                millis(), _state.hostname.c_str());
#endif
  reconfigureWiFiConnection();
}

void WiFiSettingsService::reconfigureWiFiConnection() {
  // reset last connection attempt to force loop to reconnect immediately
  _lastConnectionAttempt = 0;

// disconnect and de-configure wifi
#ifdef ESP32
  // Feed watchdog before WiFi operations
  yield();
  
  // ESP32: More careful disconnection sequence
  Serial.printf("[%lu] Reconfiguring WiFi connection...\n", millis());
  
  // First disconnect gracefully
  WiFi.disconnect(false);  // Don't erase stored credentials
  delay(200);
  yield();
  
  // Get current mode before changing it
  WiFiMode_t currentMode = WiFi.getMode();
  Serial.printf("[%lu] Current WiFi mode: %d\n", millis(), currentMode);
  
  // Only change mode if we need to
  if (currentMode == WIFI_AP_STA) {
    // If in AP+STA mode, keep AP but reset STA
    Serial.println(F("Preserving AP mode, resetting STA"));
    // Don't change mode, just disconnect STA part
  } else if (currentMode != WIFI_OFF) {
    // For other modes, safely transition to OFF then back to STA
    WiFi.mode(WIFI_OFF);
    delay(200);
    yield();
    
    WiFi.mode(WIFI_STA);
    delay(200);
    yield();
  }
  
  _stopping = true;
#elif defined(ESP8266)
  WiFi.disconnect(true);
#endif
}

void WiFiSettingsService::loop() {
  unsigned long currentMillis = millis();
  if (!_lastConnectionAttempt || (unsigned long)(currentMillis - _lastConnectionAttempt) >= WIFI_RECONNECTION_DELAY) {
    _lastConnectionAttempt = currentMillis;
    manageSTA();
  }
}

void WiFiSettingsService::manageSTA() {
  // Feed watchdog at the beginning of connection management
  yield();
  
#ifdef ESP32
  // ESP32: Add debug output to diagnose connection issues
  Serial.printf("[%lu] manageSTA: WiFi connected: %s, SSID length: %d, SSID: '%s'\n", 
                millis(), WiFi.isConnected() ? "true" : "false", 
                _state.ssid.length(), _state.ssid.c_str());
  Serial.printf("[%lu] manageSTA: WiFi mode: %d, STA enabled: %s\n", 
                millis(), WiFi.getMode(), 
                ((WiFi.getMode() & WIFI_STA) != 0) ? "true" : "false");
#endif
  
  // Abort if already connected, or if we have no SSID
  if (WiFi.isConnected() || _state.ssid.length() == 0) {
#ifdef ESP32
    if (WiFi.isConnected()) {
      Serial.printf("[%lu] manageSTA: Already connected, skipping\n", millis());
    } else {
      Serial.printf("[%lu] manageSTA: No SSID configured, skipping\n", millis());
    }
#endif
    return;
  }
  
  // Connect or reconnect as required
#ifdef ESP32
  // ESP32: Always attempt connection if not connected, regardless of mode
  Serial.println(F("Connecting to WiFi..."));
  Serial.printf("[%lu] manageSTA: Current WiFi mode: %d, attempting connection\n", millis(), WiFi.getMode());
  
  // ESP32: Ensure STA mode is enabled
  WiFiMode_t currentMode = WiFi.getMode();
  if (currentMode != WIFI_STA && currentMode != WIFI_AP_STA) {
    // If we're in AP mode, transition to AP_STA to preserve AP
    if (currentMode == WIFI_AP) {
      WiFi.mode(WIFI_AP_STA);
    } else {
      // Otherwise go to pure STA mode
      WiFi.mode(WIFI_STA);
    }
    delay(200);  // Allow mode transition to complete
    yield();
  }
#else
  // ESP8266: Only connect if STA mode is not enabled
  if ((WiFi.getMode() & WIFI_STA) == 0) {
    Serial.println(F("Connecting to WiFi."));
#endif
    
    if (_state.staticIPConfig) {
      // configure for static IP
      Serial.println(F("Configuring static IP"));
      WiFi.config(_state.localIP, _state.gatewayIP, _state.subnetMask, _state.dnsIP1, _state.dnsIP2);
    } else {
      // configure for DHCP
      Serial.println(F("Configuring DHCP"));
#ifdef ESP32
      WiFi.config(INADDR_NONE, INADDR_NONE, INADDR_NONE);
      WiFi.setHostname(_state.hostname.c_str());
#elif defined(ESP8266)
      WiFi.config(INADDR_ANY, INADDR_ANY, INADDR_ANY);
      WiFi.hostname(_state.hostname);
#endif
    }
    
    yield();  // Feed watchdog before connection attempt
    
    // attempt to connect to the network
    Serial.printf("[%lu] Attempting to connect to SSID: %s (attempt %d)\n", 
                  millis(), _state.ssid.c_str(),
#ifdef ESP32
                  _connectionRetries + 1
#else
                  1
#endif
                  );
    
#ifdef ESP32
    // ESP32: Use waitForConnectResult for timeout-based connection
    WiFi.begin(_state.ssid.c_str(), _state.password.c_str());
    wl_status_t result = (wl_status_t)WiFi.waitForConnectResult(CONNECTION_TIMEOUT);
    
    if (result == WL_CONNECTED) {
      Serial.printf("[%lu] WiFi connected successfully!\n", millis());
      Serial.printf("[%lu] IP address: %s\n", millis(), WiFi.localIP().toString().c_str());
      Serial.printf("[%lu] Signal strength: %d dBm\n", millis(), WiFi.RSSI());
      Serial.printf("[%lu] Connection time: %lu ms\n", millis(), CONNECTION_TIMEOUT);
      _connectionRetries = 0; // Reset retry counter on success
    } else {
      Serial.printf("[%lu] WiFi connection failed with status: %d\n", millis(), result);
      handleConnectionFailure(result);
    }
#else
    // ESP8266: Keep existing simple approach
    WiFi.begin(_state.ssid.c_str(), _state.password.c_str());
#endif
    
    yield();  // Feed watchdog after connection attempt
#ifndef ESP32
  }  // Close ESP8266 if statement
#endif
}

#ifdef ESP32
void WiFiSettingsService::handleConnectionFailure(wl_status_t status) {
  _connectionRetries++;
  
  // Log specific failure reasons
  const char* statusMsg;
  switch(status) {
    case WL_NO_SSID_AVAIL:
      statusMsg = "SSID not found";
      break;
    case WL_CONNECT_FAILED:
      statusMsg = "Connection failed";
      break;
    case WL_CONNECTION_LOST:
      statusMsg = "Connection lost";
      break;
    case WL_DISCONNECTED:
      statusMsg = "Disconnected";
      break;
    default:
      statusMsg = "Unknown error";
      break;
  }
  
  Serial.printf("[%lu] WiFi connection failed (attempt %d/%d): %s (code: %d)\n", 
                millis(), _connectionRetries, MAX_RETRIES, statusMsg, status);
  
  if (_connectionRetries >= MAX_RETRIES) {
    Serial.printf("[%lu] Maximum connection retries reached!\n", millis());
    Serial.printf("[%lu] Restarting ESP32 in 2 seconds...\n", millis());
    
    // Give time for serial output
    delay(2000);
    yield();
    
    // Restart the ESP32
    ESP.restart();
  } else {
    // Add exponential backoff delay
    unsigned long backoffDelay = 1000 * _connectionRetries; // 1s, 2s, 3s
    Serial.printf("[%lu] Retrying connection in %lu ms...\n", millis(), backoffDelay);
    delay(backoffDelay);
    yield();
  }
}

void WiFiSettingsService::onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  // Feed watchdog and add delay to prevent rapid disconnections
  yield();
  
  // Enhanced disconnect reason logging
  wifi_err_reason_t reason = (wifi_err_reason_t)info.wifi_sta_disconnected.reason;
  const char* reasonMsg;
  
  switch(reason) {
    case WIFI_REASON_UNSPECIFIED:
      reasonMsg = "Unspecified";
      break;
    case WIFI_REASON_AUTH_EXPIRE:
      reasonMsg = "Authentication expired";
      break;
    case WIFI_REASON_AUTH_LEAVE:
      reasonMsg = "Authentication left";
      break;
    case WIFI_REASON_ASSOC_EXPIRE:
      reasonMsg = "Association expired";
      break;
    case WIFI_REASON_ASSOC_TOOMANY:
      reasonMsg = "Too many associations";
      break;
    case WIFI_REASON_NOT_AUTHED:
      reasonMsg = "Not authenticated";
      break;
    case WIFI_REASON_NOT_ASSOCED:
      reasonMsg = "Not associated";
      break;
    case WIFI_REASON_ASSOC_LEAVE:
      reasonMsg = "Association leave";
      break;
    case WIFI_REASON_ASSOC_NOT_AUTHED:
      reasonMsg = "Association not authenticated";
      break;
    case WIFI_REASON_DISASSOC_PWRCAP_BAD:
      reasonMsg = "Power capability bad";
      break;
    case WIFI_REASON_DISASSOC_SUPCHAN_BAD:
      reasonMsg = "Supported channel bad";
      break;
    case WIFI_REASON_IE_INVALID:
      reasonMsg = "IE invalid";
      break;
    case WIFI_REASON_MIC_FAILURE:
      reasonMsg = "MIC failure";
      break;
    case WIFI_REASON_4WAY_HANDSHAKE_TIMEOUT:
      reasonMsg = "4-way handshake timeout";
      break;
    case WIFI_REASON_GROUP_KEY_UPDATE_TIMEOUT:
      reasonMsg = "Group key update timeout";
      break;
    case WIFI_REASON_IE_IN_4WAY_DIFFERS:
      reasonMsg = "IE in 4-way differs";
      break;
    case WIFI_REASON_GROUP_CIPHER_INVALID:
      reasonMsg = "Group cipher invalid";
      break;
    case WIFI_REASON_PAIRWISE_CIPHER_INVALID:
      reasonMsg = "Pairwise cipher invalid";
      break;
    case WIFI_REASON_AKMP_INVALID:
      reasonMsg = "AKMP invalid";
      break;
    case WIFI_REASON_UNSUPP_RSN_IE_VERSION:
      reasonMsg = "Unsupported RSN IE version";
      break;
    case WIFI_REASON_INVALID_RSN_IE_CAP:
      reasonMsg = "Invalid RSN IE cap";
      break;
    case WIFI_REASON_802_1X_AUTH_FAILED:
      reasonMsg = "802.1X authentication failed";
      break;
    case WIFI_REASON_CIPHER_SUITE_REJECTED:
      reasonMsg = "Cipher suite rejected";
      break;
    case WIFI_REASON_BEACON_TIMEOUT:
      reasonMsg = "Beacon timeout - weak signal";
      break;
    case WIFI_REASON_NO_AP_FOUND:
      reasonMsg = "Access point not found";
      break;
    case WIFI_REASON_AUTH_FAIL:
      reasonMsg = "Authentication failed - check password";
      break;
    case WIFI_REASON_ASSOC_FAIL:
      reasonMsg = "Association failed";
      break;
    case WIFI_REASON_HANDSHAKE_TIMEOUT:
      reasonMsg = "Handshake timeout";
      break;
    case WIFI_REASON_CONNECTION_FAIL:
      reasonMsg = "Connection failed";
      break;
    default:
      reasonMsg = "Unknown reason";
      break;
  }
  
  Serial.printf("[%lu] WiFi disconnected: %s (reason: %d)\n", millis(), reasonMsg, reason);
  
  // Reset retry counter on disconnect to allow fresh attempts
  _connectionRetries = 0;
  
  // More graceful disconnection to prevent watchdog resets
  WiFi.disconnect(false);  // Don't erase stored credentials
  delay(50);  // Small delay to prevent rapid cycling
  yield();
}

void WiFiSettingsService::onStationModeStop(WiFiEvent_t event, WiFiEventInfo_t info) {
  yield();  // Feed watchdog
  
  if (_stopping) {
    Serial.printf("[%lu] WiFi stop event received\n", millis());
    _lastConnectionAttempt = 0;
    _stopping = false;
  }
}
#elif defined(ESP8266)
void WiFiSettingsService::onStationModeDisconnected(const WiFiEventStationModeDisconnected& event) {
  WiFi.disconnect(true);
}
#endif
