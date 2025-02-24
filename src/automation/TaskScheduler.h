#ifndef TASKSCHEDULER_H
#define TASKSCHEDULER_H

#include <Ticker.h>
#include "ITaskScheduler.h"
#include "TimeManager.h"
#include "ChannelMqttSettingsService.h"
#include "ChannelStateService.h"

class TaskScheduler : public ITaskScheduler {
public:
    TaskScheduler(AsyncWebServer* server,
                  SecurityManager* securityManager,
                  AsyncMqttClient* mqttClient,
                  FS* fs,
                  uint8_t channelControlPin,
                  const char* channelJsonConfigPath,
                  String restChannelEndPoint,
                  const char* webSocketChannelEndPoint,
                  float runEvery,
                  float offAfter,
                  int startTimeHour,
                  int startTimeMinute,
                  int endTimeHour,
                  int endTimeMinute,
                  bool enabled,
                  String channelName,
                  bool enableTimeSpan,
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
                  String activeStartDateRange,
                  String activeEndDateRange,
                  String buildVersion,
                  String weekDays,
                  bool autoRebootSystem);

    void begin() override;
    void resetOverrideTime() override;
    void setOverrideTime() override;
    void scheduleRestart(bool isTurnOffSwitch, bool isResetOverride, uint8_t oldControlPin, uint8_t controlPin, uint8_t oldHomeAssistantTopicType, uint8_t homeAssistantTopicType, bool enableDateRange) override;
    void scheduleTimeSpanTask() override;
    void runTask() override;
    void runHotTask() override;
    void controlOn() override;
    void controlOff() override;
    void scheduleRunEveryTask() override;
    void scheduleHotTask() override;
    void toggleSwitch() override;
    void setToggleSwitch(bool bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn) override;
    bool isScheduleWithInDateRange(String activeStartDateRange, String activeEndDateRange, bool enableDateRange, bool activeOutsideDateRange, time_t currentTime) override;
    void setSchedule(bool isReschedule=false);
    void setScheduleTimes();
    void reScheduleTasks();
    void scheduleButtonRead(bool bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn);
    uint8_t getChannelControlPin();
    uint8_t getChannelHomeAssistantTopicType();
    bool getChannelEnableDateRange();

private:
    int _toggleReadPin;
    bool _isHotScheduleActive;
    bool _isOverrideActive;
    bool _isReschedule;
    int _controlOnTime;

    ChannelStateService _channelStateService;
    Channel _channel;

    TimeManager _timeManager;
    Utilities _utilities;

    int getScheduleTimeSpanOff();

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

    Ticker SpanRepeatTicker;
    Ticker OffHotHourTicker;
    Ticker HotHourTaskTicker;
    Ticker ScheduleTicker;
    Ticker ScheduleHotTicker;
    Ticker SpanTicker;
    Ticker RunEveryTicker;
    Ticker ControlOnTicker;
    Ticker ControlOffTicker;
    Ticker ReScheduleTasksTicker;
    Ticker ScheduleOverrideTicker;
    Ticker ScheduleButtonDebounceTicker;
    Ticker ScheduleButtonTicker;

    int SpanRepeatTime;
    int SpanRepeatTimeCopy;
    int OffHotHourTime;
    int HotHourTaskTime;
    int HotHourTaskTimeCopy;
    int ScheduleTime;
    int ScheduleHotTime;
    int SpanTime;
    int RunEveryTime;
    int RunEveryTimeCopy;
    short ControlOnTime;
    int ControlOffTime;
    int ReScheduleTasksTime;
    int ScheduleOverrideTaskTime;
    int ToggleReadPinValue;
    int ToggleButtonState;
    int LED;
    int LED_ON;
    bool BToggleSwitch;
};

#endif