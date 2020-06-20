#include <ESP8266React.h>
//#include <LightMqttSettingsService.h>
//#include <LightStateService.h>
#include <FS.h>

#include "./automation/TaskScheduler.h"
#include "./automation/ChannelStateService.h"

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server, &SPIFFS);
/* LightMqttSettingsService lightMqttSettingsService =
    LightMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager());
LightStateService lightStateService = LightStateService(&server,
                                                        esp8266React.getSecurityManager(),
                                                        esp8266React.getMqttClient(),
                                                        &lightMqttSettingsService); */

TaskScheduler channelOnetaskScheduler = TaskScheduler(&server,
                                                        esp8266React.getSecurityManager(),
                                                        esp8266React.getMqttClient(),
                                                        &SPIFFS,
                                                        CHANNEL_ONE_CONTROL_PIN,
                                                        CHANNEL_ONE_CONFIG_JSON_PATH,
                                                        CHANNEL_ONE_REST_ENDPOINT_PATH,
                                                        CHANNEL_ONE_SOCKET_PATH,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_RUN_EVERY,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_OFF_AFTER,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_HOUR,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_MINUTE,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_HOUR,
                                                        CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_MINUTE,
                                                        CHANNEL_ONE_DEFAULT_ENABLED_STATE,
                                                        CHANNEL_ONE_DEFAULT_NAME,
                                                        CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE);

TaskScheduler channelTwotaskScheduler = TaskScheduler(&server,
                                                        esp8266React.getSecurityManager(),
                                                        esp8266React.getMqttClient(),
                                                        &SPIFFS,
                                                        CHANNEL_TWO_CONTROL_PIN,
                                                        CHANNEL_TWO_CONFIG_JSON_PATH,
                                                        CHANNEL_TWO_REST_ENDPOINT_PATH,
                                                        CHANNEL_TWO_SOCKET_PATH,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_RUN_EVERY,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_OFF_AFTER,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_HOUR,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_MINUTE,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_HOUR,
                                                        CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_MINUTE,
                                                        CHANNEL_TWO_DEFAULT_ENABLED_STATE,
                                                        CHANNEL_TWO_DEFAULT_NAME,
                                                        CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE);  

TaskScheduler channelThreetaskScheduler = TaskScheduler(&server,
                                                        esp8266React.getSecurityManager(),
                                                        esp8266React.getMqttClient(),
                                                        &SPIFFS,
                                                        CHANNEL_THREE_CONTROL_PIN,
                                                        CHANNEL_THREE_CONFIG_JSON_PATH,
                                                        CHANNEL_THREE_REST_ENDPOINT_PATH,
                                                        CHANNEL_THREE_SOCKET_PATH,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_RUN_EVERY,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_OFF_AFTER,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_HOUR,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_MINUTE,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_HOUR,
                                                        CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_MINUTE,
                                                        CHANNEL_THREE_DEFAULT_ENABLED_STATE,
                                                        CHANNEL_THREE_DEFAULT_NAME,
                                                        CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE);  
                                                        
 TaskScheduler channelFourtaskScheduler = TaskScheduler(&server,
                                                        esp8266React.getSecurityManager(),
                                                        esp8266React.getMqttClient(),
                                                        &SPIFFS,
                                                        CHANNEL_FOUR_CONTROL_PIN,
                                                        CHANNEL_FOUR_CONFIG_JSON_PATH,
                                                        CHANNEL_FOUR_REST_ENDPOINT_PATH,
                                                        CHANNEL_FOUR_SOCKET_PATH,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_RUN_EVERY,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_OFF_AFTER,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_HOUR,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_MINUTE,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_HOUR,
                                                        CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_MINUTE,
                                                        CHANNEL_FOUR_DEFAULT_ENABLED_STATE,
                                                        CHANNEL_FOUR_DEFAULT_NAME,
                                                        CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE);

void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  // start the file system (must be done before starting the framework)
#ifdef ESP32
  SPIFFS.begin(true);
#elif defined(ESP8266)
  SPIFFS.begin();
#endif

  // start the framework and demo project
  esp8266React.begin();

  // load the initial light settings
  //lightStateService.begin();

  channelOnetaskScheduler.begin();
  channelTwotaskScheduler.begin();
  channelThreetaskScheduler.begin();
  channelFourtaskScheduler.begin();

  channelOnetaskScheduler.setScheduleTimes();
  channelTwotaskScheduler.setScheduleTimes();
  channelThreetaskScheduler.setScheduleTimes();
  channelFourtaskScheduler.setScheduleTimes();

  // start the server
  server.begin();
}

void loop() {
  esp8266React.loop();
  ESP.wdtFeed();
  channelOnetaskScheduler.loop();
  ESP.wdtFeed();
  channelTwotaskScheduler.loop();
  ESP.wdtFeed();
  channelThreetaskScheduler.loop();
  ESP.wdtFeed();
  channelFourtaskScheduler.loop();
}