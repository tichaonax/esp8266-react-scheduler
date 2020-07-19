#include "ChannelMqttSettingsService.h"

ChannelMqttSettingsService::ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
char* brokerJsonConfigPath, String restBrokerEndPoint, int channelControlPin, String  channelName, String homeAssistantEntity) :
    _httpEndpoint(ChannelMqttSettings::read,
                  ChannelMqttSettings::update,
                  this,
                  server,
                  restBrokerEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _fsPersistence(ChannelMqttSettings::read, ChannelMqttSettings::update, this, fs, brokerJsonConfigPath) {
  _channelControlPin = channelControlPin;
  _channelName = channelName;
  _homeAssistantEntity = homeAssistantEntity;
}

void ChannelMqttSettingsService::begin() {
   _state.channelControlPin = _channelControlPin;
   _state.channelName = _channelName;
   _state.homeAssistantEntity = _homeAssistantEntity;
  _fsPersistence.readFromFS();
}
