#ifndef ChannelMqttSettingsService_h
#define ChannelMqttSettingsService_h

#include <HttpEndpoint.h>
#include <FSPersistence.h>
#include <ESPUtils.h>

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
  String homeAssistantDomain;

  static void read(ChannelMqttSettings& settings, JsonObject& root) {
    root["mqtt_path"] = settings.mqttPath;
    root["name"] = settings.name;
    root["unique_id"] = settings.uniqueId;
  }

  static StateUpdateResult update(JsonObject& root, ChannelMqttSettings& settings) {
    //settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue("homeassistant/channel/" + String(settings.channelControlPin) + "/");;
    //settings.name = root["name"] | ESPUtils::defaultDeviceValue("channel-" + String(settings.channelControlPin) + "-");
    //settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue("channel-" + String(settings.channelControlPin) + "-");
   /*  settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue("homeassistant/light/");
    settings.name = root["name"] | ESPUtils::defaultDeviceValue("light-");
    settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue("light-"); */
    settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue("homeassistant/"+ settings.homeAssistantDomain + "/" + settings.homeAssistantEntity + "_" + String(settings.channelControlPin) + "/");
    settings.name = root["name"] | ESPUtils::defaultDeviceValue(settings.channelName + "-");
    settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue(settings.homeAssistantDomain +  "-" + String(settings.channelControlPin) + "-");
    return StateUpdateResult::CHANGED;
  }
};

class ChannelMqttSettingsService : public StatefulService<ChannelMqttSettings> {
 public:
  ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
  char* brokerJsonConfigPath, String restBrokerEndPoint, int channelControlPin, String  channelName,
  String homeAssistantEntity, String homeAssistantDomain);
  void begin();

 private:
  HttpEndpoint<ChannelMqttSettings> _httpEndpoint;
  FSPersistence<ChannelMqttSettings> _fsPersistence;
  int _channelControlPin;
  String _channelName;
  String _homeAssistantEntity;
  String _homeAssistantDomain;
};

#endif  // end ChannelMqttSettingsService_h
