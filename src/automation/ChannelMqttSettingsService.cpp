#include "ChannelMqttSettingsService.h"

ChannelMqttSettingsService::ChannelMqttSettingsService(
    AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
    char* channelBrokerJsonConfigPath,
    String defaultQqttPathlName,
    String restChannelBrokerEndPoint) :
    _httpEndpoint(ChannelMqttSettings::read,
                  ChannelMqttSettings::update,
                  this,
                  server,
                  restChannelBrokerEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _fsPersistence(ChannelMqttSettings::read, ChannelMqttSettings::update, this, fs, channelBrokerJsonConfigPath) {
}

void ChannelMqttSettingsService::begin() {
  _state.mqttPath = _defaultMqttPathlName;
  _fsPersistence.readFromFS();
}
