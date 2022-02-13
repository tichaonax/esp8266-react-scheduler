#ifndef ChannelStateService_h
#define ChannelStateService_h

#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <FSPersistence.h>
#include <Ticker.h>
#include "ChannelState.h"
#include "ChannelMqttSettingsService.h"

class ChannelStateService : public StatefulService<ChannelState> {
 public:
  ChannelStateService(AsyncWebServer* server,
                    SecurityManager* securityManager,
                    AsyncMqttClient* mqttClient,
                    FS* fs,
                    uint8_t channelControlPin,  // 5
                    char* channelJsonConfigPath,  //  "/config/channelOneState.json"
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint, //  "/ws/channelOneState"
                    float  runEvery,         // run every 30 mins
                    float  offAfter,         // stop after 5 mins
                    int  startTimeHour,    // 8
                    int  startTimeMinute,  // 30
                    int  endTimeHour,      // 16
                    int  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService,
                    bool randomize,
                    float hotTimeHour,
                    float overrideTime,
                    bool enableMinimumRunTime,
                    uint8_t homeAssistantTopicType,
                    String homeAssistantIcon,
                    bool enableRemoteConfiguration,
                    String masterIPAddress,
                    String restChannelRestartEndPoint);

  void begin();
  Channel getChannel();
  void updateStateTime();
  void mqttRepublish();
  void mqttRepublish(uint8_t controlPin, uint8_t homeAssistantTopicType);
  void mqttUnregisterConfig(uint8_t controlPin, uint8_t homeAssistantTopicType);
  void mqttRepublishReattach();

 private:
  HttpEndpoint<ChannelState> _httpEndpoint;
  MqttPubSub<ChannelState> _mqttPubSub;
  WebSocketTxRx<ChannelState> _webSocket;
  AsyncMqttClient* _mqttClient;
  ChannelMqttSettingsService* _channelMqttSettingsService;
  FSPersistence<ChannelState> _fsPersistence;
  uint8_t _channelControlPin;
  String _defaultChannelName;
  Ticker _deviceTime;
  Ticker _mqttRepublish;

  int  _runEvery;         // run every 30 mins
  int  _offAfter;         // stop after 5 mins
  int  _startTimeHour;    // 8
  int  _startTimeMinute;  // 30
  int  _endTimeHour;      // 16
  int  _endTimeMinute;    // 30
  int  _hotTimeHour;      // 0 to 16hr
  int  _overrideTime;     //
  bool    _enabled;
  String  _channelName;
  bool  _enableTimeSpan;
  bool  _randomize;
  bool  _isHotScheduleActive;
  String _offHotHourDateTime;
  String _controlOffDateTime;
  bool  _isOverrideActive;
  bool _enableMinimumRunTime;
  uint8_t _homeAssistantTopicType;
  String _homeAssistantIcon;
  bool _enableRemoteConfiguration;
  String _masterIPAddress;
  String _restChannelEndPoint;
  String _restChannelRestartEndPoint;

#ifdef ESP32
  void onStationModeGotIP(WiFiEvent_t event, WiFiEventInfo_t info);
  void onStationModeDisconnected(WiFiEvent_t event, WiFiEventInfo_t info);
#elif defined(ESP8266)
  WiFiEventHandler _onStationModeDisconnectedHandler;
  WiFiEventHandler _onStationModeGotIPHandler;

  void onStationModeGotIP(const WiFiEventStationModeGotIP& event);
  void onStationModeDisconnected(const WiFiEventStationModeDisconnected& event);
#endif

  void registerConfig();
  void registerPinConfig(uint8_t controlPin, uint8_t homeAssistantTopicType);
  void onConfigUpdated();
  void updateStateIP(String IPAddress);
};
#endif