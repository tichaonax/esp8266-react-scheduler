#include <UploadFirmwareService.h>

UploadFirmwareService::UploadFirmwareService(AsyncWebServer* server, SecurityManager* securityManager) :
    _securityManager(securityManager) {
  server->on(UPLOAD_FIRMWARE_PATH,
             HTTP_POST,
             [this](AsyncWebServerRequest *request) {
               this->uploadComplete(request);
             },
             [this](AsyncWebServerRequest *request, const String& filename, size_t index, uint8_t *data, size_t len, bool final) {
               this->handleUpload(request, filename, index, data, len, final);
             });
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
      size_t contentLength = request->contentLength();
      if (contentLength == 0) {
        handleError(request, 400);
        return;
      }
      
      size_t freeSpace = ESP.getFreeSketchSpace();
      if (contentLength > freeSpace) {
        handleError(request, 507);  // Insufficient Storage
        return;
      }
      
      if (contentLength < 100000) {  // Less than 100KB is probably not a valid firmware
        handleError(request, 400);  // Bad Request
        return;
      }
      
#ifdef ESP32
      // For ESP32, explicitly specify the partition type
      if (Update.begin(contentLength, U_FLASH)) {
#else
      // For ESP8266
      if (Update.begin(contentLength)) {
#endif
        // success, let's make sure we end the update if the client hangs up
        request->onDisconnect(UploadFirmwareService::handleEarlyDisconnect);
      } else {
        // failed to begin, send an error response
        Update.printError(Serial);
        handleError(request, 500);
      }
    } else {
      // send the forbidden response
      handleError(request, 403);
    }
  }

  // if we haven't dealt with an error, continue with the update
  if (!request->_tempObject) {
    size_t written = Update.write(data, len);
    if (written != len) {
      Update.printError(Serial);
      handleError(request, 500);
      return;
    }
    
    if (final) {
      if (!Update.end(true)) {
        Update.printError(Serial);
        handleError(request, 500);
      }
    }
  }
}

void UploadFirmwareService::uploadComplete(AsyncWebServerRequest* request) {
  // if no error, send the success response
  if (!request->_tempObject) {
    // Double-check that the update actually completed successfully
    if (Update.hasError()) {
      Update.printError(Serial);
      handleError(request, 500);
      return;
    }
    
    // Check if the update process was successful
    // Note: We need to handle the case where Update.progress() is broken but writes succeeded
    size_t expectedSize = request->contentLength();
    size_t updateProgress = Update.progress();
    
    // If Update library progress tracking is broken (returns 0) but we had successful writes,
    // we need to check other indicators
    if (updateProgress == 0) {
      // Since Update.progress() is unreliable, rely on Update.end() success
      // If Update.end() succeeded, the firmware was likely written correctly
      if (!Update.isFinished()) {
        handleError(request, 500);
        return;
      }
    } else {
      // Normal validation when progress tracking works
      if (updateProgress != expectedSize) {
        handleError(request, 500);
        return;
      }
    }
    
    // Send response first
    AsyncWebServerResponse* response = request->beginResponse(200);
    request->send(response);
    
    // Use the existing RestartService instead of custom restart logic
    request->onDisconnect(RestartService::restartNow);
  }
}

void UploadFirmwareService::handleError(AsyncWebServerRequest* request, int code) {
  // if we have had an error already, do nothing
  if (request->_tempObject) {
    return;
  }
  
  // Clean up any ongoing update
  if (Update.isRunning()) {
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
  if (Update.isRunning()) {
#ifdef ESP32
    Update.abort();
#elif defined(ESP8266)
    Update.end();
#endif
  }
}

void UploadFirmwareService::printUpdateStatus() {
  Serial.printf("Update running: %s, Progress: %u/%u bytes\n", 
                Update.isRunning() ? "YES" : "NO", 
                Update.progress(), 
                Update.size());
  
#ifdef ESP32
  if (Update.hasError()) {
    Update.printError(Serial);
  }
#endif
}
