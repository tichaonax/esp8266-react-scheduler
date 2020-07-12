#include "ChannelMqttSettingsService.h"

ChannelMqttSettingsService::ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
char* brokerJsonConfigPath, String restBrokerEndPoint, int channelControlPin) :
    _httpEndpoint(ChannelMqttSettings::read,
                  ChannelMqttSettings::update,
                  this,
                  server,
                  restBrokerEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _fsPersistence(ChannelMqttSettings::read, ChannelMqttSettings::update, this, fs, brokerJsonConfigPath) {
  _channelControlPin = channelControlPin;
}

void ChannelMqttSettingsService::begin() {
   _state.channelControlPin = _channelControlPin;
  _fsPersistence.readFromFS();
}
