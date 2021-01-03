#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>

#define MID_NIGHT_SECONDS 86399
#define TWENTY_FOUR_HOUR_DURATION MID_NIGHT_SECONDS + 1
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

  time_t timeToStartSeconds(time_t currentTime, time_t startTime, time_t endTime, time_t startDateTime, time_t endDateTime){
    if(startTime < endTime){  // start 7:00 end 23:00
      if((difftime(endDateTime, currentTime) > 0)){ // we have not reached endTime
        if((difftime(startDateTime, currentTime) > 0)){ // we have not reached startTime
          return(startDateTime - currentTime);  // time to startTime
        }else{
          return (1); // start immediately we are between startTime and EndTime
        }
      }else{  // we are past endTime but before startTime
        return(startDateTime + TWENTY_FOUR_HOUR_DURATION - currentTime);  // we are starting next day
      }
    }else{  // start 19:00 end 3:00AM
      if(difftime(startDateTime, currentTime) > 0){ // we have not reached startTime
        //if((currentTime + TWENTY_FOUR_HOUR_DURATION) < endDateTime ){
        //  return(1);  // we have not reached end time of today start immediately
        //}
        // if(currentTime < endDateTime){ return (1);}
        return(startDateTime - currentTime);  // time to startTime
      }else{
        return (1); // start immediately we are between startTime and EndTime
      }
    }
  }

  ScheduledTime getScheduleTimes(time_t startTime, time_t endTime,
    time_t hotTimeHour, bool enableTimeSpan, bool isHotScheduleActive,
    String channelName, bool randomize){
    ScheduledTime schedule;
    schedule.isRandomize = randomize;
    schedule.channelName = channelName;
    schedule.isHotScheduleActive = isHotScheduleActive;
    schedule.isSpanSchedule = enableTimeSpan;
    schedule.currentTime = time(nullptr);
    schedule.startTime = startTime;
    schedule.endTime = endTime;

    struct tm *lt = localtime(&schedule.currentTime);
    lt->tm_hour = 0;
    lt->tm_min = 0;
    lt->tm_sec = 0;

    schedule.midNightToday = mktime(lt);
    
    schedule.scheduleStartDateTime = schedule.midNightToday + startTime;
    schedule.scheduleHotTimeEndDateTime = schedule.scheduleStartDateTime + hotTimeHour;

    schedule.scheduleEndDateTime = schedule.midNightToday + endTime;
    if (startTime > endTime) { schedule.scheduleEndDateTime = schedule.scheduleEndDateTime + TWENTY_FOUR_HOUR_DURATION;}
    
    schedule.scheduleTime = timeToStartSeconds(schedule.currentTime, startTime, endTime,
    schedule.scheduleStartDateTime, schedule.scheduleEndDateTime);
    schedule.isHotSchedule = schedule.isRandomize && (hotTimeHour > 0) && !schedule.isSpanSchedule;
   
    if (!schedule.isHotSchedule){
      schedule.isRunTaskNow = schedule.scheduleTime <= 1;
    }else{
      if(schedule.startTime < schedule.endTime){
        schedule.isRunTaskNow = schedule.currentTime > schedule.scheduleHotTimeEndDateTime 
        && schedule.currentTime < schedule.scheduleEndDateTime;
      }
      else{
        schedule.isRunTaskNow = schedule.currentTime  > schedule.scheduleHotTimeEndDateTime 
        && schedule.currentTime < schedule.scheduleEndDateTime | schedule.scheduleTime <= 1;
      }
    }
    schedule.isRunTaskNow = schedule.isRunTaskNow && !schedule.isHotScheduleActive;
    return schedule;
  }
};

extern Utilities Utils;  // make an instance for the user

#endif