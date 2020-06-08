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
#define CHANNEL_ONE_DEFAULT_NAME "Channel One Control" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath

#define CHANNEL_TWO_CONTROL_PIN 12
#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Channel Two Control" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath

#define CHANNEL_THREE_CONTROL_PIN 13
#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Channel Three Control" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath

#define CHANNEL_FOUR_CONTROL_PIN 14
#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Channel Four Control" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath

class TaskScheduler {
    public:
    TaskScheduler(AsyncWebServer* server,
                    SecurityManager* securityManager,
                    AsyncMqttClient* mqttClient,
                    FS* fs,
                    int channelControlPin,  // 5
                    char* channelJsonConfigPath,  //  "/config/channelOneState.json"   
                    String defaultChannelName,  //  Channel One Control
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint //  "/ws/channelOneState"
    );
    void begin();
    void loop();
    void setIsNewDate(bool newDate){
        _newDate = newDate; 
    };

    bool getIsNewDate(){
        return _newDate; 
    };

    TaskScheduler();
    void setSchedule();
    void setScheduleTimes();
    uint8_t getCurrenYear();
    CurrentTime getCurrentTime(){
        CurrentTime current;
        current.hours = 3600 * Alarm.getDigitsNow(dtHour);
        current.minutes = 60 * Alarm.getDigitsNow(dtMinute);
        current.seconds = Alarm.getDigitsNow(dtSecond);
        current.totalCurrentTime = current.hours + current.minutes + current.seconds;
        return current;
    }

    private:
    ChannelStateService _channelStateService;
    Channel _channel;
    bool    _newDate = false;       // Wait for NTP to get valid time
    time_t getScheduleTimeSpan();
    protected:

    void digitalClockDisplay();
    void digitalClockDisplay(time_t tnow);

    ScheduledTime getNextRunTime();
    void runTask();
    bool shouldRunTask();
    void scheduleTask();
    void controlOn();
    void controlOff();  
};

#endif