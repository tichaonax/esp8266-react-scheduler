#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0
#define MID_NIGHT_SECONDS 86399
#define TWENTY_FOUR_HOUR_DURATION MID_NIGHT_SECONDS + 1

struct TotalScheduledTime {
  bool isHotScheduleAdjust;
  time_t timeToStartSeconds;
};
struct ScheduledTime {
  time_t startTime;
  time_t endTime;
  time_t scheduleTime;
  time_t midNightToday;
  time_t currentTime;
  time_t scheduleStartDateTime;
  time_t scheduleEndDateTime;
  bool isHotSchedule;
  time_t scheduleHotTimeEndDateTime;
  bool isSpanSchedule;
  bool isRunTaskNow;
  bool isHotScheduleActive;
  String channelName;
  bool isRandomize;
  bool isHotScheduleAdjust;
  bool isOverrideActive;
  bool isEnableMinimumRunTime;
}; 

class Utilities {
public:
  String eraseLineFeed(std::string str){
    str.erase(std::remove(str.begin(), str.end(), '\n'), str.end());
    return str.c_str();
  }

  String strLocalTime(){
    time_t now = time(0);
    return eraseLineFeed(ctime(&now));
  }

  String strDeltaLocalTime(time_t delta){
    time_t now = time(0) + delta;
    return eraseLineFeed(ctime(&now)); 
  }

  TotalScheduledTime timeToStartSeconds(time_t currentTime, time_t startTime, time_t endTime, time_t startDateTime, time_t endDateTime){
    TotalScheduledTime totalTime;
    totalTime.timeToStartSeconds = 1;
    totalTime.isHotScheduleAdjust = false;
    if(startTime < endTime){  // start 7:00 end 23:00
      if(endDateTime > currentTime){ // we have not reached endTime
        if(startDateTime > currentTime){ // we have not reached startTime
          totalTime.timeToStartSeconds = startDateTime - currentTime;  // time to startTime
        }else{
          totalTime.timeToStartSeconds = 1; // start immediately we are between startTime and EndTime
        }
      }else{  // we are past endTime but before startTime
        totalTime.timeToStartSeconds = startDateTime + TWENTY_FOUR_HOUR_DURATION - currentTime; // we are starting next day
      }
    }else{  // start 19:00 end 3:00AM
      time_t timeToEnd = endDateTime - TWENTY_FOUR_HOUR_DURATION - currentTime;
      if(startDateTime > currentTime){
        if(timeToEnd > 0) { 
          totalTime.timeToStartSeconds = 1;
          totalTime.isHotScheduleAdjust = true;
        }else{
          totalTime.timeToStartSeconds = startDateTime - currentTime;
        }
      }else{
        if(currentTime < endDateTime){ 
          totalTime.timeToStartSeconds = 1; 
        }else{
        if(timeToEnd > 0) {
          totalTime.timeToStartSeconds = 1;
          totalTime.isHotScheduleAdjust = true;
        }else{
            totalTime.timeToStartSeconds = startDateTime - currentTime;
          }
        }
      }
    }
    return totalTime;
  }

  ScheduledTime getScheduleTimes(time_t startTime, time_t endTime,
    time_t hotTimeHour, bool enableTimeSpan, bool isHotScheduleActive,
    String channelName, bool randomize, bool isOverrideActive, bool enableMinimumRunTime){
    ScheduledTime schedule;
    schedule.isRandomize = randomize;
    schedule.channelName = channelName;
    schedule.isHotScheduleActive = isHotScheduleActive;
    schedule.isSpanSchedule = enableTimeSpan;
    schedule.currentTime = time(nullptr);
    schedule.startTime = startTime;
    schedule.endTime = endTime;
    schedule.isOverrideActive = isOverrideActive;
    schedule.isEnableMinimumRunTime = enableMinimumRunTime;

    struct tm *lt = localtime(&schedule.currentTime);
    lt->tm_hour = 0;
    lt->tm_min = 0;
    lt->tm_sec = 0;

    schedule.midNightToday = mktime(lt);
    
    schedule.scheduleStartDateTime = schedule.midNightToday + startTime;
    schedule.scheduleHotTimeEndDateTime = schedule.scheduleStartDateTime + hotTimeHour;

    schedule.scheduleEndDateTime = schedule.midNightToday + endTime;
    if (startTime > endTime) { schedule.scheduleEndDateTime = schedule.scheduleEndDateTime + TWENTY_FOUR_HOUR_DURATION;}
    
    TotalScheduledTime totalTime = timeToStartSeconds(schedule.currentTime, startTime, endTime,
    schedule.scheduleStartDateTime, schedule.scheduleEndDateTime);
    schedule.scheduleTime = totalTime.timeToStartSeconds;
    schedule.isHotScheduleAdjust = totalTime.isHotScheduleAdjust;
    schedule.isHotSchedule = schedule.isRandomize && (hotTimeHour > 0) && !schedule.isSpanSchedule;
   
    if (!schedule.isHotSchedule){
      schedule.isRunTaskNow = schedule.scheduleTime <= 1;
    }else{
      if(schedule.startTime < schedule.endTime){
        schedule.isRunTaskNow = schedule.currentTime > schedule.scheduleHotTimeEndDateTime 
        && schedule.currentTime < schedule.scheduleEndDateTime;
      }
      else{
        if(!schedule.isHotScheduleAdjust){
        schedule.isRunTaskNow = schedule.currentTime  > schedule.scheduleHotTimeEndDateTime 
        && schedule.currentTime < schedule.scheduleEndDateTime | schedule.scheduleTime <= 1;
        }else{
          schedule.isRunTaskNow = schedule.currentTime  > (schedule.scheduleHotTimeEndDateTime - TWENTY_FOUR_HOUR_DURATION)
          && schedule.currentTime < (schedule.scheduleEndDateTime - TWENTY_FOUR_HOUR_DURATION);
        }
      }
    }
    schedule.isRunTaskNow = schedule.isRunTaskNow && !schedule.isHotScheduleActive && !schedule.isOverrideActive;
    return schedule;
  }
};

extern Utilities Utils;  // make an instance for the user

#endif