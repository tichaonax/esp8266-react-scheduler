#include "channels.h"
#include "ChannelStateService.h"

ChannelStateService::ChannelStateService(const ChannelStateConfig& config) :
    _httpEndpoint(ChannelState::read,
                  ChannelState::update,
                  this,
                  config.server,
                  config.restChannelEndPoint,
                  config.securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(ChannelState::haRead, ChannelState::haUpdate, this, config.mqttClient),
    _webSocket(ChannelState::read,
               ChannelState::wsUpdate,
               this,
               config.server,
               config.webSocketChannelEndPoint,
               config.securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttClient(config.mqttClient),
    _channelMqttSettingsService(config.channelMqttSettingsService),
    _fsPersistence(ChannelState::read,
                ChannelState::update,
                this, 
                config.fs,
                config.channelJsonConfigPath,
                DEFAULT_JSON_DOCUMENT_SIZE)
{
    initializeFromConfig(config);
}

ChannelStateService::ChannelStateService(AsyncWebServer* server,
                                      SecurityManager* securityManager,
                                      AsyncMqttClient* mqttClient,
                                      FS* fs,
                                      uint8_t channelControlPin,
                                      const char* channelJsonConfigPath,
                                      String restChannelEndPoint,
                                      const char* webSocketChannelEndPoint,
                                      float  runEvery,
                                      float  offAfter,
                                      int  startTimeHour,
                                      int  startTimeMinute,
                                      int  endTimeHour,
                                      int  endTimeMinute,
                                      bool    enabled,
                                      String  channelName,
                                      bool enableTimeSpan,
                                      ChannelMqttSettingsService* channelMqttSettingsService,
                                      bool randomize,
                                      float hotTimeHour,
                                      float overrideTime,
                                      bool enableMinimumRunTime,
                                      uint8_t homeAssistantTopicType,
                                      String homeAssistantIcon,
                                      bool enableRemoteConfiguration,
                                      String masterIPAddress,
                                      String restChannelRestartEndPoint,
                                      bool enableDateRange,
                                      bool activeOutsideDateRange,
                                      String  activeStartDateRange,
                                      String  activeEndDateRange,
                                      String buildVersion,
                                      String weekDays,
                                      bool autoRebootSystem) :
    _httpEndpoint(ChannelState::read,
                  ChannelState::update,
                  this,
                  server,
                  restChannelEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(ChannelState::haRead, ChannelState::haUpdate, this, mqttClient),
    _webSocket(ChannelState::read,
               ChannelState::wsUpdate,
               this,
               server,
               webSocketChannelEndPoint,
               securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttClient(mqttClient),
    _channelMqttSettingsService(channelMqttSettingsService),
    _fsPersistence(ChannelState::read,
                ChannelState::update,
                this, fs,
                channelJsonConfigPath,
                DEFAULT_JSON_DOCUMENT_SIZE)
                {
    // Store essential runtime configuration
    _channelControlPin = channelControlPin;
    
    // Configure controls to be output
    pinMode(_channelControlPin, OUTPUT);
    
    // Configure MQTT callback
    _mqttClient->onConnect(std::bind(&ChannelStateService::registerConfig, this));
    
    // Initialize the channel state with configuration values  
    _state.channel.controlPin = channelControlPin;
    _state.channel.name = channelName;
    _state.channel.homeAssistantTopicType = homeAssistantTopicType;
    _state.channel.homeAssistantIcon = homeAssistantIcon;
    _state.channel.enabled = enabled;
    _state.channel.enableTimeSpan = enableTimeSpan;
    _state.channel.randomize = randomize;
    _state.channel.enableMinimumRunTime = enableMinimumRunTime;
    _state.channel.enableRemoteConfiguration = enableRemoteConfiguration;
    _state.channel.masterIPAddress = masterIPAddress;
    _state.channel.restChannelEndPoint = restChannelEndPoint;
    _state.channel.restChannelRestartEndPoint = restChannelRestartEndPoint;
    _state.channel.enableDateRange = enableDateRange;
    _state.channel.activeOutsideDateRange = activeOutsideDateRange;
    _state.channel.activeStartDateRange = activeStartDateRange;
    _state.channel.activeEndDateRange = activeEndDateRange;
    _state.channel.buildVersion = buildVersion;
    _state.channel.autoRebootSystem = autoRebootSystem;
    
    // Parse weekDays string
    for (int i = 0; i < 7; i++) {
        _state.channel.schedule.weekDays[i] = -1;
    }
    String weekDaysStr = weekDays;
    while (weekDaysStr.length() > 0) {
        int index = weekDaysStr.indexOf(',');
        if (index == -1) {
            int day = weekDaysStr.toInt();
            _state.channel.schedule.weekDays[day] = day;
            break;
        } else {
            int day = weekDaysStr.substring(0, index).toInt();
            weekDaysStr = weekDaysStr.substring(index + 1);
            _state.channel.schedule.weekDays[day] = day;
        }
    }
    
    // Convert time units and store in schedule
    _state.channel.schedule.runEvery = (int)(round(60 * runEvery));
    _state.channel.schedule.offAfter = (int)(round(60 * offAfter));
    _state.channel.schedule.startTimeHour = (int)(round(3600 * startTimeHour));
    _state.channel.schedule.startTimeMinute = (int)(round(60 * startTimeMinute));
    _state.channel.schedule.endTimeHour = (int)(round(3600 * endTimeHour));
    _state.channel.schedule.endTimeMinute = (int)(round(60 * endTimeMinute));
    _state.channel.schedule.hotTimeHour = (int)(round(3600 * hotTimeHour));
    _state.channel.schedule.overrideTime = (int)(round(60 * overrideTime));
    
    // Initialize runtime state
    _state.channel.controlOn = false;
    _state.channel.isHotScheduleActive = false;
    _state.channel.schedule.isOverride = false;
    _state.channel.schedule.isOverrideActive = false;
    _state.channel.lastStartedChangeTime = "";
    _state.channel.nextRunTime = "";
    _state.channel.localDateTime = "";
    _state.channel.IP = "";
    _state.channel.offHotHourDateTime = "";
    _state.channel.controlOffDateTime = "";
    
    // Configure MQTT settings service update handler
    _channelMqttSettingsService->addUpdateHandler([&](const String& originId) {
        registerPinConfig(_state.channel.controlPin, _state.channel.homeAssistantTopicType);
    }, false);
    
    // Configure settings service update handler to update CONTROL state
    addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);
    
    // Setup WiFi event handlers (platform-specific)
    #ifdef ESP32
    WiFi.onEvent(
        std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
        WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
    WiFi.onEvent(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
                 WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
    #elif defined(ESP8266)
    _onStationModeDisconnectedHandler = WiFi.onStationModeDisconnected(
        std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1));
    _onStationModeGotIPHandler =
        WiFi.onStationModeGotIP(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1));
    #endif
}

void ChannelStateService::initializeFromConfig(const ChannelStateConfig& config) {
    // Store essential runtime configuration
    _channelControlPin = config.channelControlPin;
    
    // Configure controls to be output
    pinMode(_channelControlPin, OUTPUT);
    
    // Configure MQTT callback
    _mqttClient->onConnect(std::bind(&ChannelStateService::registerConfig, this));
    
    // Initialize the channel state with configuration values
    _state.channel.controlPin = config.channelControlPin;
    _state.channel.name = config.channel.name;
    _state.channel.homeAssistantTopicType = config.channel.homeAssistantTopicType;
    _state.channel.homeAssistantIcon = config.channel.homeAssistantIcon;
    _state.channel.enabled = config.schedule.enabled;
    _state.channel.enableTimeSpan = config.schedule.enableTimeSpan;
    _state.channel.randomize = config.schedule.randomize;
    _state.channel.enableMinimumRunTime = config.schedule.enableMinimumRunTime;
    _state.channel.enableRemoteConfiguration = config.channel.enableRemoteConfiguration;
    _state.channel.masterIPAddress = config.channel.masterIPAddress;
    _state.channel.restChannelEndPoint = config.restChannelEndPoint;
    _state.channel.restChannelRestartEndPoint = config.channel.restChannelRestartEndPoint;
    _state.channel.enableDateRange = config.dateRange.enableDateRange;
    _state.channel.activeOutsideDateRange = config.dateRange.activeOutsideDateRange;
    _state.channel.activeStartDateRange = config.dateRange.activeStartDateRange;
    _state.channel.activeEndDateRange = config.dateRange.activeEndDateRange;
    _state.channel.buildVersion = config.system.buildVersion;
    _state.channel.autoRebootSystem = config.system.autoRebootSystem;
    
    // Parse weekDays string
    for (int i = 0; i < 7; i++) {
        _state.channel.schedule.weekDays[i] = -1;
    }
    String weekDaysStr = config.dateRange.weekDays;
    while (weekDaysStr.length() > 0) {
        int index = weekDaysStr.indexOf(',');
        if (index == -1) {
            int day = weekDaysStr.toInt();
            _state.channel.schedule.weekDays[day] = day;
            break;
        } else {
            int day = weekDaysStr.substring(0, index).toInt();
            weekDaysStr = weekDaysStr.substring(index + 1);
            _state.channel.schedule.weekDays[day] = day;
        }
    }
    
    // Convert time units and store in schedule
    _state.channel.schedule.runEvery = (int)(round(60 * config.schedule.runEvery));
    _state.channel.schedule.offAfter = (int)(round(60 * config.schedule.offAfter));
    _state.channel.schedule.startTimeHour = (int)(round(3600 * config.schedule.startTimeHour));
    _state.channel.schedule.startTimeMinute = (int)(round(60 * config.schedule.startTimeMinute));
    _state.channel.schedule.endTimeHour = (int)(round(3600 * config.schedule.endTimeHour));
    _state.channel.schedule.endTimeMinute = (int)(round(60 * config.schedule.endTimeMinute));
    _state.channel.schedule.hotTimeHour = (int)(round(3600 * config.schedule.hotTimeHour));
    _state.channel.schedule.overrideTime = (int)(round(60 * config.schedule.overrideTime));
    
    // Initialize runtime state
    _state.channel.controlOn = false;
    _state.channel.isHotScheduleActive = false;
    _state.channel.schedule.isOverride = false;
    _state.channel.schedule.isOverrideActive = false;
    _state.channel.lastStartedChangeTime = "";
    _state.channel.nextRunTime = "";
    _state.channel.localDateTime = "";
    _state.channel.IP = "";
    _state.channel.offHotHourDateTime = "";
    _state.channel.controlOffDateTime = "";
    
    // Configure MQTT settings service update handler
    _channelMqttSettingsService->addUpdateHandler([&](const String& originId) {
        registerPinConfig(_state.channel.controlPin, _state.channel.homeAssistantTopicType);
    }, false);
    
    // Configure settings service update handler to update CONTROL state
    addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);
    
    // Setup WiFi event handlers (platform-specific)
    #ifdef ESP32
    WiFi.onEvent(
        std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
        WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
    WiFi.onEvent(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
                 WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
    #elif defined(ESP8266)
    _onStationModeDisconnectedHandler = WiFi.onStationModeDisconnected(
        std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1));
    _onStationModeGotIPHandler =
        WiFi.onStationModeGotIP(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1));
    #endif
}

#ifdef ESP32
void ChannelStateService::onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  // ESP32: Avoid immediate WebSocket updates during WiFi events to prevent heap corruption
  // Store IP for later update in main loop instead of immediate WebSocket transmission
  Serial.printf("[%lu] ESP32 got IP: %s, deferring state update\n", 
                millis(), WiFi.localIP().toString().c_str());
  
  // Just update the state without triggering WebSocket updates immediately
  _state.channel.IP = WiFi.localIP().toString();
  // Note: WebSocket clients will get updated on next regular state transmission
}

void ChannelStateService::onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  updateStateIP("");
}
#elif defined(ESP8266)
void ChannelStateService::onStationModeGotIP(const WiFiEventStationModeGotIP& event) {
  updateStateIP(WiFi.localIP().toString());
}

