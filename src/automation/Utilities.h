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
    bool    isOverrideActive;
    int  overrideTime;     // time to override schedule
};
struct Channel {
    bool  controlOn;
    uint8_t controlPin;
    uint8_t homeAssistantTopicType;
    String homeAssistantIcon;
    int  startTime;
    int  endTime;
    bool    enabled;
    String  name;            // control name e.g, Pump
    Schedule schedule;
    bool    enableTimeSpan;  // when enable control is on between startTime and endTime
    String  channelEndPoint; //
    String  lastStartedChangeTime;  //last time the switch was toggled
    String  nextRunTime;
    bool    randomize;      // when enabled randomize the on/off
    String localDateTime;
    String IP;
    bool isHotScheduleActive;
    String offHotHourDateTime;
    String controlOffDateTime;
    String uniqueId;
    bool enableMinimumRunTime; // when enabled in randomize time runs at least this minimum time
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

  String strDeltaLocalTime(short delta){
    time_t now = time(0) + delta;
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
    String relativePath;
    switch (channel.controlPin)
    {
      case CHANNEL_ONE_CONTROL_PIN:
        relativePath = "/project/auto/channelOne";
      break;

      case CHANNEL_TWO_CONTROL_PIN:
        relativePath = "/project/auto/channelTwo";
      break;

      case CHANNEL_THREE_CONTROL_PIN:
        relativePath = "/project/auto/channelThree";
      break;

      case CHANNEL_FOUR_CONTROL_PIN:
        relativePath = "/project/auto/channelFour";
      break;

      default:
        relativePath = "";
      break;
    }

    return "http://" + channel.IP + relativePath;
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

  static String makeConfigPayload(boolean payloadStatus, Channel channel){
    String status = payloadStatus ? "ON" : "OFF";
    
    String iotAdminUrl = getDeviceChannelUrl(channel);
    
    String payload = "{\"state\":\"" + status +"\",\"iotAdminUrl\":\"" + iotAdminUrl + "\"";

    if(!channel.enabled){
      return(payload + ",\"scheduleDisabled\":\"true\"}");
    }

    String startTime = formatTime(channel.schedule.startTimeHour, channel.schedule.startTimeMinute);
    String endTime = formatTime(channel.schedule.endTimeHour, channel.schedule.endTimeMinute);
    
    payload = payload + ",\"startTime\":\"" + startTime + "\",\"endTime\":\"" + endTime  + "\"";

    if(channel.schedule.overrideTime > 0){
      payload = payload + ",\"overrideTime\":\"" + formatTimePeriod(channel.schedule.overrideTime) + "\"";
    }

    if(channel.enableTimeSpan){
      return(payload + "}");
    }

    payload = payload + ",\"runEvery\":\"" + formatTimePeriod(channel.schedule.runEvery) + "\",\"offAfter\":\"" + formatTimePeriod(channel.schedule.offAfter) + "\"";

    if(!channel.randomize){
      return(payload + "}");
    }

    if(channel.schedule.hotTimeHour > 0){
      payload = payload + ",\"hotTimeHour\":\"" + formatTimePeriod(channel.schedule.hotTimeHour) + "\"";
    }

    if(!channel.enableMinimumRunTime){
      return(payload + "}");
    }
    return(payload + ",\"enableMinimumRunTime\":\"true\"}");
  }

  static String formatTimePeriod(int timePeriod){
    byte hours = timePeriod/3600;
    byte minutes = (timePeriod-hours*3600)/60;
    byte seconds = timePeriod%60;
    String period;
    if(hours > 0){
      period = String(hours) + "h";
      if(minutes > 0){
      period = period + "-" + String(minutes) +"m";
      }
      if(seconds > 0){
        period = period + "-" + String(seconds) + "s";
      }
    }else if(minutes > 0){
      period = period + String(minutes) +"m";
      if(seconds > 0){
        period = period + "-" + String(seconds) + "s";
      }
    }else if(seconds > 0){
      period = String(seconds) + "s";
    }
    return period;
  }

};

extern Utilities utils;  // make an instance for the user

#endif