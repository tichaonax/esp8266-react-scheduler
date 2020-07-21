#ifndef TaskScheduler_h
#define TaskScheduler_h

#include <ctime>
#include "ESP8266TimeAlarms.h"
#include "ChannelMqttSettingsService.h"
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
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService,
                    bool randomize);
    void begin();
    void loop();
    void scheduleRestart();

    TaskScheduler();
    void setSchedule();
    void setScheduleTimes();

    private:
    CurrentTime getCurrentTime(){
        CurrentTime current;
        time_t curr_time;
	    curr_time = time(NULL);
	    tm *tm_local = localtime(&curr_time);
	    current.hours = 3600 * tm_local->tm_hour;
        current.minutes = 60 * tm_local->tm_min;
        current.seconds = tm_local->tm_sec;
        current.totalCurrentTime = current.hours + current.minutes + current.seconds;
        return current;
    }

    AlarmId _timerRepeat;

    ChannelStateService _channelStateService;
    Channel _channel;
    bool    _validNTP = false;       // Wait for NTP to get valid time
    time_t getScheduleTimeSpanOff();
    protected:

    void digitalClockDisplay();
    void digitalClockDisplay(time_t tnow);

    ScheduledTime getNextRunTime();
    ScheduledTime getTimeSpanScheduleNextRunTime(ScheduledTime& schedule);
    void runTask();
    bool shouldRunTask();
    void scheduleTask();
    void controlOn();
    void controlOff();
    void updateNextRunStatus();
    time_t getRandomOnTimeSpan();
    time_t getRandomOffTimeSpan();
    time_t getTimeSpanStartTimeFromNow();
    void scheduleTimeSpanTask();  
};

#endif