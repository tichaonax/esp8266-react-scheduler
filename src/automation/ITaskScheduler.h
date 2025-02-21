#ifndef ITASKSCHEDULER_H
#define ITASKSCHEDULER_H

class ITaskScheduler {
public:
    virtual void begin() = 0;
    virtual void resetOverrideTime() = 0;
    virtual void setOverrideTime() = 0;
    virtual void scheduleRestart(bool isTurnOffSwitch, bool isResetOverride, uint8_t oldControlPin, uint8_t controlPin, uint8_t oldHomeAssistantTopicType, uint8_t homeAssistantTopicType, bool enableDateRange) = 0;
    virtual void scheduleTimeSpanTask() = 0;
    virtual void runTask() = 0;
    virtual void runHotTask() = 0;
    virtual void controlOn() = 0;
    virtual void controlOff() = 0;
    virtual void scheduleRunEveryTask() = 0;
    virtual void scheduleHotTask() = 0;
    virtual void toggleSwitch() = 0;
    virtual void setToggleSwitch(bool bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn) = 0;
    virtual bool isScheduleWithInDateRange(String activeStartDateRange, String activeEndDateRange, bool enableDateRange, bool activeOutsideDateRange, time_t currentTime) = 0;
    virtual ~ITaskScheduler() = default;
};

#endif