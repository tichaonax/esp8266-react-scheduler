#include "ChannelStateService.h"

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0

ChannelStateService::ChannelStateService(AsyncWebServer* server,
                                      SecurityManager* securityManager,
                                      AsyncMqttClient* mqttClient,
                                      FS* fs,
                                      int channelControlPin,
                                      char* channelJsonConfigPath,  
                                      String defaultChannelName,
                                      String restChannelEndPoint,
                                      char* webSocketChannelEndPoint) :
    _httpEndpoint(ChannelState::read,
                  ChannelState::update,
                  this,
                  server,
                  restChannelEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(ChannelState::haRead, ChannelState::haUpdate, this, mqttClient),
    _webSocket(ChannelState::read,
               ChannelState::update,
               this,
               server,
               webSocketChannelEndPoint,
               securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttClient(mqttClient),
   // _lightMqttSettingsService(lightMqttSettingsService),
    _fsPersistence(ChannelState::read,
                ChannelState::update,
                this, fs,
                channelJsonConfigPath,
                DEFAULT_JSON_DOCUMENT_SIZE)
                {

  _channelControlPin = channelControlPin;
  _defaultChannelName = defaultChannelName;
  _restChannelEndPoint = restChannelEndPoint;
  _webSocketChannelEndPoint = webSocketChannelEndPoint;

  // configure controls to be output
  pinMode(_channelControlPin, OUTPUT);

  // configure MQTT callback
  _mqttClient->onConnect(std::bind(&ChannelStateService::registerConfig, this));

  // configure update handler for when the control settings change
  //_lightMqttSettingsService->addUpdateHandler([&](const String& originId) { registerConfig(); }, false);

  // configure settings service update handler to update CONTROL state
  addUpdateHandler([&](const String& originId) { onChannelStateUpdated(); }, false);
}

void ChannelStateService::onChannelStateUpdated() {
  Serial.print("onChannelStateUpdated channel: ");
  Serial.println(_state.channel.name);
  _state.channel.controlPin = _channelControlPin;
  digitalWrite(_state.channel.controlPin, _state.channel.controlOn ? CONTROL_ON : CONTROL_OFF);
}

void ChannelStateService::registerConfig() {
  if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;
  String subTopic;
  String pubTopic;

  DynamicJsonDocument doc(256);
 /*  _lightMqttSettingsService->read([&](LightMqttSettings& settings) {
    configTopic = settings.mqttPath + "/config";
    subTopic = settings.mqttPath + "/set";
    pubTopic = settings.mqttPath + "/state";
    doc["~"] = settings.mqttPath;
    doc["name"] = settings.name;
    doc["unique_id"] = settings.uniqueId;
  });
  doc["cmd_t"] = "~/set";
  doc["stat_t"] = "~/state";
  doc["schema"] = "json";
  doc["brightness"] = false; */

  String payload;
  serializeJson(doc, payload);
  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

  _mqttPubSub.configureTopics(pubTopic, subTopic);
}

void ChannelStateService::begin() {
    _state.channel.controlPin = _channelControlPin;
    _state.channel.name = _defaultChannelName;
    _state.channel.channelEndPoint = _restChannelEndPoint;
    
    _fsPersistence.readFromFS();

    _state.channel.controlOn = DEFAULT_CONTROL_STATE; // must be off on start up
    _state.channel.lastStartedChangeTime =  Utils.getLocalTime();
    
    onChannelStateUpdated();
}

Channel ChannelStateService::getChannel(){
  return _state.channel;
}