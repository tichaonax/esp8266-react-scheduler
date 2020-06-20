#ifndef TaskScheduler_h
#define TaskScheduler_h

#include "ESP8266TimeAlarms.h"
#include "ChannelStateService.h"

#define MID_NIGHT_SECONDS 86399
#define TWENTY_FOUR_HOUR_DURATION MID_NIGHT_SECONDS + 1

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0


#define CHANNEL_ONE_CONTROL_PIN 5
#define CHANNEL_ONE_REST_ENDPOINT_PATH "/rest/channelOneState"  //restChannelEndPoint
#define CHANNEL_ONE_SOCKET_PATH "/ws/channelOneState"  // webSocketChannelEndPoint
#define CHANNEL_ONE_DEFAULT_NAME "Water Pump" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath
#define CHANNEL_ONE_DEFAULT_CONTROL_RUN_EVERY 15
#define CHANNEL_ONE_DEFAULT_CONTROL_OFF_AFTER 3
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_HOUR 16
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_ENABLED_STATE true
#define CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false

#define CHANNEL_TWO_CONTROL_PIN 12
#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Solar Fridge" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath
#define CHANNEL_TWO_DEFAULT_CONTROL_RUN_EVERY 30
#define CHANNEL_TWO_DEFAULT_CONTROL_OFF_AFTER 15
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_HOUR 21
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_ENABLED_STATE true
#define CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true

#define CHANNEL_THREE_CONTROL_PIN 13
#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Inside Lights" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath
#define CHANNEL_THREE_DEFAULT_CONTROL_RUN_EVERY 10
#define CHANNEL_THREE_DEFAULT_CONTROL_OFF_AFTER 5
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_HOUR 19
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_HOUR 4
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_THREE_DEFAULT_ENABLED_STATE true
#define CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false

#define CHANNEL_FOUR_CONTROL_PIN 14
#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Outside Lights" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath
#define CHANNEL_FOUR_DEFAULT_CONTROL_RUN_EVERY 30
#define CHANNEL_FOUR_DEFAULT_CONTROL_OFF_AFTER 5
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_HOUR 19
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_HOUR 4
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_FOUR_DEFAULT_ENABLED_STATE true
#define CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true

class TaskScheduler {
    public:
    TaskScheduler(AsyncWebServer* server,
                    SecurityManager* securityManager,
                    AsyncMqttClient* mqttClient,
                    FS* fs,
                    int channelControlPin,  // 5
                    char* channelJsonConfigPath,  //  "/config/channelOneState.json" 
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint, //  "/ws/channelOneState"
                    time_t  runEvery,         // run every 30 mins
                    time_t  offAfter,         // stop after 5 mins
                    time_t  startTimeHour,    // 8
                    time_t  startTimeMinute,  // 30
                    time_t  endTimeHour,      // 16
                    time_t  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan);
    void begin();
    void loop();

    TaskScheduler();
    void setSchedule();
    void setScheduleTimes();
    uint8_t getCurrenYear();

    private:
    CurrentTime getCurrentTime(){
        CurrentTime current;
        current.hours = 3600 * Alarm.getDigitsNow(dtHour);
        current.minutes = 60 * Alarm.getDigitsNow(dtMinute);
        current.seconds = Alarm.getDigitsNow(dtSecond);
        current.totalCurrentTime = current.hours + current.minutes + current.seconds;
        return current;
    }
    ChannelStateService _channelStateService;
    Channel _channel;
    bool    _validNTP = false;       // Wait for NTP to get valid time
    time_t getScheduleTimeSpan();
    protected:

    void digitalClockDisplay();
    void digitalClockDisplay(time_t tnow);

    ScheduledTime getNextRunTime();
    ScheduledTime getTimeSpanSchedule(ScheduledTime& schedule);
    void runTask();
    bool shouldRunTask();
    void scheduleTask();
    void controlOn();
    void controlOff();  
};

#endif