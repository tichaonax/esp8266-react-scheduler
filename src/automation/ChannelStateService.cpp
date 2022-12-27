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
                                      String homeAssistantIcon,
                                      bool enableRemoteConfiguration,
                                      String masterIPAddress,
                                      String restChannelRestartEndPoint,
                                      bool enableDateRange,
                                      bool activeOutsideDateRange,
                                      String  activeStartDateRange,
                                      String  activeEndDateRange,
                                      String buildVersion,
                                      String weekDays) :
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
  _enableRemoteConfiguration = enableRemoteConfiguration;
  _masterIPAddress = masterIPAddress;
  _restChannelEndPoint = restChannelEndPoint;
  _restChannelRestartEndPoint = restChannelRestartEndPoint;
  _enableDateRange = enableDateRange;
  _activeOutsideDateRange = activeOutsideDateRange;
  _activeStartDateRange = activeStartDateRange;
  _activeEndDateRange = activeEndDateRange;
  _buildVersion = buildVersion;
  _weekDays = weekDays;

  // configure controls to be output
  pinMode(_channelControlPin, OUTPUT);

  // configure MQTT callback
  _mqttClient->onConnect(std::bind(&ChannelStateService::registerConfig, this));

  // configure update handler for when the control settings change
  _channelMqttSettingsService->addUpdateHandler([&](const String& originId) {
      registerPinConfig(_state.channel.controlPin, _state.channel.homeAssistantTopicType);
    }, false);

  // configure settings service update handler to update CONTROL state
  addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);

  #ifdef ESP32
  WiFi.onEvent(
      std::bind(&ChannelStateService::onStationModeDisconnected, this, std::placeholders::_1, std::placeholders::_2),
      WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.onEvent(std::bind(&ChannelStateService::onStationModeGotIP, this, std::placeholders::_1, std::placeholders::_2),
               WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
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
  digitalWrite(_state.channel.controlPin, _state.channel.controlOn ? CONTROL_ON : CONTROL_OFF);
}

void ChannelStateService::registerPinConfig(uint8_t controlPin, uint8_t homeAssistantTopicType) {
  if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;
  String subTopic;
  String pubTopic;

  DynamicJsonDocument doc(DEFAULT_JSON_DOCUMENT_SIZE);
  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    String mqttPath = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, false, settings.homeAssistantEntity);

    String uniqueId = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, true);

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
        doc["payload_on"] = utils.makeConfigPayload(true, _state.channel, controlPin);
        doc["payload_off"] = utils.makeConfigPayload(false, _state.channel, controlPin);
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

void ChannelStateService::registerConfig() {
  registerPinConfig(_state.channel.controlPin, _state.channel.homeAssistantTopicType);
}

void ChannelStateService::mqttUnregisterConfig(uint8_t controlPin, uint8_t homeAssistantTopicType) {
   if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;

  _channelMqttSettingsService->read([&](ChannelMqttSettings& settings) {
    String mqttPath = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, false, settings.homeAssistantEntity);

    String uniqueId = utils.getMqttUniqueIdOrPath(controlPin, homeAssistantTopicType, true);

    configTopic = mqttPath + "/config";
  });

  String payload;

  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());
}

void updateStateTimeTicker(ChannelStateService* channelStateService){
  channelStateService->updateStateTime();
}

void mqttRepublishTicker(ChannelStateService* channelStateService){
  channelStateService->mqttRepublishReattach();
  //channelStateService->mqttRepublish();
}

void ChannelStateService::mqttRepublishReattach(){
  _deviceTime.detach();
  _mqttRepublish.detach();
  
  _deviceTime.attach(10, updateStateTimeTicker, this);
  _mqttRepublish.attach(1800, mqttRepublishTicker, this);
}

void ChannelStateService::begin() {
    _state.channel.controlPin = _channelControlPin;
    _state.channel.name = _channelName;
    _state.channel.homeAssistantIcon = _homeAssistantIcon;
    _state.channel.homeAssistantTopicType = _homeAssistantTopicType;
    _state.channel.enabled = _enabled;
    _state.channel.enableTimeSpan = _enableTimeSpan;
    _state.channel.randomize = _randomize;
    _state.channel.isHotScheduleActive = _isHotScheduleActive;
    _state.channel.offHotHourDateTime = _offHotHourDateTime;
    _state.channel.controlOffDateTime = _controlOffDateTime;
    _state.channel.enableMinimumRunTime = _enableMinimumRunTime;
    _state.channel.enableRemoteConfiguration = _enableRemoteConfiguration;
    _state.channel.masterIPAddress = _masterIPAddress;
    _state.channel.restChannelEndPoint = _restChannelEndPoint;
    _state.channel.restChannelRestartEndPoint = _restChannelRestartEndPoint;
    _state.channel.enableDateRange = _enableDateRange;
    _state.channel.activeOutsideDateRange = _activeOutsideDateRange;
    _state.channel.activeStartDateRange = _activeStartDateRange;
    _state.channel.activeEndDateRange = _activeEndDateRange;

    _state.channel.schedule.runEvery =  _runEvery;
    _state.channel.schedule.offAfter =  _offAfter;
    _state.channel.schedule.startTimeHour = _startTimeHour;
    _state.channel.schedule.startTimeMinute = _startTimeMinute;
    _state.channel.schedule.endTimeHour = _endTimeHour;
    _state.channel.schedule.endTimeMinute = _endTimeMinute;
    _state.channel.schedule.hotTimeHour = _hotTimeHour;
    _state.channel.schedule.overrideTime = _overrideTime;
    _state.channel.schedule.isOverrideActive = _isOverrideActive;
    _state.channel.buildVersion = _buildVersion;

    for (int i = 0; i< 7; i++){
      _state.channel.schedule.weekDays[i] = -1;
    }

    while (_weekDays.length() > 0)
    {
      int index = _weekDays.indexOf(',');
      if (index == -1)
      {
          int day = _weekDays.toInt();
          _state.channel.schedule.weekDays[day] = day;
          break;
      }
      else
      {
          int day =  _weekDays.substring(0, index).toInt();
          _weekDays = _weekDays.substring(index+1);
          _state.channel.schedule.weekDays[day] = day;
      }
    }

    _fsPersistence.readFromFS();
    _state.channel.controlOn = DEFAULT_CONTROL_STATE; // must be off on start up
    onConfigUpdated();
    _channelMqttSettingsService->begin();
    _deviceTime.attach(10, updateStateTimeTicker, this);
    _mqttRepublish.attach(1800, mqttRepublishTicker, this);
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

void ChannelStateService::mqttRepublish(uint8_t controlPin, uint8_t homeAssistantTopicType){
  registerPinConfig(controlPin, homeAssistantTopicType);
}
