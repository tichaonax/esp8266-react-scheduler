
//#include <ESP8266React.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include "./automation/Automation.h"
#include "./automation/Schedules.h"

#ifdef ESP32
#include <esp_task_wdt.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#endif

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React* esp8266React = nullptr;

/* #region Setup Schedule Objects */
#if defined(CHANNEL_ONE)
ChannelMqttSettingsService* channelOneMqttSettingsService = nullptr;
TaskScheduler* channelOneTaskScheduler = nullptr;
ChannelScheduleRestartService* channelOneScheduleRestartService = nullptr;
#endif
#if defined(CHANNEL_TWO)
ChannelMqttSettingsService* channelTwoMqttSettingsService = nullptr;
TaskScheduler* channelTwoTaskScheduler = nullptr;
ChannelScheduleRestartService* channelTwoScheduleRestartService = nullptr;
#endif
#if defined(CHANNEL_THREE)
ChannelMqttSettingsService* channelThreeMqttSettingsService = nullptr;
TaskScheduler* channelThreeTaskScheduler = nullptr;
ChannelScheduleRestartService* channelThreeScheduleRestartService = nullptr;
#endif
#if defined(CHANNEL_FOUR)
ChannelMqttSettingsService* channelFourMqttSettingsService = nullptr;
TaskScheduler* channelFourTaskScheduler = nullptr;
ChannelScheduleRestartService* channelFourScheduleRestartService = nullptr;
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


