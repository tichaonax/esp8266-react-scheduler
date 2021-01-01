#ifndef TaskScheduler_h
#define TaskScheduler_h

#include <ctime>
#include <Ticker.h>
#include "ChannelMqttSettingsService.h"
#include "ChannelStateService.h"

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
                    float hotTimeHour);
    void begin();
    void scheduleRestart();
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
    void controlOnTicker();
    void scheduleTaskTicker();
    void scheduleHotTaskTicker(ScheduledTime schedule);
    void runHotTaskTicker();
    void stopHotTaskTicker();
    void scheduleTimeSpanTaskTicker(ScheduledTime schedule);
    void runSpanTaskTicker();
    void printSchedule(ScheduledTime schedule);
};

#endif