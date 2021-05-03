#ifndef TaskScheduler_h
#define TaskScheduler_h

#include <ctime>
#include <Ticker.h>
#include "ChannelMqttSettingsService.h"
#include "ChannelStateService.h"

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
                    float  runEvery,         // run every 30 mins
                    float  offAfter,         // stop after 5 mins
                    time_t  startTimeHour,    // 8
                    time_t  startTimeMinute,  // 30
                    time_t  endTimeHour,      // 16
                    time_t  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService,
                    bool randomize,
                    float hotTimeHour,
                    float overrideTime,
                    bool enableMinimumRunTime);
    void begin();
    void resetOverrideTime();
    void setOverrideTime();
    void scheduleRestart(bool isTurnOffSwitch, bool isResetOverride);
    void scheduleTimeSpanTask();
    void runTask();
    void runHotTask();
    void controlOn();
    void controlOff();
    void scheduleRunEveryTask();
    void scheduleHotTask();

    time_t SpanRepeatTime;
    time_t SpanRepeatTimeCopy;
    Ticker SpanRepeatTicker;

    time_t OffHotHourTime;
    Ticker OffHotHourTicker;

    time_t HotHourTaskTime;
    time_t HotHourTaskTimeCopy;
    Ticker HotHourTaskTicker;
    
    time_t ScheduleTime;
    Ticker ScheduleTicker;

    time_t ScheduleHotTime;
    Ticker ScheduleHotTicker;

    time_t SpanTime;
    Ticker SpanTicker;

    time_t RunEveryTime;
    time_t RunEveryTimeCopy;
    Ticker RunEveryTicker;

    time_t ControlOnTime;
    Ticker ControlOnTicker;

    time_t ControlOffTime;
    Ticker ControlOffTicker;

    timer_t ReScheduleTasksTime;
    Ticker ReScheduleTasksTicker;
    bool IsResetSchedule;

    timer_t ScheduleOverrideTaskTime;
    Ticker ScheduleOverrideTicker;

    TaskScheduler();
    void setSchedule();
    void setScheduleTimes();
    void reScheduleTasks();

    private:
    bool _isHotScheduleActive;
    bool _isOverrideActive;
    CurrentTime getCurrentTime(){
        CurrentTime current;
        time_t curr_time;
	    curr_time = time(NULL);
	    tm *tm_local = localtime(&curr_time);
        current.minutesInSec = 60 * tm_local->tm_min;
        current.totalCurrentTimeInSec = 3600 * tm_local->tm_hour + current.minutesInSec + tm_local->tm_sec;
        return current;
    }
    time_t _controlOnTime;

    ChannelStateService _channelStateService;
    Channel _channel;
    time_t getScheduleTimeSpanOff();
    protected:

    void digitalClockDisplay();
    void digitalClockDisplay(time_t tnow);

    ScheduledTime getNextRunTime();
    void updateStatus(time_t delta);
    void updateNextRunStatus();
    time_t getRandomOnTimeSpan();
    time_t getRandomOffTimeSpan();

    void overrideControlOff(); 
    void tickerDetachAll(); 
    void controlOffTicker();
    void runTaskTicker();
    void stopHotTask();
    void controlOnTicker();
    void scheduleTaskTicker(ScheduledTime schedule);
    void scheduleHotTaskTicker(ScheduledTime schedule);
    void runHotTaskTicker();
    void stopHotTaskTicker();
    void scheduleTimeSpanTaskTicker(ScheduledTime schedule);
    void runSpanTaskTicker();
    void printSchedule(ScheduledTime schedule);
};

#endif