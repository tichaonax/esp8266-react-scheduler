#ifndef ChannelStateService_h
#define ChannelStateService_h

#include "ChannelState.h"
#include "ESP8266TimeAlarms.h"
#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <FSPersistence.h>

#define CHANNEL_ONE_CONTROL_PIN 5
#define CHANNEL_ONE_REST_ENDPOINT_PATH "/rest/channelOneState"  //restChannelEndPoint
#define CHANNEL_ONE_SOCKET_PATH "/ws/channelOneState"  // webSocketChannelEndPoint
#define CHANNEL_ONE_DEFAULT_NAME "Channel One Control" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath

#define CHANNEL_TWO_CONTROL_PIN 12
#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Channel Two Control" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath

#define CHANNEL_THREE_CONTROL_PIN 13
#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Channel Three Control" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath

#define CHANNEL_FOUR_CONTROL_PIN 14
#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Channel Four Control" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath

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
  void loop();
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