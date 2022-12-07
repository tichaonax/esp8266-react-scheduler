#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>
#include <SettingValue.h>
#include "Homeassistant.h"
#include "Channels.h"

#define DEBUG 0

#if DEBUG == 1
  #define debug(x) Serial.print(x)
  #define debugln(x) Serial.println(x)
#else
  #define debug(x)
  #define debugln(x)
#endif // DEBUG

#define CONTROL_ON 0x1
#define CONTROL_OFF 0x0
#define MID_NIGHT_SECONDS 86399
#define TWENTY_FOUR_HOUR_DURATION MID_NIGHT_SECONDS + 1
#define ONE_HOUR_DURATION 3600

#define OFF_STATE "OFF"
#define ON_STATE "ON"
#define UTC_DATE_FORMAT "%Y-%m-%dT%H:%M:%SZ"

struct TotalScheduledTime {
  bool isHotScheduleAdjust;
  int timeToStartSeconds;
};
struct ScheduledTime {
  int startTime;
  int endTime;
  int scheduleTime;
  int midNightToday;
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
  bool isWithInDateRange;
}; 
struct Schedule {
    int  runEvery;         // run every 30 mins
    int  offAfter;         // stop after 5 mins
    int  startTimeHour;    // 8
    int  startTimeMinute;  // 30
    int  endTimeHour;      // 16
    int  endTimeMinute;    // 30
    bool isOverride;       // when true ignore schedule run
    int  hotTimeHour;      // default 0 hours [0-16]
    bool isOverrideActive;
    int  overrideTime;     // time to override schedule
    int  weekDays[7];      // active week days
};
struct Channel {
    bool  controlOn;
    uint8_t controlPin;
    uint8_t homeAssistantTopicType;
    String  homeAssistantIcon;
    int startTime;
    int endTime;
    bool  enabled;
    String  name;            // control name e.g, Pump
    Schedule  schedule;
    bool  enableTimeSpan;  // when enable control is on between startTime and endTime
    String  lastStartedChangeTime;  //last time the switch was toggled
    String  nextRunTime;
    bool  randomize;      // when enabled randomize the on/off
    String  localDateTime;
    String  IP;
    bool  isHotScheduleActive;
    String  offHotHourDateTime;
    String  controlOffDateTime;
    String  uniqueId;
    bool  enableMinimumRunTime; // when enabled in randomize time runs at least this minimum time
    bool  enableRemoteConfiguration; // when enabled
    String  masterIPAddress;
    String  restChannelEndPoint;
    String  restChannelRestartEndPoint;
    bool  enableDateRange;
    bool  activeOutsideDateRange;
    String  activeStartDateRange;
    String  activeEndDateRange;
    String buildVersion;
};

struct DateRange {
  time_t startDate;
  time_t endDate;
  bool valid;
};
class Utilities {
public:

  static DateRange getActiveDateRange(String activeStartDateRange, String activeEndDateRange, time_t currentTime){
    DateRange dateRange = {currentTime, currentTime, false};
    const char *timeStringStart = activeStartDateRange.c_str();
    const char *timeStringEnd = activeEndDateRange.c_str();
    if (timeStringStart[strlen(timeStringStart)-1] == 'Z'  && timeStringEnd[strlen(timeStringEnd)-1] == 'Z') {
      struct tm *lt = localtime(&currentTime);
      struct tm *dateStart = localtime(&currentTime);
      struct tm *dateEnd = localtime(&currentTime);

      #define NUM_START(off, mult) ((timeStringStart[(off)] - '0') * (mult))
      #define NUM_END(off, mult) ((timeStringEnd[(off)] - '0') * (mult)) 

      int startYear =  NUM_START(0, 1000) + NUM_START(1, 100) + NUM_START(2, 10) + NUM_START(3, 1) - 1900;
      int endYear = NUM_END(0, 1000) + NUM_END(1, 100) + NUM_END(2, 10) + NUM_END(3, 1) -  1900;

      dateStart->tm_year = lt->tm_year;
      dateStart->tm_mon = NUM_START(5, 10) + NUM_START(6, 1) - 1;
      dateStart->tm_mday = NUM_START(8, 10) + NUM_START(9, 1);
      dateStart->tm_hour = NUM_START(11, 10) + NUM_START(12, 1);
      dateStart->tm_min = NUM_START(14, 10) + NUM_START(15, 1);
      dateStart->tm_sec = NUM_START(17, 10) + NUM_START(18, 1);

      dateRange.startDate = mktime(dateStart);
     
      dateEnd->tm_year = lt->tm_year + endYear - startYear;;
      dateEnd->tm_mon = NUM_END(5, 10) + NUM_END(6, 1) - 1;
      dateEnd->tm_mday = NUM_END(8, 10) + NUM_END(9, 1);
      dateEnd->tm_hour = NUM_END(11, 10) + NUM_END(12, 1);
      dateEnd->tm_min = NUM_END(14, 10) + NUM_END(15, 1);
      dateEnd->tm_sec = NUM_END(17, 10) + NUM_END(18, 1);
      
      dateRange.endDate = mktime(dateEnd);
      if(dateRange.endDate > dateRange.startDate){
        dateRange.valid = startYear > 70 ? true : false;
      }
    }

    return dateRange;
  }

