#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>

struct ScheduledTime {
  time_t scheduleTime;
  time_t currentTime;
  time_t scheduleStartDateTime;
  time_t scheduleEndDateTime;
  bool isHotSchedule;
  time_t scheduleHotTimeEndDateTime;
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

  String strLocalNextRunTime(time_t delta){
    time_t now = time(0) + delta;
    return eraseLineFeed(ctime(&now)); 
  }

  time_t setDateTimeHour(time_t date_time, int hour){
    struct tm *lt = localtime(&date_time);
    lt->tm_hour = hour;
    return(mktime(lt));
  }

  time_t setDateTimeMinute(time_t date_time, int minute){
    struct tm *lt = localtime(&date_time);
    lt->tm_min = minute;
    return(mktime(lt));
  }

  time_t mkeDateTimeFromString(std::string str_date_time){
    struct tm tm;
    const char *time_details = str_date_time.c_str();
    strptime(time_details, "%a %b %d %H:%M:%S %Y", &tm);  
    return(mktime(&tm));
  }

  time_t midNightToday(){
    time_t now = time(nullptr);
    struct tm *lt = localtime(&now);
    lt->tm_hour = 0;
    lt->tm_min = 0;
    lt->tm_sec = 0;
    return mktime(lt);
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
        return(startDateTime + 86400 - currentTime);  // we are starting next day
      }
    }else{  // start 19:00 end 3:00AM
      if(difftime(startDateTime, currentTime) > 0){ // we have not reached startTime
        return(startDateTime - currentTime);  // time to startTime
      }else{
        return (1); // start immediately we are between startTime and EndTime
      }
    }
  }

  ScheduledTime getScheduleTimes(time_t startTime, time_t endTime, time_t hotTimeHour){
    ScheduledTime schedule;
    time_t startDateTime = midNightToday() + startTime;
    time_t endDateTime = midNightToday() + endTime;
    schedule.scheduleStartDateTime = startDateTime;
    schedule.scheduleHotTimeEndDateTime = startDateTime + hotTimeHour;
    if (startTime > endTime) { endDateTime = endDateTime + 86400;}
    schedule.scheduleEndDateTime = endDateTime;
    schedule.currentTime = time(nullptr);
    schedule.scheduleTime = timeToStartSeconds(schedule.currentTime, startTime, endTime, startDateTime, endDateTime);
    schedule.isHotSchedule = hotTimeHour > 0;
    return schedule;
  }
};

extern Utilities Utils;  // make an instance for the user

#endif