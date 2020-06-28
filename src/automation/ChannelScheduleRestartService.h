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

#define CHANNEL_SCHEDULE_RESTART_SERVICE_PATH "/rest/channelScheduleRestart"

class ChannelScheduleRestartService {
 public:
  ChannelScheduleRestartService(
    AsyncWebServer* server,
    SecurityManager* securityManager,
    TaskScheduler* channelOne
    //TaskScheduler* channelTwo,
    //TaskScheduler* channelThree,
    //TaskScheduler* channelFour
    );

 private:
  TaskScheduler* _channelOne;
  //TaskScheduler* _channelTwo;
  //TaskScheduler* _channelThree;
  //TaskScheduler* _channelFour;
  void scheduleRestart(AsyncWebServerRequest* request);
};

#endif  // end ChannelScheduleRestartService_h
