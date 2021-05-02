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
                    int channelControlPin,  // 5
                    char* channelJsonConfigPath,  //  "/config/channelOneState.json"
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint, //  "/ws/channelOneState"
                    float  runEvery,         // run every 30 mins
                    float  offAfter,         // stop after 5 mins
                    time_t  startTimeHour,    // 8
                    time_t  startTimeMinute,  // 30
                    time_t  endTimeHour,      // 16
                    time_t  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService,
                    bool randomize,
                    float hotTimeHour,
                    float overrideTime,
                    bool enableMinimumRunTime);

  void begin();
  Channel getChannel();
  void updateStateTime();
  void mqttRepublish();

 private:
  HttpEndpoint<ChannelState> _httpEndpoint;
  MqttPubSub<ChannelState> _mqttPubSub;
  WebSocketTxRx<ChannelState> _webSocket;
  AsyncMqttClient* _mqttClient;
  ChannelMqttSettingsService* _channelMqttSettingsService;
  FSPersistence<ChannelState> _fsPersistence;
  int _channelControlPin;
  String _defaultChannelName;
  String _restChannelEndPoint;
  String _webSocketChannelEndPoint;
  Ticker _deviceTime;
  Ticker _mqttRepublish;

    time_t  _runEvery;         // run every 30 mins
    time_t  _offAfter;         // stop after 5 mins
    time_t  _startTimeHour;    // 8
    time_t  _startTimeMinute;  // 30
    time_t  _endTimeHour;      // 16
    time_t  _endTimeMinute;    // 30
    time_t  _hotTimeHour;      // 0 to 16hr
    time_t  _overrideTime;     //
    bool    _enabled;
    String  _channelName;
    bool  _enableTimeSpan;
    bool  _randomize;
    bool  _isHotScheduleActive;
    String _offHotHourDateTime;
    String _controlOffDateTime;
    bool  _isOverrideActive;
    bool _enableMinimumRunTime;


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
  void onConfigUpdated();
  void updateStateIP(String IPAddress);
};
#endif