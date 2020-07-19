#ifndef ChannelMqttSettingsService_h
#define ChannelMqttSettingsService_h

#include <HttpEndpoint.h>
#include <FSPersistence.h>
#include <ESPUtils.h>
#include "channels.h"

#define CHANNEL_ONE_BROKER_SETTINGS_FILE "/config/channelOneBrokerSettings.json"
#define CHANNEL_ONE_BROKER_SETTINGS_PATH "/rest/channelOneBrokerSettings"
#define CHANNEL_TWO_BROKER_SETTINGS_FILE "/config/channelTwoBrokerSettings.json"
#define CHANNEL_TWO_BROKER_SETTINGS_PATH "/rest/channelTwoBrokerSettings"
#define CHANNEL_THREE_BROKER_SETTINGS_FILE "/config/channelThreeBrokerSettings.json"
#define CHANNEL_THREE_BROKER_SETTINGS_PATH "/rest/channelThreeBrokerSettings"
#define CHANNEL_FOUR_BROKER_SETTINGS_FILE "/config/channelFourBrokerSettings.json"
#define CHANNEL_FOUR_BROKER_SETTINGS_PATH "/rest/channelFourBrokerSettings"

class ChannelMqttSettings {
 public:
  String mqttPath;
  String name;
  String uniqueId;
  int channelControlPin;
  String channelName;
  String homeAssistantEntity;

  static void read(ChannelMqttSettings& settings, JsonObject& root) {
    root["mqtt_path"] = settings.mqttPath;
    root["name"] = settings.name;
    root["unique_id"] = settings.uniqueId;
  }

  static StateUpdateResult update(JsonObject& root, ChannelMqttSettings& settings) {
    String topicHeader;
    String topicType;
    
    switch (settings.channelControlPin)
    {
      case CHANNEL_ONE_CONTROL_PIN :
      case CHANNEL_TWO_CONTROL_PIN:
        topicHeader = "homeassistant/switch/";
        topicType = "switch-";
      break;
      default:
        topicHeader = "homeassistant/light/";
        topicType = "light-";
      break;
    }

    settings.name = root["name"] | ESPUtils::defaultDeviceValue(settings.channelName + " : ");
    settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue(topicHeader + settings.homeAssistantEntity + "-" + String(settings.channelControlPin) + "/");
    settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue(topicType + String(settings.channelControlPin) + "-");
      
    return StateUpdateResult::CHANGED;
  }
};

class ChannelMqttSettingsService : public StatefulService<ChannelMqttSettings> {
 public:
  ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
  char* brokerJsonConfigPath, String restBrokerEndPoint, int channelControlPin, String  channelName,
  String homeAssistantEntity);
  void begin();

 private:
  HttpEndpoint<ChannelMqttSettings> _httpEndpoint;
  FSPersistence<ChannelMqttSettings> _fsPersistence;
  int _channelControlPin;
  String _channelName;
  String _homeAssistantEntity;
};

#endif  // end ChannelMqttSettingsService_h
