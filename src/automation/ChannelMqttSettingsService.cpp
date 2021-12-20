#include "ChannelMqttSettingsService.h"

ChannelMqttSettingsService::ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
char* brokerJsonConfigPath, String restBrokerEndPoint, uint8_t channelControlPin, String  channelName, String homeAssistantEntity,
uint8_t homeAssistantTopicType, String homeAssistantIcon) :
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
  _homeAssistantTopicType  = homeAssistantTopicType;
  _homeAssistantIcon = homeAssistantIcon;
}

void ChannelMqttSettingsService::begin() {
   _state.channelControlPin = _channelControlPin;
   _state.channelName = _channelName;
   _state.homeAssistantEntity = _homeAssistantEntity;
   _state.homeAssistantTopicType = _homeAssistantTopicType;
   _state.homeAssistantIcon = _homeAssistantIcon;
  _fsPersistence.readFromFS();
}
