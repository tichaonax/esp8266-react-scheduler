#ifndef ChannelMqttSettingsService_h
#define ChannelMqttSettingsService_h

#include <HttpEndpoint.h>
#include <FSPersistence.h>
#include <ESPUtils.h>

#define CHANNEL_ONE_BROKER_CONFIG_JSON_PATH "/config/channelOneBrokerSettings.json"
#define CHANNEL_ONE_BROKER_END_POINT "/rest/channelOneBrokerSettings"
#define CHANNEL_ONE_DEFAULT_MQTT_PATH_NAME "homeassistant/channelOne"

#define CHANNEL_TWO_BROKER_CONFIG_JSON_PATH "/config/channelTwoBrokerSettings.json"
#define CHANNEL_TWO_BROKER_END_POINT "/rest/channelTwoBrokerSettings"
#define CHANNEL_TWO_DEFAULT_MQTT_PATH_NAME "homeassistant/channelTwo/"

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
    settings.mqttPath = root["mqtt_path"] | ESPUtils::defaultDeviceValue(settings.mqttPath);
    settings.name = root["name"] | ESPUtils::defaultDeviceValue("channel-");
    settings.uniqueId = root["unique_id"] | ESPUtils::defaultDeviceValue("channel-");
    return StateUpdateResult::CHANGED;
  }
};

class ChannelMqttSettingsService : public StatefulService<ChannelMqttSettings> {
 public:
  ChannelMqttSettingsService(AsyncWebServer* server,
    FS* fs, SecurityManager* securityManager,
    char* channelBrokerJsonConfigPath,  //  "config/channelOneBrokerSettings.json"   
    String defaultQqttPathlName,
    String restChannelBrokerEndPoint //  "/rest/channelOneBrokerSettings");
  );
  void begin();

 private:
  HttpEndpoint<ChannelMqttSettings> _httpEndpoint;
  FSPersistence<ChannelMqttSettings> _fsPersistence;
  String _defaultMqttPathlName;
};

#endif  // end ChannelMqttSettingsService_h
