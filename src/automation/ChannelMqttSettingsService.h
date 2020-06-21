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

  static void read(ChannelMqttSettings& settings, JsonObject& root) {
    root["mqtt_path"] = settings.mqttPath;
    root["name"] = settings.name;
    root["unique_id"] = settings.uniqueId;
  }

  static StateUpdateResult update(JsonObject& root, ChannelMqttSettings& settings) {
    settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue("homeassistant/light/");
    settings.name = root["name"] | ESPUtils::defaultDeviceValue("light-");
    settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue("light-");
    return StateUpdateResult::CHANGED;
  }
};

class ChannelMqttSettingsService : public StatefulService<ChannelMqttSettings> {
 public:
  ChannelMqttSettingsService(AsyncWebServer* server, FS* fs, SecurityManager* securityManager,
  char* brokerJsonConfigPath, String restBrokerEndPoint);
  void begin();

 private:
  HttpEndpoint<ChannelMqttSettings> _httpEndpoint;
  FSPersistence<ChannelMqttSettings> _fsPersistence;
};

#endif  // end ChannelMqttSettingsService_h
