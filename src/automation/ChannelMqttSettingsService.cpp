#include "ChannelMqttSettingsService.h"

ChannelMqttSettingsService::ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
char* brokerJsonConfigPath, String restBrokerEndPoint) :
    _httpEndpoint(ChannelMqttSettings::read,
                  ChannelMqttSettings::update,
                  this,
                  server,
                  restBrokerEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _fsPersistence(ChannelMqttSettings::read, ChannelMqttSettings::update, this, fs, brokerJsonConfigPath) {
}

void ChannelMqttSettingsService::begin() {
  _fsPersistence.readFromFS();
}
