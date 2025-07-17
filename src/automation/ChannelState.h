#ifndef ChannelState_h
#define ChannelState_h

#include <SettingValue.h>
#include "Utilities.h"
#define DEFAULT_LED_STATE false
#define DEFAULT_CONTROL_STATE false

#define DEFAULT_JSON_DOCUMENT_SIZE 2048

// Constants for validation and bounds checking
#define MAX_HOT_TIME_SECONDS 57600  // 16 hours
#define MIN_RUN_EVERY_SECONDS 60    // 1 minute
#define MAX_RUN_EVERY_SECONDS 86400 // 24 hours
#define MIN_OFF_AFTER_SECONDS 30    // 30 seconds minimum

struct CurrentTime {
  int minutesInSec;
  int totalCurrentTimeInSec;
};

// Helper functions for time conversions
namespace ChannelStateHelpers {
  inline float convertSecondsToMinutes(int seconds) { 
    return seconds / 60.0f; 
  }
  
  inline float convertSecondsToHours(int seconds) { 
    return seconds / 3600.0f; 
  }
  
  inline int convertMinutesToSeconds(float minutes) { 
    return (int)round(minutes * 60); 
  }
  
  inline int convertHoursToSeconds(float hours) { 
    return (int)round(hours * 3600); 
  }
  
  // Helper function to parse weekDays string
  inline void parseWeekDays(const String& weekDaysStr, int weekDays[7]) {
    for (int i = 0; i < 7; i++) weekDays[i] = -1;
    
    String str = weekDaysStr;
    while (str.length() > 0) {
      int index = str.indexOf(',');
      int day = (index == -1) ? str.toInt() : str.substring(0, index).toInt();
      if (day >= 0 && day < 7) weekDays[day] = day;
      str = (index == -1) ? "" : str.substring(index + 1);
    }
  }
}


class ChannelState {
public:
Channel channel;
  static void read(ChannelState& settings, JsonObject& root) {
    readChannel(settings.channel, root);
  }

