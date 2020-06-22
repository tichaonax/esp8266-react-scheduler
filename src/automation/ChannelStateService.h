#ifndef ChannelStateService_h
#define ChannelStateService_h

#include "ChannelState.h"
#include "ChannelMqttSettingsService.h"
#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <FSPersistence.h>

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
                    time_t  runEvery,         // run every 30 mins
                    time_t  offAfter,         // stop after 5 mins
                    time_t  startTimeHour,    // 8
                    time_t  startTimeMinute,  // 30
                    time_t  endTimeHour,      // 16
                    time_t  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService);

  void begin();
  Channel getChannel();

 private:
  HttpEndpoint<ChannelState> _httpEndpoint;
  MqttPubSub<ChannelState> _mqttPubSub;
  WebSocketTxRx<ChannelState> _webSocket;
  AsyncMqttClient* _mqttClient;
  FSPersistence<ChannelState> _fsPersistence;
  ChannelMqttSettingsService* _channelMqttSettingsService;
  int _channelControlPin;
  String _defaultChannelName;
  String _restChannelEndPoint;
  String _webSocketChannelEndPoint;

    time_t  _runEvery;         // run every 30 mins
    time_t  _offAfter;         // stop after 5 mins
    time_t  _startTimeHour;    // 8
    time_t  _startTimeMinute;  // 30
    time_t  _endTimeHour;      // 16
    time_t  _endTimeMinute;    // 30
    bool    _enabled;
    String  _channelName;
    bool  _enableTimeSpan;

  void registerConfig();
  void onChannelStateUpdated();
};
#endif