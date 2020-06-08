#ifndef ChannelStateService_h
#define ChannelStateService_h

#include "ChannelState.h"
#include "ESP8266TimeAlarms.h"
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
                    String defaultChannelName,  //  Channel One Control
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint //  "/ws/channelOneState"
                    );

  void begin();
  Channel getChannel();

 private:
  HttpEndpoint<ChannelState> _httpEndpoint;
  MqttPubSub<ChannelState> _mqttPubSub;
  WebSocketTxRx<ChannelState> _webSocket;
  AsyncMqttClient* _mqttClient;
  FSPersistence<ChannelState> _fsPersistence;
  int _channelControlPin;
  String _defaultChannelName;
  String _restChannelEndPoint;
  String _webSocketChannelEndPoint;

  void registerConfig();
  void onChannelStateUpdated();
};
#endif