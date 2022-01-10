#include <ESP8266React.h>
#include "./automation/Automation.h"
#include "./automation/Schedules.h"

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server);

/* #region Setup Schedule Objects */
 #if defined(CHANNEL_ONE)
  ChannelMqttSettingsService channelOneMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_ONE_BROKER_SETTINGS_FILE, CHANNEL_ONE_BROKER_SETTINGS_PATH, CHANNEL_ONE_CONTROL_PIN,
    CHANNEL_ONE_DEFAULT_NAME, CHANNEL_ONE_HOME_ASSISTANT_ENTITY, CHANNEL_ONE_HOMEASSISTANT_TOPIC_TYPE,
    CHANNEL_ONE_HOMEASSISTANT_ICON);

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
                                                        CHANNEL_ONE_DEFAULT_SPAN_TIME,
                                                        CHANNEL_ONE_DEFAULT_OVERRIDE_TIME,
                                                        CHANNEL_ONE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                        CHANNEL_ONE_HOMEASSISTANT_TOPIC_TYPE,
                                                        CHANNEL_ONE_HOMEASSISTANT_ICON,
                                                        REMOTE_CONFIG_ENABLED,
                                                        MASTER_DEVICE,
                                                        CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH);
  ChannelScheduleRestartService channelOneScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelOneTaskScheduler, CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_TWO)
  ChannelMqttSettingsService channelTwoMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_TWO_BROKER_SETTINGS_FILE, CHANNEL_TWO_BROKER_SETTINGS_PATH, CHANNEL_TWO_CONTROL_PIN,
    CHANNEL_TWO_DEFAULT_NAME, CHANNEL_TWO_HOME_ASSISTANT_ENTITY, CHANNEL_TWO_HOMEASSISTANT_TOPIC_TYPE,
    CHANNEL_TWO_HOMEASSISTANT_ICON);

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
                                                        CHANNEL_TWO_DEFAULT_SPAN_TIME,
                                                        CHANNEL_TWO_DEFAULT_OVERRIDE_TIME,
                                                        CHANNEL_TWO_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                        CHANNEL_TWO_HOMEASSISTANT_TOPIC_TYPE,
                                                        CHANNEL_TWO_HOMEASSISTANT_ICON,
                                                        REMOTE_CONFIG_ENABLED,
                                                        MASTER_DEVICE,
                                                        CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH);  
  ChannelScheduleRestartService channelTwoScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelTwoTaskScheduler, CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_THREE)
 ChannelMqttSettingsService channelThreeMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_THREE_BROKER_SETTINGS_FILE, CHANNEL_THREE_BROKER_SETTINGS_PATH, CHANNEL_THREE_CONTROL_PIN,
     CHANNEL_THREE_DEFAULT_NAME, CHANNEL_THREE_HOME_ASSISTANT_ENTITY, CHANNEL_THREE_HOMEASSISTANT_TOPIC_TYPE,
    CHANNEL_THREE_HOMEASSISTANT_ICON);

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
                                                        CHANNEL_THREE_DEFAULT_SPAN_TIME,
                                                        CHANNEL_THREE_DEFAULT_OVERRIDE_TIME,
                                                        CHANNEL_THREE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                        CHANNEL_THREE_HOMEASSISTANT_TOPIC_TYPE,
                                                        CHANNEL_THREE_HOMEASSISTANT_ICON,
                                                        REMOTE_CONFIG_ENABLED,
                                                        MASTER_DEVICE,
                                                        CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH);
  ChannelScheduleRestartService channelThreeScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelThreeTaskScheduler, CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH);
#endif  
#if defined(CHANNEL_FOUR)
 ChannelMqttSettingsService channelFourMqttSettingsService =
    ChannelMqttSettingsService(&server, &SPIFFS, esp8266React.getSecurityManager(),
    CHANNEL_FOUR_BROKER_SETTINGS_FILE, CHANNEL_FOUR_BROKER_SETTINGS_PATH, CHANNEL_FOUR_CONTROL_PIN,
    CHANNEL_FOUR_DEFAULT_NAME, CHANNEL_FOUR_HOME_ASSISTANT_ENTITY, CHANNEL_FOUR_HOMEASSISTANT_TOPIC_TYPE,
    CHANNEL_FOUR_HOMEASSISTANT_ICON);

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
                                                        CHANNEL_FOUR_DEFAULT_SPAN_TIME,
                                                        CHANNEL_FOUR_DEFAULT_OVERRIDE_TIME,
                                                        CHANNEL_FOUR_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                        CHANNEL_FOUR_HOMEASSISTANT_TOPIC_TYPE,
                                                        CHANNEL_FOUR_HOMEASSISTANT_ICON,
                                                        REMOTE_CONFIG_ENABLED,
                                                        MASTER_DEVICE,
                                                        CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH);
  ChannelScheduleRestartService channelFourScheduleRestartService = ChannelScheduleRestartService(&server, esp8266React.getSecurityManager(), &channelFourTaskScheduler, CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH);
#endif
/* #endregion */

#if defined(TOGGLE_READ_PIN)
  boolean bToggleSwitch = true;
#else
  #ifndef TOGGLE_READ_PIN
    #define TOGGLE_READ_PIN 0
  #endif
  boolean bToggleSwitch = false;
#endif

Automation automation = Automation();
Schedules schedules = Schedules(&automation);

void setup() {
  // start serial and filesystem
  Serial.begin(SERIAL_BAUD_RATE);

  automation.ntpSearch();
  // start the framework and demo project
  esp8266React.begin();

  /* #region Begin Schedules */
  #if defined(CHANNEL_ONE)
    ScheduleTask scheduleOneTask;
    scheduleOneTask.channelTaskScheduler = &channelOneTaskScheduler;
    scheduleOneTask.bToggleSwitch = bToggleSwitch;
    scheduleOneTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleOneTask.blinkLed = LED;
    scheduleOneTask.ledOn = LED_ON;
    schedules.addSchedule(scheduleOneTask);
  #endif  
  #if defined(CHANNEL_TWO)
    ScheduleTask scheduleTwoTask;
    scheduleTwoTask.channelTaskScheduler = &channelTwoTaskScheduler;
    scheduleTwoTask.bToggleSwitch = bToggleSwitch;
    scheduleTwoTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleTwoTask.blinkLed = LED;
    scheduleTwoTask.ledOn = LED_ON;
    schedules.addSchedule(scheduleTwoTask);
  #endif  
  #if defined(CHANNEL_THREE)
    ScheduleTask scheduleThreeTask;
    scheduleThreeTask.channelTaskScheduler = &channelThreeTaskScheduler;
    scheduleThreeTask.bToggleSwitch = bToggleSwitch;
    scheduleThreeTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleThreeTask.blinkLed = LED;
    scheduleThreeTask.ledOn = LED_ON;
    schedules.addSchedule(scheduleThreeTask);
  #endif  
  #if defined(CHANNEL_FOUR)
    ScheduleTask scheduleFourTask;
    scheduleFourTask.channelTaskScheduler = &channelFourTaskScheduler;
    scheduleFourTask.bToggleSwitch = bToggleSwitch;
    scheduleFourTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleFourTask.blinkLed = LED;
    scheduleFourTask.ledOn = LED_ON;
    schedules.addSchedule(scheduleFourTask);
  #endif
  /* #endregion */

  schedules.beginSchedules();
  schedules.setScheduleTimes();

  // start the server
  server.begin();
}

void loop() {
  // run the framework's loop function
  esp8266React.loop();

  // run the automation schedules
  schedules.runSchedules();
}