void ChannelStateService::onStationModeDisconnected(const WiFiEventStationModeDisconnected& event) {
  updateStateIP("");
}

#endif
void ChannelStateService::onConfigUpdated() {
  digitalWrite(_state.channel.controlPin, _state.channel.controlOn ? CONTROL_ON : CONTROL_OFF);
}

void ChannelStateService::registerPinConfig(uint8_t controlPin, uint8_t homeAssistantTopicType) {
  if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;
  String subTopic;
  String pubTopic;

  DynamicJsonDocument doc(DEFAULT_JSON_DOCUMENT_SIZE);
  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    String mqttPath = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, false, settings.homeAssistantEntity);

    String uniqueId = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, true);

    String name;
    #ifdef MQTT_FRIENDLY_NAME
        name = _state.channel.name;
    #else
        name = SettingValue::format(_state.channel.name + " : #{unique_id}");
    #endif

    configTopic = mqttPath + "/config";
    subTopic = mqttPath + "/set";
    pubTopic = mqttPath + "/state";
    doc["~"] = mqttPath;
    doc["name"] = name;
    doc["unique_id"] = uniqueId;
    doc["json_attributes_topic"] = "~/state";
    doc["cmd_t"] = "~/set";
    doc["stat_t"] = "~/state";

    switch (_state.channel.homeAssistantTopicType)
    {
      case HOMEASSISTANT_TOPIC_TYPE_SWITCH:
        doc["icon"] = _state.channel.homeAssistantIcon; //"mdi:water-pump";
        doc["payload_on"] = utils.makeConfigPayload(true, _state.channel, controlPin);
        doc["payload_off"] = utils.makeConfigPayload(false, _state.channel, controlPin);
        break;
      default:
        doc["schema"] = "json";
        break;
    }
  });

  String payload;
  serializeJson(doc, payload);

  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

  _mqttPubSub.configureTopics(pubTopic, subTopic);
}

