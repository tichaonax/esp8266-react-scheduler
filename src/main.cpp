#include <ESP8266React.h>
#include <LightMqttSettingsService.h>
#include <LightStateService.h>
#include <Ticker.h>

#include "./automation/Utilities.h"
#include "./automation/ChannelMqttSettingsService.h"
#include "./automation/Channels.h"
#include "./automation/TaskScheduler.h"
#include "./automation/ChannelStateService.h"
#include "./automation/ChannelScheduleRestartService.h"
#include "./automation/SystemStateService.h"

#define SERIAL_BAUD_RATE 115200
#define LED 2  //On board LED
#ifdef ESP32
  #define LED_ON CONTROL_ON
  #define LED_OFF CONTROL_OFF
#elif defined(ESP8266)
  #define LED_ON !CONTROL_ON  // LED 2 is inverted
  #define LED_OFF !CONTROL_OFF
#endif

Ticker blinkerHeartBeat;
Ticker blinkerHeartBeatOff;

bool validNTP;

void changeState()
{
  digitalWrite(LED, !(digitalRead(LED)));
}

void turnLedOff(){
  digitalWrite(LED, LED_OFF);
}

void turnLedOn(){
  digitalWrite(LED, LED_ON);
  blinkerHeartBeatOff.once(0.100, turnLedOff);
}

Ticker restartTicker;
struct SystemRestart {
  int day;
  time_t restartTime;
};

AsyncWebServer server(80);
ESP8266React esp8266React(&server);

SystemStateService systemStateService = SystemStateService(&server, esp8266React.getSecurityManager());

 #if defined(CHANNEL_ONE)
  ChannelMqttSettingsService channelOneMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_ONE_BROKER_SETTINGS_FILE, CHANNEL_ONE_BROKER_SETTINGS_PATH, CHANNEL_ONE_CONTROL_PIN,
    CHANNEL_ONE_DEFAULT_NAME, CHANNEL_ONE_HOME_ASSISTANT_ENTITY);

  TaskScheduler channelOneTaskScheduler = TaskScheduler(&server,
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
                                                        CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE,
                                                        &channelOneMqttSettingsService,
                                                        CHANNEL_ONE_DEFAULT_RANDOMIZE_SCHEDULE,
                                                        CHANNEL_ONE_DEFAULT_SPAN_TIME);
  ChannelScheduleRestartService channelOneScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelOneTaskScheduler, CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_TWO)
  ChannelMqttSettingsService channelTwoMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_TWO_BROKER_SETTINGS_FILE, CHANNEL_TWO_BROKER_SETTINGS_PATH, CHANNEL_TWO_CONTROL_PIN,
    CHANNEL_TWO_DEFAULT_NAME, CHANNEL_TWO_HOME_ASSISTANT_ENTITY);

  TaskScheduler channelTwoTaskScheduler = TaskScheduler(&server,
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
                                                        CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE,
                                                        &channelTwoMqttSettingsService,
                                                        CHANNEL_TWO_DEFAULT_RANDOMIZE_SCHEDULE,
                                                        CHANNEL_TWO_DEFAULT_SPAN_TIME);  
  ChannelScheduleRestartService channelTwoScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelTwoTaskScheduler, CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_THREE)
 ChannelMqttSettingsService channelThreeMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_THREE_BROKER_SETTINGS_FILE, CHANNEL_THREE_BROKER_SETTINGS_PATH, CHANNEL_THREE_CONTROL_PIN,
     CHANNEL_THREE_DEFAULT_NAME, CHANNEL_THREE_HOME_ASSISTANT_ENTITY);

  TaskScheduler channelThreeTaskScheduler = TaskScheduler(&server,
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
                                                        CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE,
                                                        &channelThreeMqttSettingsService,
                                                        CHANNEL_THREE_DEFAULT_RANDOMIZE_SCHEDULE,
                                                        CHANNEL_THREE_DEFAULT_SPAN_TIME);
  ChannelScheduleRestartService channelThreeScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelThreeTaskScheduler, CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH);
