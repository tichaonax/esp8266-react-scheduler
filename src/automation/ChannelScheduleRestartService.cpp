#include "ChannelScheduleRestartService.h"

ChannelScheduleRestartService::ChannelScheduleRestartService(
  AsyncWebServer* server,
  SecurityManager* securityManager,
  TaskScheduler* channel,
  char* restChannelEndPoint
    ) {
  server->on(restChannelEndPoint,
             HTTP_POST,
             securityManager->wrapRequest(std::bind(&ChannelScheduleRestartService::scheduleRestart, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_ADMIN));
    _channel = channel;
}

void ChannelScheduleRestartService::scheduleRestart(AsyncWebServerRequest* request) {
  _channel->resetSchedule();
  request->send(200);
  /* int paramsNr = request->params();
  if(paramsNr > 0){
     AsyncWebParameter* p = request->getParam(0);
     if (p->name() == "channel") {
      switch (p->value().toInt())
      {
      case 1:
        Serial.println("Channel 1");
        _channel->resetSchedule();
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
  } */
}