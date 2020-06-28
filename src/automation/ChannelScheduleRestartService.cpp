#include "ChannelScheduleRestartService.h"

ChannelScheduleRestartService::ChannelScheduleRestartService(
  AsyncWebServer* server,
  SecurityManager* securityManager,
  TaskScheduler* channelOne
    //TaskScheduler *channelTwo,
    //TaskScheduler *channelThree,
    //TaskScheduler *channelFour
    ) {
  server->on(CHANNEL_SCHEDULE_RESTART_SERVICE_PATH,
             HTTP_POST,
             securityManager->wrapRequest(std::bind(&ChannelScheduleRestartService::scheduleRestart, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_ADMIN));
    _channelOne = channelOne;
    //_channelTwo = channelTwo;
    //_channelThree = channelThree;
    //_channelFour = channelFour;
}

void ChannelScheduleRestartService::scheduleRestart(AsyncWebServerRequest* request) {
  int paramsNr = request->params();
  if(paramsNr > 0){
     AsyncWebParameter* p = request->getParam(0);
     if (p->name() == "channel") {
      switch (p->value().toInt())
      {
      case 1:
        Serial.println("Channel 1");
        _channelOne->resetSchedule();
        request->send(200);
        break;

        case 2:
        Serial.println("Channel 2");
        //_channelTwo->resetSchedule();
        request->send(200);
        break;

        case 3:
        Serial.println("Channel 3");
        //_channelThree->resetSchedule();
        request->send(200);
        break;

        case 4:
        Serial.println("Channel 4");
        //_channelFour->resetSchedule();
        request->send(200);
        break;
      
      default:
        request->send(404);
        break;
      }
    }else {
        request->send(404);
    }
  }else{
    request->send(404);
  }
}