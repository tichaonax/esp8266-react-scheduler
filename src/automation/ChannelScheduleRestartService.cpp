#include "ChannelScheduleRestartService.h"

ChannelScheduleRestartService::ChannelScheduleRestartService(
  AsyncWebServer* server,
  SecurityManager* securityManager,
  TaskScheduler* channel,
  char* restChannelRestartEndPoint
    ) {
  server->on(restChannelRestartEndPoint,
             HTTP_POST,
             securityManager->wrapRequest(std::bind(&ChannelScheduleRestartService::scheduleRestart, this, std::placeholders::_1),
                                          AuthenticationPredicates::IS_ADMIN));
    _channel = channel;
}

void ChannelScheduleRestartService::scheduleRestart(AsyncWebServerRequest* request) {
  if (request->hasParam(OLD_CHANNEL_CONTROL_PIN)) {
    AsyncWebParameter* oldControlPinParamater = request->getParam(OLD_CHANNEL_CONTROL_PIN);
    String oldControlPin = oldControlPinParamater->value();

    AsyncWebParameter* controlPinParamater = request->getParam(NEW_CHANNEL_CONTROL_PIN);
    String controlPin = controlPinParamater->value();

    AsyncWebParameter* oldHomeAssistantTopicTypeParamater = request->getParam(OLD_HA_TOPIC_TYPE);
    String oldHomeAssistantTopicType = oldHomeAssistantTopicTypeParamater->value();

    AsyncWebParameter* homeAssistantTopicTypeParamater = request->getParam(NEW_HA_TOPIC_TYPE);
    String homeAssistantTopicType = homeAssistantTopicTypeParamater->value();

  _channel->scheduleRestart(
    true,
    true,
    oldControlPin.toInt(),
    controlPin.toInt(),
    oldHomeAssistantTopicType.toInt(),
    homeAssistantTopicType.toInt()
  );
  request->send(200);
  }
}