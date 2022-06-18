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
                    uint8_t channelControlPin,  // 5
                    char* channelJsonConfigPath,  //  "/config/channelOneState.json" 
                    String restChannelEndPoint, //  "/rest/channelOneState"
                    char* webSocketChannelEndPoint, //  "/ws/channelOneState"
                    float  runEvery,         // run every 30 mins
                    float  offAfter,         // stop after 5 mins
                    int  startTimeHour,    // 8
                    int  startTimeMinute,  // 30
                    int  endTimeHour,      // 16
                    int  endTimeMinute,    // 30
                    bool    enabled,
                    String  channelName,
                    bool  enableTimeSpan,
                    ChannelMqttSettingsService* channelMqttSettingsService,
                    bool randomize,
                    float hotTimeHour,
                    float overrideTime,
                    bool enableMinimumRunTime,
                    uint8_t homeAssistantTopicType,
                    String homeAssistantIcon,
                    bool enableRemoteConfiguration,
                    String masterIPAddress,
                    String restChannelRestartEndPoint,
                    bool enableDateRange,
                    bool activeOutsideDateRange,
                    String  activeStartDateRange,
                    String  activeEndDateRange,
                    String buildVersion);
    void begin();
    void resetOverrideTime();
    void setOverrideTime();
    void scheduleRestart(
        bool isTurnOffSwitch,
        bool isResetOverride,
        uint8_t oldControlPin,
        uint8_t controlPin,
        uint8_t oldHomeAssistantTopicType,
        uint8_t homeAssistantTopicType
        );
    void scheduleTimeSpanTask();
    void runTask();
    void runHotTask();
    void controlOn();
    void controlOff();
    void scheduleRunEveryTask();
    void scheduleHotTask();
    void toggleSwitch();
    void setToggleSwitch(boolean bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn);
    bool isScheduleWithInDateRange(String activeStartDateRange, String activeEndDateRange, bool enableDateRange, bool activeOutsideDateRange, time_t currentTime);

#ifdef ESP32
    Utilities utils;
#endif

    int SpanRepeatTime;
    int SpanRepeatTimeCopy;
    Ticker SpanRepeatTicker;

    int OffHotHourTime;
    Ticker OffHotHourTicker;

    int HotHourTaskTime;
    int HotHourTaskTimeCopy;
    Ticker HotHourTaskTicker;
    
    int ScheduleTime;
    Ticker ScheduleTicker;

    int ScheduleHotTime;
    Ticker ScheduleHotTicker;

    int SpanTime;
    Ticker SpanTicker;

    int RunEveryTime;
    int RunEveryTimeCopy;
    Ticker RunEveryTicker;

    short ControlOnTime;
    Ticker ControlOnTicker;

    int ControlOffTime;
    Ticker ControlOffTicker;

    int ReScheduleTasksTime;
    Ticker ReScheduleTasksTicker;

    int ScheduleOverrideTaskTime;
    Ticker ScheduleOverrideTicker;

    int ToggleReadPinValue;
    int ToggleButtonState;
    int LED;
    int LED_ON;
    bool BToggleSwitch; 
    Ticker ScheduleButtonDebounceTicker;
    Ticker ScheduleButtonTicker;

    TaskScheduler();
    void setSchedule(bool isReschedule=false);
    void setScheduleTimes();
    void reScheduleTasks();
    void scheduleButtonRead(boolean bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn);

    uint8_t getChannelControlPin();
    uint8_t getChannelHomeAssistantTopicType();

    private:
    int _toggleReadPin;
    bool _isHotScheduleActive;
    bool _isOverrideActive;
    bool _isReschedule;
    CurrentTime getCurrentTime(){
        CurrentTime current;
        time_t curr_time;
	    curr_time = time(NULL);
	    tm *tm_local = localtime(&curr_time);
        current.minutesInSec = 60 * tm_local->tm_min;
        current.totalCurrentTimeInSec = 3600 * tm_local->tm_hour + current.minutesInSec + tm_local->tm_sec;
        return current;
    }
    int _controlOnTime;

    ChannelStateService _channelStateService;
    Channel _channel;
    int getScheduleTimeSpanOff();
    protected:

    void digitalClockDisplay();
    void digitalClockDisplay(time_t tnow);

    ScheduledTime getNextRunTime();
    void updateStatus(short delta);
    void updateNextRunStatus();
    int getRandomOnTimeSpan();
    int getRandomOffTimeSpan();

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