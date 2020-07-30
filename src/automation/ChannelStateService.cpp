#include "channels.h"
#include "ChannelStateService.h"

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0

ChannelStateService::ChannelStateService(AsyncWebServer* server,
                                      SecurityManager* securityManager,
                                      AsyncMqttClient* mqttClient,
                                      FS* fs,
                                      int channelControlPin,
                                      char* channelJsonConfigPath,
                                      String restChannelEndPoint,
                                      char* webSocketChannelEndPoint,
                                      time_t  runEvery,
                                      time_t  offAfter,
                                      time_t  startTimeHour,
                                      time_t  startTimeMinute,
                                      time_t  endTimeHour,
                                      time_t  endTimeMinute,
                                      bool    enabled,
                                      String  channelName,
                                      bool enableTimeSpan,
                                      ChannelMqttSettingsService* channelMqttSettingsService,
                                      bool randomize) :
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
    _channelMqttSettingsService(channelMqttSettingsService),
    _fsPersistence(ChannelState::read,
                ChannelState::update,
                this, fs,
                channelJsonConfigPath,
                DEFAULT_JSON_DOCUMENT_SIZE)
                {

  _channelControlPin = channelControlPin;
  _restChannelEndPoint = restChannelEndPoint;
  _webSocketChannelEndPoint = webSocketChannelEndPoint;

  _runEvery = runEvery;
  _offAfter = offAfter;
  _startTimeHour  = startTimeHour;
  _startTimeMinute  =startTimeMinute;
  _endTimeHour  = endTimeHour;
  _endTimeMinute  = endTimeMinute;
  _enabled  = enabled;
  _channelName = channelName;
  _enableTimeSpan = enableTimeSpan;
  _randomize = randomize;

  // configure controls to be output
  pinMode(_channelControlPin, OUTPUT);

  // configure MQTT callback
  _mqttClient->onConnect(std::bind(&ChannelStateService::registerConfig, this));

  // configure update handler for when the control settings change
  _channelMqttSettingsService->addUpdateHandler([&](const String& originId) { registerConfig(); }, false);

  // configure settings service update handler to update CONTROL state
  addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);

  #ifdef ESP32
  WiFi.onEvent(
      std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
      WiFiEvent_t::SYSTEM_EVENT_STA_DISCONNECTED);
  WiFi.onEvent(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::SYSTEM_EVENT_STA_GOT_IP);
#elif defined(ESP8266)
  _onStationModeDisconnectedHandler = WiFi.onStationModeDisconnected(
      std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1));
  _onStationModeGotIPHandler =
      WiFi.onStationModeGotIP(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1));
#endif
}

#ifdef ESP32
void ChannelStateService::onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info) {
  updateStateIP(WiFi.localIP().toString());
}

void ChannelStateService::onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  updateStateIP("");
}
#elif defined(ESP8266)
void ChannelStateService::onStationModeGotIP(const WiFiEventStationModeGotIP& event) {
  updateStateIP(WiFi.localIP().toString());
}

void ChannelStateService::onStationModeDisconnected(const WiFiEventStationModeDisconnected& event) {
  updateStateIP("");
}

#endif
void ChannelStateService::onConfigUpdated() {
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
  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    configTopic = settings.mqttPath + "/config";
    subTopic = settings.mqttPath + "/set";
    pubTopic = settings.mqttPath + "/state";
    doc["~"] = settings.mqttPath;
    doc["name"] = settings.name;
    doc["unique_id"] = settings.uniqueId;
    doc["cmd_t"] = "~/set";
    doc["stat_t"] = "~/state";
    
    switch (settings.channelControlPin)
    {
      case CHANNEL_ONE_CONTROL_PIN :
          doc["icon"] = "mdi:water-pump";
          doc["payload_on"] =  "{\"state\":\"ON\"}";
          doc["payload_off"] = "{\"state\":\"OFF\"}";
        break;
      case CHANNEL_TWO_CONTROL_PIN:
          doc["icon"] = "mdi:fridge";
          doc["payload_on"] =  "{\"state\":\"ON\"}";
          doc["payload_off"] = "{\"state\":\"OFF\"}";
        break;
      case CHANNEL_THREE_CONTROL_PIN:
          doc["schema"] = "json";
        break;
      default:
          doc["schema"] = "json";
        break;
    }
  });

  String payload;
  serializeJson(doc, payload);
  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

  _mqttPubSub.configureTopics(pubTopic, subTopic);
}

void ChannelStateService::begin() {
    _state.channel.controlPin = _channelControlPin;
    _state.channel.name = _channelName;
    _state.channel.channelEndPoint = _restChannelEndPoint;
    _state.channel.enabled = _enabled;
    _state.channel.enableTimeSpan = _enableTimeSpan;
    _state.channel.randomize = _randomize;

    _state.channel.schedule.runEvery =  _runEvery;
    _state.channel.schedule.offAfter =  _offAfter;
    _state.channel.schedule.startTimeHour = _startTimeHour;
    _state.channel.schedule.startTimeMinute = _startTimeMinute;
    _state.channel.schedule.endTimeHour = _endTimeHour;
    _state.channel.schedule.endTimeMinute = _endTimeMinute;
    
    _fsPersistence.readFromFS();

    _state.channel.controlOn = DEFAULT_CONTROL_STATE; // must be off on start up
    onConfigUpdated();
    _deviceTime.attach(10, std::bind(&ChannelStateService::updateStateTime, this));
    _mqttRepublish.attach(60, std::bind(&ChannelStateService::mqttRepublish, this));
    _channelMqttSettingsService->begin();
}

Channel ChannelStateService::getChannel(){
  return _state.channel;
}

void ChannelStateService::updateStateTime(){
  update([&](ChannelState& channelState) {  
    return StateUpdateResult::CHANGED;
  }, _state.channel.name);
}

void ChannelStateService::updateStateIP(String IPAddress){
  update([&](ChannelState& channelState) {  
    channelState.channel.IP = IPAddress;
    return StateUpdateResult::CHANGED;
  }, _state.channel.name);
}

void ChannelStateService::mqttRepublish(){
  registerConfig();
}