void setup()
{
    // start serial and filesystem
    Serial.begin(SERIAL_BAUD_RATE);
    
    // Add delay for serial monitor to catch startup messages
    delay(1000);
    
    Serial.println(F("Starting ESP32 React Scheduler..."));
    Serial.printf("Free heap: %u bytes\n", ESP.getFreeHeap());
    
#ifdef ESP32
    // ESP32-specific initialization for dual-core stability
    Serial.println(F("Configuring ESP32 dual-core environment..."));
    
    // Initialize task watchdog with longer timeout, manual feeding only
    esp_task_wdt_init(60, false); // Don't auto-add IDLE tasks
    
    // Ensure stable task scheduling
    vTaskDelay(pdMS_TO_TICKS(100));
    
    Serial.printf("Running on Core: %d\n", xPortGetCoreID());
    Serial.printf("Total heap: %u bytes\n", ESP.getHeapSize());
    Serial.printf("Free heap: %u bytes\n", ESP.getFreeHeap());
    Serial.printf("Min free heap: %u bytes\n", ESP.getMinFreeHeap());
#endif
    
    // Feed watchdog during setup
    yield();
    
    automation.ntpSearch();
    
    // Feed watchdog before starting framework
    yield();
    
    // start the framework and demo project
    Serial.println(F("Initializing ESP8266React framework..."));
    
    // Create ESP8266React object after RTOS is ready
    esp8266React = new ESP8266React(&server);
    esp8266React->begin();
    
    // Initialize filesystem directory structure
    Serial.println(F("Initializing filesystem directories..."));
    if (!LittleFS.exists("/config")) {
        Serial.println(F("Creating /config directory..."));
        if (LittleFS.mkdir("/config")) {
            Serial.println(F("/config directory created successfully"));
        } else {
            Serial.println(F("Failed to create /config directory"));
        }
    } else {
        Serial.println(F("/config directory already exists"));
    }

    // Initialize channel objects after ESP8266React is ready
#if defined(CHANNEL_ONE)
    channelOneMqttSettingsService = new ChannelMqttSettingsService(&server, &LittleFS, esp8266React->getSecurityManager(),
                                   CHANNEL_ONE_BROKER_SETTINGS_FILE, CHANNEL_ONE_BROKER_SETTINGS_PATH, CHANNEL_ONE_CONTROL_PIN,
                                   CHANNEL_ONE_DEFAULT_NAME, CHANNEL_ONE_HOME_ASSISTANT_ENTITY, CHANNEL_ONE_HOMEASSISTANT_TOPIC_TYPE,
                                   CHANNEL_ONE_HOMEASSISTANT_ICON);

    channelOneTaskScheduler = new TaskScheduler(&server,
                                               esp8266React->getSecurityManager(),
                                               esp8266React->getMqttClient(),
                                               &LittleFS,
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
                                               channelOneMqttSettingsService,
                                               CHANNEL_ONE_DEFAULT_RANDOMIZE_SCHEDULE,
                                               CHANNEL_ONE_DEFAULT_SPAN_TIME,
                                               CHANNEL_ONE_DEFAULT_OVERRIDE_TIME,
                                               CHANNEL_ONE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                               CHANNEL_ONE_HOMEASSISTANT_TOPIC_TYPE,
                                               CHANNEL_ONE_HOMEASSISTANT_ICON,
                                               REMOTE_CONFIG_ENABLED,
                                               MASTER_DEVICE,
                                               CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH,
                                               CHANNEL_ONE_ENABLE_DATE_RANGE,
                                               CHANNEL_ONE_ACTIVE_OUTSIDE_DATE_RANGE,
                                               CHANNEL_ONE_ACTIVE_START_DATE_RANGE,
                                               CHANNEL_ONE_ACTIVE_END_DATE_RANGE,
                                               BUILD_VERSION,
                                               CHANNEL_ONE_ACTIVE_WEEK_DAYS,
                                               AUTO_SYSTEM_REBOOT_ENABLED);
    channelOneScheduleRestartService = new ChannelScheduleRestartService(&server, esp8266React->getSecurityManager(), channelOneTaskScheduler, CHANNEL_ONE_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_TWO)
    channelTwoMqttSettingsService = new ChannelMqttSettingsService(&server, &LittleFS, esp8266React->getSecurityManager(),
                                   CHANNEL_TWO_BROKER_SETTINGS_FILE, CHANNEL_TWO_BROKER_SETTINGS_PATH, CHANNEL_TWO_CONTROL_PIN,
                                   CHANNEL_TWO_DEFAULT_NAME, CHANNEL_TWO_HOME_ASSISTANT_ENTITY, CHANNEL_TWO_HOMEASSISTANT_TOPIC_TYPE,
                                   CHANNEL_TWO_HOMEASSISTANT_ICON);

    channelTwoTaskScheduler = new TaskScheduler(&server,
                                               esp8266React->getSecurityManager(),
                                               esp8266React->getMqttClient(),
                                               &LittleFS,
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
                                               channelTwoMqttSettingsService,
                                               CHANNEL_TWO_DEFAULT_RANDOMIZE_SCHEDULE,
                                               CHANNEL_TWO_DEFAULT_SPAN_TIME,
                                               CHANNEL_TWO_DEFAULT_OVERRIDE_TIME,
                                               CHANNEL_TWO_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                               CHANNEL_TWO_HOMEASSISTANT_TOPIC_TYPE,
                                               CHANNEL_TWO_HOMEASSISTANT_ICON,
                                               REMOTE_CONFIG_ENABLED,
                                               MASTER_DEVICE,
                                               CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH,
                                               CHANNEL_TWO_ENABLE_DATE_RANGE,
                                               CHANNEL_TWO_ACTIVE_OUTSIDE_DATE_RANGE,
                                               CHANNEL_TWO_ACTIVE_START_DATE_RANGE,
                                               CHANNEL_TWO_ACTIVE_END_DATE_RANGE,
                                               BUILD_VERSION,
                                               CHANNEL_TWO_ACTIVE_WEEK_DAYS,
                                               AUTO_SYSTEM_REBOOT_ENABLED);
    channelTwoScheduleRestartService = new ChannelScheduleRestartService(&server, esp8266React->getSecurityManager(), channelTwoTaskScheduler, CHANNEL_TWO_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_THREE)
    channelThreeMqttSettingsService = new ChannelMqttSettingsService(&server, &LittleFS, esp8266React->getSecurityManager(),
                                     CHANNEL_THREE_BROKER_SETTINGS_FILE, CHANNEL_THREE_BROKER_SETTINGS_PATH, CHANNEL_THREE_CONTROL_PIN,
                                     CHANNEL_THREE_DEFAULT_NAME, CHANNEL_THREE_HOME_ASSISTANT_ENTITY, CHANNEL_THREE_HOMEASSISTANT_TOPIC_TYPE,
                                     CHANNEL_THREE_HOMEASSISTANT_ICON);

    channelThreeTaskScheduler = new TaskScheduler(&server,
                                                 esp8266React->getSecurityManager(),
                                                 esp8266React->getMqttClient(),
                                                 &LittleFS,
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
                                                 channelThreeMqttSettingsService,
                                                 CHANNEL_THREE_DEFAULT_RANDOMIZE_SCHEDULE,
                                                 CHANNEL_THREE_DEFAULT_SPAN_TIME,
                                                 CHANNEL_THREE_DEFAULT_OVERRIDE_TIME,
                                                 CHANNEL_THREE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                 CHANNEL_THREE_HOMEASSISTANT_TOPIC_TYPE,
                                                 CHANNEL_THREE_HOMEASSISTANT_ICON,
                                                 REMOTE_CONFIG_ENABLED,
                                                 MASTER_DEVICE,
                                                 CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH,
                                                 CHANNEL_THREE_ENABLE_DATE_RANGE,
                                                 CHANNEL_THREE_ACTIVE_OUTSIDE_DATE_RANGE,
                                                 CHANNEL_THREE_ACTIVE_START_DATE_RANGE,
                                                 CHANNEL_THREE_ACTIVE_END_DATE_RANGE,
                                                 BUILD_VERSION,
                                                 CHANNEL_THREE_ACTIVE_WEEK_DAYS,
                                                 AUTO_SYSTEM_REBOOT_ENABLED);
    channelThreeScheduleRestartService = new ChannelScheduleRestartService(&server, esp8266React->getSecurityManager(), channelThreeTaskScheduler, CHANNEL_THREE_SCHEDULE_RESTART_SERVICE_PATH);
#endif
#if defined(CHANNEL_FOUR)
    channelFourMqttSettingsService = new ChannelMqttSettingsService(&server, &LittleFS, esp8266React->getSecurityManager(),
                                    CHANNEL_FOUR_BROKER_SETTINGS_FILE, CHANNEL_FOUR_BROKER_SETTINGS_PATH, CHANNEL_FOUR_CONTROL_PIN,
                                    CHANNEL_FOUR_DEFAULT_NAME, CHANNEL_FOUR_HOME_ASSISTANT_ENTITY, CHANNEL_FOUR_HOMEASSISTANT_TOPIC_TYPE,
                                    CHANNEL_FOUR_HOMEASSISTANT_ICON);

    channelFourTaskScheduler = new TaskScheduler(&server,
                                                esp8266React->getSecurityManager(),
                                                esp8266React->getMqttClient(),
                                                &LittleFS,
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
                                                channelFourMqttSettingsService,
                                                CHANNEL_FOUR_DEFAULT_RANDOMIZE_SCHEDULE,
                                                CHANNEL_FOUR_DEFAULT_SPAN_TIME,
                                                CHANNEL_FOUR_DEFAULT_OVERRIDE_TIME,
                                                CHANNEL_FOUR_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE,
                                                CHANNEL_FOUR_HOMEASSISTANT_TOPIC_TYPE,
                                                CHANNEL_FOUR_HOMEASSISTANT_ICON,
                                                REMOTE_CONFIG_ENABLED,
                                                MASTER_DEVICE,
                                                CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH,
                                                CHANNEL_FOUR_ENABLE_DATE_RANGE,
                                                CHANNEL_FOUR_ACTIVE_OUTSIDE_DATE_RANGE,
                                                CHANNEL_FOUR_ACTIVE_START_DATE_RANGE,
                                                CHANNEL_FOUR_ACTIVE_END_DATE_RANGE,
                                                BUILD_VERSION,
                                                CHANNEL_FOUR_ACTIVE_WEEK_DAYS,
                                                AUTO_SYSTEM_REBOOT_ENABLED);
    channelFourScheduleRestartService = new ChannelScheduleRestartService(&server, esp8266React->getSecurityManager(), channelFourTaskScheduler, CHANNEL_FOUR_SCHEDULE_RESTART_SERVICE_PATH);
#endif

    /* #region Begin Schedules */
#if defined(CHANNEL_ONE)
    ScheduleTask scheduleOneTask;
    scheduleOneTask.channelTaskScheduler = channelOneTaskScheduler;
    scheduleOneTask.bToggleSwitch = bToggleSwitch;
    scheduleOneTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleOneTask.blinkLed = LED;
    scheduleOneTask.ledOn = LED_ON;
    scheduleOneTask.bAutoRebootSystem = AUTO_SYSTEM_REBOOT_ENABLED;
    schedules.addSchedule(scheduleOneTask);
#endif
#if defined(CHANNEL_TWO)
    ScheduleTask scheduleTwoTask;
    scheduleTwoTask.channelTaskScheduler = channelTwoTaskScheduler;
    scheduleTwoTask.bToggleSwitch = bToggleSwitch;
    scheduleTwoTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleTwoTask.blinkLed = LED;
    scheduleTwoTask.ledOn = LED_ON;
    scheduleTwoTask.bAutoRebootSystem = AUTO_SYSTEM_REBOOT_ENABLED;
    schedules.addSchedule(scheduleTwoTask);
#endif
#if defined(CHANNEL_THREE)
    ScheduleTask scheduleThreeTask;
    scheduleThreeTask.channelTaskScheduler = channelThreeTaskScheduler;
    scheduleThreeTask.bToggleSwitch = bToggleSwitch;
    scheduleThreeTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleThreeTask.blinkLed = LED;
    scheduleThreeTask.ledOn = LED_ON;
    scheduleThreeTask.bAutoRebootSystem = AUTO_SYSTEM_REBOOT_ENABLED;
    schedules.addSchedule(scheduleThreeTask);
#endif
#if defined(CHANNEL_FOUR)
    ScheduleTask scheduleFourTask;
    scheduleFourTask.channelTaskScheduler = channelFourTaskScheduler;
    scheduleFourTask.bToggleSwitch = bToggleSwitch;
    scheduleFourTask.toggleReadPin = TOGGLE_READ_PIN;
    scheduleFourTask.blinkLed = LED;
    scheduleFourTask.ledOn = LED_ON;
    scheduleFourTask.bAutoRebootSystem = AUTO_SYSTEM_REBOOT_ENABLED;
    schedules.addSchedule(scheduleFourTask);
#endif
    /* #endregion */

    // Feed watchdog before starting schedules
    yield();
    
    Serial.println(F("Starting schedules..."));
    schedules.beginSchedules();
    schedules.setScheduleTimes();

    // Feed watchdog before starting server
    yield();
    
    // start the server
    Serial.println(F("Starting web server..."));
    server.begin();
    
    Serial.println(F("Setup complete!"));
    Serial.printf("Free heap: %u bytes\n", ESP.getFreeHeap());
}

void loop()
{
#ifdef ESP32
    // ESP32: Feed task watchdog explicitly
    esp_task_wdt_reset();
#endif
    // Feed watchdog at the beginning of each loop iteration
    yield();
    
    // run the framework's loop function
    esp8266React->loop();

#ifdef ESP32
    // ESP32: Feed task watchdog between operations
    esp_task_wdt_reset();
#endif
    // Feed watchdog between major operations
    yield();
    
    // run the automation schedules
    schedules.runSchedules();
    
#ifdef ESP32
    // ESP32: Feed task watchdog after schedules
    esp_task_wdt_reset();
#endif
    // Feed watchdog at the end of loop
    yield();
}