#endif  
#if defined(CHANNEL_FOUR)
 ChannelMqttSettingsService channelFourMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_FOUR_BROKER_SETTINGS_FILE, CHANNEL_FOUR_BROKER_SETTINGS_PATH, CHANNEL_FOUR_CONTROL_PIN,
    CHANNEL_FOUR_DEFAULT_NAME, CHANNEL_FOUR_HOME_ASSISTANT_ENTITY);

 TaskScheduler channelFourTaskScheduler = TaskScheduler(&server,
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
                                                        CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE,
                                                        &channelFourMqttSettingsService,
                                                        CHANNEL_FOUR_DEFAULT_RANDOMIZE_SCHEDULE,
                                                        CHANNEL_FOUR_DEFAULT_SPAN_TIME);
  ChannelScheduleRestartService channelFourScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelFourTaskScheduler, CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH);
#endif

SystemRestart getSystemRestart(time_t tnow){
  struct tm *lt = localtime(&tnow);
  lt->tm_hour = 0;
  lt->tm_min = 0;
  lt->tm_sec = 0;
  time_t midNightToday = mktime(lt);
  SystemRestart restart;
  restart.restartTime = TWENTY_FOUR_HOUR_DURATION + midNightToday - tnow;
  tm *ltm = localtime(&tnow);
  restart.day = ltm->tm_mday;
  return(restart);
}

  static void restartNow() {
    WiFi.disconnect(true);
    delay(500);
    ESP.restart();
  }


void runSchedules(){
    // check to see if NTP updated the local time
    if(!validNTP){
        time_t tnow = time(nullptr);
        String dateText = ctime(&tnow); 
        int year = dateText.substring(dateText.lastIndexOf(" ")+1).toInt();
        if(year > 1970){
          validNTP = true;
          blinkerHeartBeat.attach(2, +[&](){}); // disable fast blinker
          blinkerHeartBeat.attach(2, turnLedOn);  // and replace with normal
          #if defined(CHANNEL_ONE)
            channelOneTaskScheduler.setSchedule();
          #endif  
          #if defined(CHANNEL_TWO)
            channelTwoTaskScheduler.setSchedule();
          #endif  
          #if defined(CHANNEL_THREE)
            channelThreeTaskScheduler.setSchedule();
          #endif  
          #if defined(CHANNEL_FOUR)
            channelFourTaskScheduler.setSchedule();
          #endif

          SystemRestart restart = getSystemRestart(tnow);

          if(restart.day == 1 && restart.restartTime > 0) {
            // reset the system midnight first of every month.
            restartTicker.once(restart.restartTime, restartNow);
          }
        }
    }
}
void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  pinMode(LED,OUTPUT);
  validNTP = false;
 
  //blink fast every 0.125s till NTP is valid
  blinkerHeartBeat.attach(0.125, changeState);
  
  // start the framework and demo project
  esp8266React.begin();
  systemStateService.begin();

  // load the initial light settings
  //lightStateService.begin();

  // start the light service
  //lightMqttSettingsService.begin();

#if defined(CHANNEL_ONE)
  channelOneTaskScheduler.begin();
  channelOneTaskScheduler.setScheduleTimes();
#endif  
#if defined(CHANNEL_TWO)
  channelTwoTaskScheduler.begin();
  channelTwoTaskScheduler.setScheduleTimes();
#endif  
#if defined(CHANNEL_THREE)
  channelThreeTaskScheduler.begin();
  channelThreeTaskScheduler.setScheduleTimes();
#endif  
#if defined(CHANNEL_FOUR)
  channelFourTaskScheduler.begin();
  channelFourTaskScheduler.setScheduleTimes(); 
#endif

  // start the server
  server.begin();
}

void loop() {
  esp8266React.loop();
  runSchedules();
}