  static String eraseLineFeed(std::string str){
    str.erase(std::remove(str.begin(), str.end(), '\n'), str.end());
    return str.c_str();
  }

  String strLocalTime(){
    time_t now = time(nullptr);
    return eraseLineFeed(ctime(&now));
  }

  String strDeltaLocalTime(short delta){
    time_t now = time(nullptr) + delta;
    return eraseLineFeed(ctime(&now)); 
  }

  TotalScheduledTime timeToStartSeconds(time_t currentTime, int startTime, int endTime, time_t startDateTime, time_t endDateTime){
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
      int timeToEnd = endDateTime - TWENTY_FOUR_HOUR_DURATION - currentTime;
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

  bool canTaskRunToday(Channel channel, ScheduledTime scheduleTime){
     struct tm *lt = localtime(&scheduleTime.currentTime);
    int today = lt->tm_wday;

    bool canTaskRunToday = false;

    for (int day = 0; day < 7; day++){  
      if(channel.schedule.weekDays[day] == today){
        canTaskRunToday = true;
        break;
      }
    }
    
    return (canTaskRunToday && scheduleTime.isWithInDateRange);
  }
  
  ScheduledTime getScheduleTimes(int startTime, int endTime,
    int hotTimeHour, bool enableTimeSpan, bool isHotScheduleActive,
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

  static String getMqttUniqueIdOrPath(uint8_t controlPin, uint8_t homeAssistantTopicType, bool isUniqueIdOrPath, String homeAssistantEntity=""){
      String topicType;
      String topicHeader;
      switch (homeAssistantTopicType)
      {
        case HOMEASSISTANT_TOPIC_TYPE_SWITCH:
          topicHeader = "homeassistant/switch/";
          topicType = "switch";
        break;
        case HOMEASSISTANT_TOPIC_TYPE_LIGHT:
          topicHeader = "homeassistant/light/";
          topicType = "light";
        break;
        default:
        break;
      }

      return isUniqueIdOrPath ? 
      SettingValue::format(topicType + "-pin-" + String(controlPin) + "-#{unique_id}") :
      SettingValue::format(topicHeader + homeAssistantEntity + "-pin-" + String(controlPin) + "/#{unique_id}");
  }

  static String getDeviceChannelUrl(Channel channel){
    String relativePath = channel.restChannelEndPoint;
    String substitute = "/project/auto";
 
    relativePath.replace("/rest",substitute);
    relativePath.replace("State","");
    
    if(!channel.enableRemoteConfiguration){
      return "http://" + channel.IP;
    }else{
      return "http://" + channel.masterIPAddress + relativePath + "#?device=" + channel.IP + "&channel=" + channel.name;
    }
  }

  static String formatTime(int hour, int minute){
    String hours = String(hour/3600);
    int intMinutes = minute/60;
    String strMins = ":" + String(intMinutes);
    
    if(intMinutes < 10){
      if(intMinutes < 1){
        strMins = ":00";
      }
      else{
        strMins = ":0"+String(intMinutes);
      }
    }
    return (hours + strMins);
  }

  static String getActiveWeekDays(int weekDays[7]){
    String days[7] = {"SU", "MO", "TU", "WE", "TH", "FR", "SA"};
    String activeWeekDays = "";
    bool isFirstGoodDay = true;
    for (int day = 0; day < 7; day++){  
      if(weekDays[day] > -1){
        activeWeekDays = activeWeekDays + (isFirstGoodDay ? "" : ", ") + days[day];
        isFirstGoodDay = false;
      }
    }
     activeWeekDays = activeWeekDays;
     return activeWeekDays;
  }
  
 static String makeConfigPayload(boolean payloadStatus, Channel channel, uint8_t controlPin){
    String status = payloadStatus ? "ON" : "OFF";
    String iotAdminUrl = getDeviceChannelUrl(channel);
    String payload = "{\"state\":\"" + status  + "\"";
    payload = payload +  ",\"Version\":\"" + channel.buildVersion   + "\"";
    payload = payload +  ",\"Device_Admin_Url\":\"" + iotAdminUrl + "\"";
    payload = payload + ",\"Control_Pin\":" + controlPin;
    payload = payload + ",\"Channel_Name\":\"" + channel.name  + "\"";
    payload = payload + ",\"MAC_Address\":\"" + SettingValue::format("#{unique_id}")  + "\"";
    payload = payload + ",\"Device_IP\":\"" + channel.IP  + "\"";

    if(channel.enabled){
       payload = payload + ",\"Active_Days\":\"" + getActiveWeekDays(channel.schedule.weekDays)  + "\"";
      if(channel.enableDateRange){
        time_t currentTime = time(nullptr);
        DateRange dateRange = getActiveDateRange(channel.activeStartDateRange, channel.activeEndDateRange, currentTime);
        String startDate = eraseLineFeed(ctime(&dateRange.startDate));
        startDate.remove(10,9);
        String endDate = eraseLineFeed(ctime(&dateRange.endDate));
        endDate.remove(10,9);
        if(dateRange.valid){
          payload = payload + ",\"Start_Date\":\"" + startDate + "\"";
          payload = payload + ",\"End_Date\":\"" + endDate + "\"";

          if(channel.activeOutsideDateRange){
            payload = payload + ",\"Active_Outside_Date_Range\":\"Enabled\"";
          }
        }
      }
      
      String startTime = formatTime(channel.schedule.startTimeHour, channel.schedule.startTimeMinute);
      String endTime = formatTime(channel.schedule.endTimeHour, channel.schedule.endTimeMinute);
      payload = payload + ",\"Start_Time\":\"" + startTime  + " H\"";
      payload = payload + ",\"End_Time\":\"" + endTime  + " H\"";

      if(channel.schedule.overrideTime > 0){
        payload = payload + ",\"Override_Time\":\"" + formatTimePeriod(channel.schedule.overrideTime) + "\"";
      }

      if(channel.enableTimeSpan){
        return(payload + "}");
      }

      payload = payload + ",\"Run_Every\":\"" + formatTimePeriod(channel.schedule.runEvery) + "\"";
      payload = payload + ",\"Off_After\":\"" + formatTimePeriod(channel.schedule.offAfter) + "\"";
      
      if(!channel.randomize){
        return(payload + "}");
      }

      if(channel.schedule.hotTimeHour > 0){
        payload = payload + ",\"Hot_Time\":\"" + formatTimePeriod(channel.schedule.hotTimeHour) + "\"";
      }

      if(!channel.enableMinimumRunTime){
        return(payload + "}");
      }

      return(payload + ",\"Minimum_Run_Time\":\"Enabled\"}");

     }else{
      return(payload + ",\"Schedule\":\"Disabled\"}");
    }
  }
  
  static String formatTimePeriod(int timePeriod){
    byte hours = timePeriod/3600;
    byte minutes = (timePeriod-hours*3600)/60;
    byte seconds = timePeriod%60;
    String period;
    if(hours > 0){
      period = String(hours) + ((hours > 1) ? " hours" : " hour");
      if(minutes > 0){
      period = period + " " + String(minutes) + ((minutes > 1) ? " minutes" : " minute");
      }
      if(seconds > 0){
        period = period + " " + String(seconds) + ((seconds > 1) ? " seconds" : " second");
      }
    }else if(minutes > 0){
      period = period + String(minutes) + ((minutes > 1) ? " minutes" : " minute");;
      if(seconds > 0){
        period = period + " " + String(seconds) + ((seconds > 1) ? " seconds" : " second");
      }
    }else if(seconds > 0){
      period = String(seconds) +  ((seconds > 1) ? " seconds" : " second");
    }
    return period;
  }
};

extern Utilities utils;  // make an instance for the user

#endif