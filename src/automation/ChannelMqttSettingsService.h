#ifndef ChannelMqttSettingsService_h
#define ChannelMqttSettingsService_h

#include <HttpEndpoint.h>
#include <FSPersistence.h>
#include <SettingValue.h>
#include "channels.h"
#include "ChannelState.h"

#define CHANNEL_ONE_BROKER_SETTINGS_FILE "/config/C1BrokerSettings.json"
#define CHANNEL_ONE_BROKER_SETTINGS_PATH "/rest/ChannelOneBrokerSettings"
#define CHANNEL_TWO_BROKER_SETTINGS_FILE "/config/C2BrokerSettings.json"
#define CHANNEL_TWO_BROKER_SETTINGS_PATH "/rest/ChannelTwoBrokerSettings"
#define CHANNEL_THREE_BROKER_SETTINGS_FILE "/config/C3BrokerSettings.json"
#define CHANNEL_THREE_BROKER_SETTINGS_PATH "/rest/ThreeBrokerSettings"
#define CHANNEL_FOUR_BROKER_SETTINGS_FILE "/config/C4BrokerSettings.json"
#define CHANNEL_FOUR_BROKER_SETTINGS_PATH "/rest/ChannelFourBrokerSettings"

class ChannelMqttSettings {
 public:
  String mqttPath;
  String name;
  String uniqueId;
  uint8_t channelControlPin;
  String channelName;
  String homeAssistantEntity;
  uint8_t homeAssistantTopicType;
  String homeAssistantIcon;

  static void read(ChannelMqttSettings& settings, JsonObject& root) {
    root["mqtt_path"] = settings.mqttPath;
    root["name"] = settings.name;
    root["unique_id"] = settings.uniqueId;
    root["homeAssistantTopicType"] = settings.homeAssistantTopicType;
    root["homeAssistantIcon"] = settings.homeAssistantIcon;
  }

  static StateUpdateResult update(JsonObject& root, ChannelMqttSettings& settings) {

    #ifdef MQTT_FRIENDLY_NAME
        settings.name = root["name"] | settings.channelName;
    #else
        settings.name = root["name"] | SettingValue::format(settings.channelName + " : #{unique_id}");
    #endif

    bool mqttPath = false;
    settings.mqttPath = root["mqtt_path"] | utils.getMqttUniqueIdOrPath(settings.channelControlPin, settings.homeAssistantTopicType, mqttPath, settings.homeAssistantEntity); 
    
    bool uniqueId = true;
    settings.uniqueId = root["unique_id"] | utils.getMqttUniqueIdOrPath(settings.channelControlPin, settings.homeAssistantTopicType, uniqueId);
    
    settings.homeAssistantTopicType = root["homeAssistantTopicType"] | settings.homeAssistantTopicType;
    settings.homeAssistantIcon = root["homeAssistantIcon"] | settings.homeAssistantIcon;

    return StateUpdateResult::CHANGED;
  }
};

class ChannelMqttSettingsService : public StatefulService<ChannelMqttSettings> {
 public:
  ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
  char* brokerJsonConfigPath, String restBrokerEndPoint, uint8_t channelControlPin, String  channelName,
  String homeAssistantEntity, uint8_t homeAssistantTopicType, String homeAssistantIcon);
  
  void begin();

 private:
  HttpEndpoint<ChannelMqttSettings> _httpEndpoint;
  FSPersistence<ChannelMqttSettings> _fsPersistence;
  uint8_t _channelControlPin;
  String _channelName;
  String _homeAssistantEntity;
  uint8_t _homeAssistantTopicType;
  String _homeAssistantIcon;
};

#endif  // end ChannelMqttSettingsService_h
