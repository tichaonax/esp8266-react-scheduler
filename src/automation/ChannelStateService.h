#ifndef ChannelStateService_h
#define ChannelStateService_h

#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <FSPersistence.h>
#include <Ticker.h>
#include "ChannelState.h"
#include "ChannelMqttSettingsService.h"

// Configuration struct to replace massive parameter lists
struct ChannelStateConfig {
    AsyncWebServer* server;
    SecurityManager* securityManager;
    AsyncMqttClient* mqttClient;
    FS* fs;
    uint8_t channelControlPin;
    const char* channelJsonConfigPath;
    String restChannelEndPoint;
    const char* webSocketChannelEndPoint;
    
    // Schedule configuration group
    struct {
        float runEvery;
        float offAfter;
        int startTimeHour;
        int startTimeMinute;
        int endTimeHour;
        int endTimeMinute;
        bool enabled;
        bool enableTimeSpan;
        bool randomize;
        float hotTimeHour;
        float overrideTime;
        bool enableMinimumRunTime;
    } schedule;
    
    // Channel configuration group
    struct {
        String name;
        uint8_t homeAssistantTopicType;
        String homeAssistantIcon;
        bool enableRemoteConfiguration;
        String masterIPAddress;
        String restChannelRestartEndPoint;
    } channel;
    
    // Date range configuration group
    struct {
        bool enableDateRange;
        bool activeOutsideDateRange;
        String activeStartDateRange;
        String activeEndDateRange;
        String weekDays;
    } dateRange;
    
    // System configuration group
    struct {
        String buildVersion;
        bool autoRebootSystem;
    } system;
    
    ChannelMqttSettingsService* channelMqttSettingsService;
};

#ifdef ESP32
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif

class ChannelStateService : public StatefulService<ChannelState> {
 public:
  // New streamlined constructor using config struct
  ChannelStateService(const ChannelStateConfig& config);
  
  // Legacy constructor (to be removed)
  ChannelStateService(AsyncWebServer* server,
                    SecurityManager* securityManager,
                    AsyncMqttClient* mqttClient,
                    FS* fs,
                    uint8_t channelControlPin,  // 5
                    const char* channelJsonConfigPath,  //  "/config/channelOneState.json"
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    const char* webSocketChannelEndPoint, //  "/ws/channelOneState"
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
                    String restChannelRestartEndPoint,
                    bool enableDateRange,
                    bool activeOutsideDateRange,
                    String  activeStartDateRange,
                    String  activeEndDateRange,
                    String buildVersion,
                    String weekDays,
                    bool autoRebootSystem);

  void begin();
  Channel getChannel();
  void updateStateTime();
  void mqttRepublish();
  void mqttRepublish(uint8_t controlPin, uint8_t homeAssistantTopicType);
  void mqttUnregisterConfig(uint8_t controlPin, uint8_t homeAssistantTopicType);
  void mqttRepublishReattach();

 private:
  // Service objects
  HttpEndpoint<ChannelState> _httpEndpoint;
  MqttPubSub<ChannelState> _mqttPubSub;
  WebSocketTxRx<ChannelState> _webSocket;
  FSPersistence<ChannelState> _fsPersistence;
  
  // Essential runtime state (configuration is stored in _state.channel)
  AsyncMqttClient* _mqttClient;
  ChannelMqttSettingsService* _channelMqttSettingsService;
  uint8_t _channelControlPin;
  
  // Timers
  Ticker _deviceTime;
  Ticker _mqttRepublish;
  
  // Helper methods for configuration struct initialization
  void initializeFromConfig(const ChannelStateConfig& config);

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