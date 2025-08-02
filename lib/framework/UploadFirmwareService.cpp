#include <UploadFirmwareService.h>

UploadFirmwareService::UploadFirmwareService(AsyncWebServer* server, SecurityManager* securityManager) :
    _securityManager(securityManager) {
  server->on(UPLOAD_FIRMWARE_PATH,
             HTTP_POST,
             std::bind(&UploadFirmwareService::uploadComplete, this, std::placeholders::_1),
             std::bind(&UploadFirmwareService::handleUpload,
                       this,
                       std::placeholders::_1,
                       std::placeholders::_2,
                       std::placeholders::_3,
                       std::placeholders::_4,
                       std::placeholders::_5,
                       std::placeholders::_6));
#ifdef ESP8266
  Update.runAsync(true);
#endif
}

void UploadFirmwareService::handleUpload(AsyncWebServerRequest* request,
                                         const String& filename,
                                         size_t index,
                                         uint8_t* data,
                                         size_t len,
                                         bool final) {
  if (!index) {
    Authentication authentication = _securityManager->authenticateRequest(request);
    if (AuthenticationPredicates::IS_ADMIN(authentication)) {
      Serial.printf("Starting firmware upload, size: %u bytes\n", request->contentLength());
      
      // Ensure we have enough space for the update
      size_t contentLength = request->contentLength();
      if (contentLength == 0) {
        Serial.println("ERROR: No content length provided");
        handleError(request, 400);
        return;
      }
      
      // Check available space
      size_t freeSpace = ESP.getFreeSketchSpace();
      Serial.printf("Available space: %u bytes, Required: %u bytes\n", freeSpace, contentLength);
      
      if (contentLength > freeSpace) {
        Serial.println("ERROR: Not enough space for firmware update");
        handleError(request, 507);  // Insufficient Storage
        return;
      }
      
#ifdef ESP32
      // For ESP32, explicitly specify the partition type
      if (Update.begin(contentLength, U_FLASH)) {
#else
      // For ESP8266
      if (Update.begin(contentLength)) {
#endif
        Serial.println("Update.begin() successful");
        // success, let's make sure we end the update if the client hangs up
        request->onDisconnect(UploadFirmwareService::handleEarlyDisconnect);
      } else {
        // failed to begin, send an error response
        Serial.println("ERROR: Update.begin() failed");
        Update.printError(Serial);
        handleError(request, 500);
      }
    } else {
      // send the forbidden response
      Serial.println("ERROR: Authentication failed for firmware upload");
      handleError(request, 403);
    }
  }

  // if we haven't dealt with an error, continue with the update
  if (!request->_tempObject) {
    size_t written = Update.write(data, len);
    if (written != len) {
      Serial.printf("ERROR: Update.write() failed. Expected: %u, Written: %u\n", len, written);
      Update.printError(Serial);
      handleError(request, 500);
      return;
    }
    
    if (final) {
      Serial.printf("Finalizing update. Total bytes written: %u\n", Update.progress());
      if (!Update.end(true)) {
        Serial.println("ERROR: Update.end() failed");
        Update.printError(Serial);
        handleError(request, 500);
      } else {
        Serial.println("Firmware update completed successfully");
      }
    }
  }
}

void UploadFirmwareService::uploadComplete(AsyncWebServerRequest* request) {
  // if no error, send the success response
  if (!request->_tempObject) {
    Serial.println("Firmware upload completed, sending success response");
    
    // Send response first
    AsyncWebServerResponse* response = request->beginResponse(200);
    request->send(response);
    
    // Schedule restart with delay to ensure response is sent
    Serial.println("Scheduling device restart in 3 seconds...");
    
    // Use a simple delayed restart
    static bool restartScheduled = false;
    if (!restartScheduled) {
      restartScheduled = true;
      
      // Create a delayed restart task
      static auto restartTask = []() {
        delay(3000);  // Wait 3 seconds for response to be fully sent
        Serial.println("Restarting device now after firmware update...");
        WiFi.disconnect(true);
        delay(1000);
        ESP.restart();
      };
      
      // Execute restart on disconnect or after delay
      request->onDisconnect(restartTask);
    }
  }
}

void UploadFirmwareService::handleError(AsyncWebServerRequest* request, int code) {
  // if we have had an error already, do nothing
  if (request->_tempObject) {
    return;
  }
  
  Serial.printf("Firmware upload error: HTTP %d\n", code);
  
  // Clean up any ongoing update
  if (Update.isRunning()) {
    Serial.println("Aborting ongoing update due to error");
#ifdef ESP32
    Update.abort();
#elif defined(ESP8266)
    Update.end();
#endif
  }
  
  // send the error code to the client and record the error code in the temp object
  request->_tempObject = new int(code);
  
  // Provide more detailed error messages
  String errorMessage = "Unknown error";
  switch(code) {
    case 400: errorMessage = "Bad Request - Invalid firmware file"; break;
    case 403: errorMessage = "Forbidden - Authentication required"; break;
    case 500: errorMessage = "Internal Server Error - Update failed"; break;
    case 507: errorMessage = "Insufficient Storage - Not enough flash space"; break;
  }
  
  AsyncWebServerResponse* response = request->beginResponse(code, "text/plain", errorMessage);
  request->send(response);
}

void UploadFirmwareService::handleEarlyDisconnect() {
  Serial.println("Client disconnected during firmware upload");
  if (Update.isRunning()) {
    Serial.printf("Update was running, progress: %u bytes\n", Update.progress());
#ifdef ESP32
    Update.abort();
    Serial.println("Update aborted due to early disconnect");
#elif defined(ESP8266)
    Update.end();
    Serial.println("Update ended due to early disconnect");
#endif
  }
}

void UploadFirmwareService::printUpdateStatus() {
  Serial.println("=== Firmware Update Status ===");
  Serial.printf("Update running: %s\n", Update.isRunning() ? "YES" : "NO");
  Serial.printf("Update progress: %u bytes\n", Update.progress());
  Serial.printf("Update size: %u bytes\n", Update.size());
  Serial.printf("Update remaining: %u bytes\n", Update.remaining());
  Serial.printf("Free sketch space: %u bytes\n", ESP.getFreeSketchSpace());
  Serial.printf("Sketch size: %u bytes\n", ESP.getSketchSize());
  
#ifdef ESP32
  // Check for update errors
  if (Update.hasError()) {
    Serial.println("Update has errors:");
    Update.printError(Serial);
  } else {
    Serial.println("No update errors detected");
  }
#endif
  
  Serial.println("==============================");
}