  static StateUpdateResult update(JsonObject& root, ChannelState& settings) {
    if (dataIsValid(root, settings)) {
      updateChannel(root, settings.channel);
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }
  
  static StateUpdateResult wsUpdate(JsonObject& root, ChannelState& settings) {
    boolean newState = root["controlOn"] | DEFAULT_CONTROL_STATE;
    if (settings.channel.controlOn != newState) {
      settings.channel.controlOn = newState;
      settings.channel.schedule.isOverride = true;
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }

static void haRead(ChannelState& settings, JsonObject& root) {
    root["state"] = settings.channel.controlOn ? ON_STATE : OFF_STATE;
    root["Version"] = settings.channel.buildVersion;
    root["Device_Admin"] = utils.getDeviceChannelUrl(settings.channel);
    root["Control_Pin"] = settings.channel.controlPin;
    //root["Channel_Name"] = settings.channel.name;
    root["MAC"] = SettingValue::format("#{unique_id}");
    root["IP"] = settings.channel.IP;
    root["Reboot_Sundays"] = settings.channel.autoRebootSystem ? "Enabled" : "Disabled";

    if(settings.channel.enabled){
      root["Active_Days"] = utils.getActiveWeekDays(settings.channel.schedule.weekDays);
      if(settings.channel.enableDateRange){
        time_t currentTime = time(nullptr);
        DateRange dateRange = utils.getActiveDateRange(settings.channel.activeStartDateRange,
        settings.channel.activeEndDateRange, currentTime);
        if(dateRange.valid){
          String startDate = utils.eraseLineFeed(ctime(&dateRange.startDate));
          startDate.remove(10,9);
          String endDate = utils.eraseLineFeed(ctime(&dateRange.endDate));
          endDate.remove(10,9);
          root["Start_Date"] = startDate;
          root["End_Date"] = endDate;
          
          if(settings.channel.activeOutsideDateRange){
            root["Active_Outside_Date_Range"] = "Enabled";
          }
        }
      }
      root["Start_Time"] = utils.formatTime(settings.channel.schedule.startTimeHour, settings.channel.schedule.startTimeMinute) + " H";
      root["End_Time"] = utils.formatTime(settings.channel.schedule.endTimeHour, settings.channel.schedule.endTimeMinute) + " H";

      if(settings.channel.schedule.overrideTime > 0){
        root["Override_Time"] = utils.formatTimePeriod(settings.channel.schedule.overrideTime);
      }

      if(!settings.channel.enableTimeSpan){
        root["Run_Every"] = utils.formatTimePeriod(settings.channel.schedule.runEvery);
        root["Off_After"] = utils.formatTimePeriod(settings.channel.schedule.offAfter);

        if(settings.channel.randomize){
          if(settings.channel.schedule.hotTimeHour > 0){
            root["Hot_Time"] = utils.formatTimePeriod(settings.channel.schedule.hotTimeHour);
          }

          if(settings.channel.enableMinimumRunTime){
            root["Minimum_Run_Time"] = "Enabled";
          }
        }
      }
    }else{
      root["Schedule"] = "Disabled";
    }
  }

  static StateUpdateResult haUpdate(JsonObject& root, ChannelState& settings) {
    String state = root["state"];
    settings.channel.controlOn = strcmp(OFF_STATE, state.c_str()) ? false : true;
    settings.channel.schedule.isOverride = true;
    boolean newState = false;
    if (state.equals(ON_STATE)) {
      newState = true;
    } else if (!state.equals(OFF_STATE)) {
      return StateUpdateResult::ERROR;
    }
    // change the new state, if required
    if (settings.channel.controlOn  != newState) {
      settings.channel.controlOn  = newState;
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }

  private:
  static void readChannel(Channel& channel, JsonObject jsonObject) {
     time_t tnow = time(nullptr);
    jsonObject["localDateTime"] = utils.eraseLineFeed(ctime(&tnow));
    jsonObject["controlPin"] = channel.controlPin;
    jsonObject["homeAssistantTopicType"] = channel.homeAssistantTopicType;
    jsonObject["homeAssistantIcon"] = channel.homeAssistantIcon;
    jsonObject["controlOn"] = channel.controlOn;
    jsonObject["name"] = channel.name;
    jsonObject["enabled"] = channel.enabled;
    jsonObject["enableTimeSpan"] = channel.enableTimeSpan;
    jsonObject["lastStartedChangeTime"] = channel.lastStartedChangeTime;
    jsonObject["nextRunTime"] = channel.nextRunTime;
    jsonObject["randomize"] = channel.randomize;
    jsonObject["IPAddress"] = channel.IP;
    jsonObject["uniqueId"] = utils.getMqttUniqueIdOrPath(channel.controlPin, channel.homeAssistantTopicType, true);
    jsonObject["enableMinimumRunTime"] = channel.enableMinimumRunTime;
    jsonObject["enableRemoteConfiguration"] = channel.enableRemoteConfiguration;
    jsonObject["masterIPAddress"] = channel.masterIPAddress;
    jsonObject["restChannelEndPoint"] = channel.restChannelEndPoint;
    jsonObject["restChannelRestartEndPoint"] = channel.restChannelRestartEndPoint;
    jsonObject["enableDateRange"] = channel.enableDateRange;
    jsonObject["activeOutsideDateRange"] = channel.activeOutsideDateRange;
    jsonObject["buildVersion"] = channel.buildVersion;


    JsonArray activeDateRange = jsonObject.createNestedArray("activeDateRange");
    activeDateRange.add(channel.activeStartDateRange);
    activeDateRange.add(channel.activeEndDateRange);

    JsonObject schedule = jsonObject.createNestedObject("schedule");
      
    schedule["runEvery"] = ChannelStateHelpers::convertSecondsToMinutes(channel.schedule.runEvery);
    schedule["offAfter"] = ChannelStateHelpers::convertSecondsToMinutes(channel.schedule.offAfter);
    schedule["startTimeHour"] = ChannelStateHelpers::convertSecondsToHours(channel.schedule.startTimeHour);
    schedule["startTimeMinute"] = ChannelStateHelpers::convertSecondsToMinutes(channel.schedule.startTimeMinute);
    schedule["hotTimeHour"] = ChannelStateHelpers::convertSecondsToHours(channel.schedule.hotTimeHour);
    schedule["overrideTime"] = ChannelStateHelpers::convertSecondsToMinutes(channel.schedule.overrideTime);
    schedule["endTimeHour"] = ChannelStateHelpers::convertSecondsToHours(channel.schedule.endTimeHour);
    schedule["endTimeMinute"] = ChannelStateHelpers::convertSecondsToMinutes(channel.schedule.endTimeMinute);
    schedule["isOverride"] = channel.schedule.isOverride;

    JsonArray weekDays = schedule.createNestedArray("weekDays");
    for (int day = 0; day < 7; day++){  
      int value = channel.schedule.weekDays[day]; 
      if(value > -1){weekDays.add(value);}
    }
    
    JsonObject scheduled = jsonObject.createNestedObject("scheduledTime");
    ScheduledTime scheduledTime = utils.getScheduleTimes(
      (channel.schedule.startTimeHour + channel.schedule.startTimeMinute),
      (channel.schedule.endTimeHour + channel.schedule.endTimeMinute),
      channel.schedule.hotTimeHour,
      channel.enableTimeSpan,
      channel.isHotScheduleActive,
      channel.name,
      channel.randomize,
      channel.schedule.isOverrideActive,
      channel.enableMinimumRunTime);

    scheduled["channelName"] = scheduledTime.channelName;
    scheduled["scheduleTime"] = (int)scheduledTime.scheduleTime;
    scheduled["isHotSchedule"] = scheduledTime.isHotSchedule;
    scheduled["isSpanSchedule"] = scheduledTime.isSpanSchedule;
    scheduled["isHotScheduleActive"] = scheduledTime.isHotScheduleActive;
    scheduled["isRunTaskNow"] = scheduledTime.isRunTaskNow;
    scheduled["currentTime"] = utils.eraseLineFeed(ctime(&scheduledTime.currentTime));
    scheduled["startTimeSeconds"] = (int)scheduledTime.startTime;
    scheduled["endTimeSeconds"] = (int)scheduledTime.endTime;
    scheduled["startDateTime"] = utils.eraseLineFeed(ctime(&scheduledTime.scheduleStartDateTime));
    
    if(scheduledTime.isHotSchedule){
      scheduled["hotTimeEndDateTime"] = utils.eraseLineFeed(ctime(&scheduledTime.scheduleHotTimeEndDateTime));
      scheduled["offHotHourDateTime"] = channel.offHotHourDateTime; 
    }
    scheduled["controlOffDateTime"] = channel.controlOffDateTime;
    scheduled["endDateTime"] = utils.eraseLineFeed(ctime(&scheduledTime.scheduleEndDateTime));
    scheduled["isOverrideActive"] = scheduledTime.isOverrideActive;  
  }

static void updateChannel(JsonObject& json, Channel& channel) { 
    channel.controlPin = json["controlPin"] | channel.controlPin; 
    channel.homeAssistantTopicType = json["homeAssistantTopicType"] | channel.homeAssistantTopicType ;
    channel.homeAssistantIcon = json["homeAssistantIcon"] | channel.homeAssistantIcon;
    channel.controlOn = json["controlOn"] | DEFAULT_CONTROL_STATE;
    channel.name = json["name"] | channel.name;
    channel.enabled = json["enabled"] | channel.enabled;
    channel.enableTimeSpan = json["enableTimeSpan"] | channel.enableTimeSpan;
    channel.lastStartedChangeTime = json["lastStartedChangeTime"] | utils.strLocalTime();
    channel.nextRunTime = json["nextRunTime"] | "";
    channel.randomize = json["randomize"] | channel.randomize;
    channel.uniqueId = json["uniqueId"] |  utils.getMqttUniqueIdOrPath(channel.controlPin, channel.homeAssistantTopicType, true);
    channel.enableMinimumRunTime = json["enableMinimumRunTime"] | channel.enableMinimumRunTime;
    channel.enableRemoteConfiguration = json["enableRemoteConfiguration"] | channel.enableRemoteConfiguration;
    channel.masterIPAddress = json["masterIPAddress"] | channel.masterIPAddress;
    channel.enableDateRange = json["enableDateRange"] | channel.enableDateRange;
    channel.activeOutsideDateRange = json["activeOutsideDateRange"] | channel.activeOutsideDateRange;
    

    JsonArray activeDateRange = json["activeDateRange"];

    DateRange dateRange = utils.getActiveDateRange(activeDateRange[0].as<String>(), activeDateRange[1].as<String>(),time(nullptr));
    
    if(dateRange.valid){
      channel.activeStartDateRange = utils.formatDateToUTC(dateRange.startDate);
      channel.activeEndDateRange = utils.formatDateToUTC(dateRange.endDate);
    }
   
    JsonObject schedule = json["schedule"];
    channel.schedule.runEvery = schedule["runEvery"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["runEvery"]) : channel.schedule.runEvery;
    channel.schedule.offAfter = schedule["offAfter"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["offAfter"]) : channel.schedule.offAfter;
    channel.schedule.startTimeHour = schedule["startTimeHour"] ? ChannelStateHelpers::convertHoursToSeconds(schedule["startTimeHour"]) : channel.schedule.startTimeHour;
    channel.schedule.startTimeMinute = schedule["startTimeMinute"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["startTimeMinute"]) : channel.schedule.startTimeMinute;
    if (channel.schedule.startTimeMinute >= 3600) { channel.schedule.startTimeMinute  = 0; }
    channel.schedule.endTimeHour = schedule["endTimeHour"] ? ChannelStateHelpers::convertHoursToSeconds(schedule["endTimeHour"]) : channel.schedule.endTimeHour;
    channel.schedule.endTimeMinute = schedule["endTimeMinute"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["endTimeMinute"]) : channel.schedule.endTimeMinute;
    if (channel.schedule.endTimeMinute >= 3600) { channel.schedule.endTimeMinute  = 0; }

    channel.schedule.isOverride = schedule["isOverride"];

    channel.schedule.hotTimeHour = schedule["hotTimeHour"] ? ChannelStateHelpers::convertHoursToSeconds(schedule["hotTimeHour"]) : channel.schedule.hotTimeHour;
    channel.schedule.overrideTime = schedule["overrideTime"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["overrideTime"]) : channel.schedule.overrideTime;
    
    if ((channel.schedule.hotTimeHour > MAX_HOT_TIME_SECONDS) || (channel.schedule.hotTimeHour < 0)) { 
      channel.schedule.hotTimeHour = 0; 
    }
  
    if ((channel.schedule.overrideTime > MAX_HOT_TIME_SECONDS) || (channel.schedule.overrideTime < 0)) { 
      channel.schedule.overrideTime = 0; 
    }

    if (schedule["weekDays"]){
      for (int i = 0; i< 7; i++){
       channel.schedule.weekDays[i] = -1;
      }
      JsonArray weekDays = schedule["weekDays"];
      for(JsonVariant v : weekDays) {
        int day = v.as<int>();
        channel.schedule.weekDays[day] = day;
      }
    }
  }

  static boolean dataIsValid(JsonObject& json, ChannelState& channelState){
    JsonObject schedule = json["schedule"];
    
    // Get values with proper conversions
    int runEvery = schedule["runEvery"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["runEvery"]) : channelState.channel.schedule.runEvery;
    int offAfter = schedule["offAfter"] ? ChannelStateHelpers::convertMinutesToSeconds(schedule["offAfter"]) : channelState.channel.schedule.offAfter;
    
    // Validate basic scheduling logic
    if (runEvery <= offAfter) return false;
    
    // Validate time ranges
    if (runEvery < MIN_RUN_EVERY_SECONDS || runEvery > MAX_RUN_EVERY_SECONDS) return false;
    if (offAfter < MIN_OFF_AFTER_SECONDS || offAfter > runEvery) return false;
    
    // Validate hot time if present
    if (schedule["hotTimeHour"]) {
      int hotTime = ChannelStateHelpers::convertHoursToSeconds(schedule["hotTimeHour"]);
      if (hotTime < 0 || hotTime > MAX_HOT_TIME_SECONDS) return false;
    }
    
    // Validate override time if present
    if (schedule["overrideTime"]) {
      int overrideTime = ChannelStateHelpers::convertMinutesToSeconds(schedule["overrideTime"]);
      if (overrideTime < 0 || overrideTime > MAX_HOT_TIME_SECONDS) return false;
    }
    
    return true;
  }
};

#endif