#ifndef ChannelScheduleRestartService_h
#define ChannelScheduleRestartService_h

#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif

#include <ESPAsyncWebServer.h>
#include <SecurityManager.h>
#include "TaskScheduler.h"

#define CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH "/rest/channelOneScheduleRestart"
#define CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH "/rest/channelTwoScheduleRestart"
#define CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH "/rest/channelThreeScheduleRestart"
#define CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH "/rest/channelFourScheduleRestart"

class ChannelScheduleRestartService {
 public:
  ChannelScheduleRestartService(
    AsyncWebServer* server,
    SecurityManager* securityManager,
    TaskScheduler* channel,
    char* restChannelEndPoint
    );

 private:
  TaskScheduler* _channel;
  void scheduleRestart(AsyncWebServerRequest* request);
};

#endif  // end ChannelScheduleRestartService_h
