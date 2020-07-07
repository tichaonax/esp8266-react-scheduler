#include "SystemStateService.h"
//#include <Ticker.h>

SystemStateService::SystemStateService(AsyncWebServer* server,
                                     SecurityManager* securityManager) :
  _httpEndpoint(SystemState::read,
                  SystemState::update,
                  this,
                  server,
                  SYSTEM_STATE_ENDPOINT_PATH,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _webSocket(SystemState::read,
               SystemState::update,
               this,
               server,
               SYSTEM_STATE_SOCKET_PATH,
               securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED){
  addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);
}

void SystemStateService::begin() {
  onConfigUpdated();
}

void SystemStateService::onConfigUpdated() {
}