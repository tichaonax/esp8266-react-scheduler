#include "SystemStateService.h"

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
}

void SystemStateService::begin() {
  _systemHeartBeat.attach(10, std::bind(&SystemStateService::changeState, this));
}

void SystemStateService::changeState()
{
    update([&](SystemState& systemState) {
        return StateUpdateResult::CHANGED;
    }, "systemHeartBeat");
}