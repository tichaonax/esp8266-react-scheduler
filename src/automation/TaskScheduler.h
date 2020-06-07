#ifndef TaskScheduler_h
#define TaskScheduler_h

#include "ESP8266TimeAlarms.h"
#include "ChannelStateService.h"

#define MID_NIGHT_SECONDS 86399
#define TWENTY_FOUR_HOUR_DURATION MID_NIGHT_SECONDS + 1

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0

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