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
  _channel->scheduleRestart();
  request->send(200);
}