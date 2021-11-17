#include "channels.h"
#include "ChannelStateService.h"

ChannelStateService::ChannelStateService(AsyncWebServer* server,
                                      SecurityManager* securityManager,
                                      AsyncMqttClient* mqttClient,
                                      FS* fs,
                                      uint8_t channelControlPin,
                                      char* channelJsonConfigPath,
                                      String restChannelEndPoint,
                                      char* webSocketChannelEndPoint,
                                      float  runEvery,
                                      float  offAfter,
                                      int  startTimeHour,
                                      int  startTimeMinute,
                                      int  endTimeHour,
                                      int  endTimeMinute,
                                      bool    enabled,
                                      String  channelName,
                                      bool enableTimeSpan,
                                      ChannelMqttSettingsService* channelMqttSettingsService,
                                      bool randomize,
                                      float hotTimeHour,
                                      float overrideTime,
                                      bool enableMinimumRunTime,
                                      uint8_t homeAssistantTopicType,
                                      String homeAssistantIcon) :
    _httpEndpoint(ChannelState::read,
                  ChannelState::update,
                  this,
                  server,
                  restChannelEndPoint,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(ChannelState::haRead, ChannelState::haUpdate, this, mqttClient),
    _webSocket(ChannelState::read,
               ChannelState::wsUpdate,
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
  _homeAssistantIcon = homeAssistantIcon;
  _homeAssistantTopicType = homeAssistantTopicType;
  _restChannelEndPoint = restChannelEndPoint;
  _webSocketChannelEndPoint = webSocketChannelEndPoint;

  _runEvery = (int)(round(60 * float(runEvery)));
  _offAfter = (int)(round(60 * float(offAfter)));
  _startTimeHour  = (int)(round(3600 * float(startTimeHour)));
  _startTimeMinute  = (int)(round(60 * float(startTimeMinute)));
  _endTimeHour  = (int)(round(3600 * float(endTimeHour)));
  _endTimeMinute  = (int)(round(60 * float(endTimeMinute)));
  _enabled  = enabled;
  _channelName = channelName;
  _enableTimeSpan = enableTimeSpan;
  _randomize = randomize;
  _hotTimeHour = (int)(round(3600 * float(hotTimeHour)));
  _overrideTime = (int)(round(60 * float(overrideTime)));
  _isHotScheduleActive = false;
  _offHotHourDateTime = "";
  _controlOffDateTime = "";
  _isOverrideActive = false;
  _enableMinimumRunTime = enableMinimumRunTime;

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

  DynamicJsonDocument doc(DEFAULT_BUFFER_SIZE);
  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    String mqttPath = utils.getMqttUniqueIdOrPath(_state.channel.controlPin,
    _state.channel.homeAssistantTopicType,
    false,
    settings.homeAssistantEntity);

    String uniqueId = utils.getMqttUniqueIdOrPath(_state.channel.controlPin,
    _state.channel.homeAssistantTopicType,
    true);

    String name;
    #ifdef MQTT_FRIENDLY_NAME
        name = _state.channel.name;
    #else
        name = SettingValue::format(_state.channel.name + " : #{unique_id}");
    #endif

    configTopic = mqttPath + "/config";
    subTopic = mqttPath + "/set";
    pubTopic = mqttPath + "/state";
    doc["~"] = mqttPath;
    doc["name"] = name;
    doc["unique_id"] = uniqueId;
    doc["json_attributes_topic"] = "~/state";
    doc["cmd_t"] = "~/set";
    doc["stat_t"] = "~/state";

    switch (_state.channel.homeAssistantTopicType)
    {
      case HOMEASSISTANT_TOPIC_TYPE_SWITCH:
        doc["icon"] = _state.channel.homeAssistantIcon; //"mdi:water-pump";
        doc["payload_on"] = utils.makeConfigPayload(true, _state.channel);
        doc["payload_off"] = utils.makeConfigPayload(false, _state.channel);
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

void updateStateTimeTicker(ChannelStateService* channelStateService){
  channelStateService->updateStateTime();
}

void mqttRepublishTicker(ChannelStateService* channelStateService){
  channelStateService->mqttRepublish();
}

void ChannelStateService::begin() {
    _state.channel.controlPin = _channelControlPin;
    _state.channel.name = _channelName;
    _state.channel.homeAssistantIcon = _homeAssistantIcon;
    _state.channel.homeAssistantTopicType = _homeAssistantTopicType;
    _state.channel.channelEndPoint = _restChannelEndPoint;
    _state.channel.enabled = _enabled;
    _state.channel.enableTimeSpan = _enableTimeSpan;
    _state.channel.randomize = _randomize;
    _state.channel.isHotScheduleActive = _isHotScheduleActive;
    _state.channel.offHotHourDateTime = _offHotHourDateTime;
    _state.channel.controlOffDateTime = _controlOffDateTime;
    _state.channel.enableMinimumRunTime = _enableMinimumRunTime;

    _state.channel.schedule.runEvery =  _runEvery;
    _state.channel.schedule.offAfter =  _offAfter;
    _state.channel.schedule.startTimeHour = _startTimeHour;
    _state.channel.schedule.startTimeMinute = _startTimeMinute;
    _state.channel.schedule.endTimeHour = _endTimeHour;
    _state.channel.schedule.endTimeMinute = _endTimeMinute;
    _state.channel.schedule.hotTimeHour = _hotTimeHour;
    _state.channel.schedule.overrideTime = _overrideTime;
    _state.channel.schedule.isOverrideActive = _isOverrideActive;
    _fsPersistence.readFromFS();

    _state.channel.controlOn = DEFAULT_CONTROL_STATE; // must be off on start up
    onConfigUpdated();
    _deviceTime.attach(10, updateStateTimeTicker, this);
    _mqttRepublish.attach(30, mqttRepublishTicker, this);
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