void ChannelStateService::registerConfig() {
  registerPinConfig(_state.channel.controlPin, _state.channel.homeAssistantTopicType);
}

void ChannelStateService::mqttUnregisterConfig(uint8_t controlPin, uint8_t homeAssistantTopicType) {
   if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;

  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    String mqttPath = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, false, settings.homeAssistantEntity);

    String uniqueId = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, true);

    configTopic = mqttPath + "/config";
  });

  String payload;

  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());
}

void updateStateTimeTicker(ChannelStateService* channelStateService){
  channelStateService->updateStateTime();
}

void mqttRepublishTicker(ChannelStateService* channelStateService){
  channelStateService->mqttRepublishReattach();
  channelStateService->mqttRepublish();
}

void ChannelStateService::mqttRepublishReattach(){
  _deviceTime.detach();
  _mqttRepublish.detach();
  
  _deviceTime.attach(15, updateStateTimeTicker, this);
  _mqttRepublish.attach(5, mqttRepublishTicker, this);
}

void ChannelStateService::begin() {
    // Configuration is already initialized during construction
    // Just handle startup procedures
    _fsPersistence.readFromFS();
    _state.channel.controlOn = DEFAULT_CONTROL_STATE; // must be off on start up
    onConfigUpdated();
    _channelMqttSettingsService->begin();
    _deviceTime.attach(15, updateStateTimeTicker, this);
    _mqttRepublish.attach(5, mqttRepublishTicker, this);
}

Channel ChannelStateService::getChannel(){
  return _state.channel;
}

void ChannelStateService::updateStateTime(){
  update([&](ChannelState& channelState) {  
    return StateUpdateResult::CHANGED;
  }, _state.channel.name);
}

void ChannelStateService::updateStateIP(String IPAddress){
  update([&](ChannelState& channelState) {  
    channelState.channel.IP = IPAddress;
    return StateUpdateResult::CHANGED;
  }, _state.channel.name);
}

void ChannelStateService::mqttRepublish(){
  registerConfig();
}

void ChannelStateService::mqttRepublish(uint8_t controlPin, uint8_t homeAssistantTopicType){
  registerPinConfig(controlPin, homeAssistantTopicType);
}
