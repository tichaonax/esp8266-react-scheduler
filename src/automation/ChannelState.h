#ifndef ChannelState_h
#define ChannelState_h

#include <SettingValue.h>
#include "Utilities.h"

#define DEFAULT_LED_STATE false
#define DEFAULT_CONTROL_STATE false
#define OFF_STATE "OFF"
#define ON_STATE "ON"

#define DEFAULT_JSON_DOCUMENT_SIZE 2048

struct CurrentTime {
  int minutesInSec;
  int totalCurrentTimeInSec;
};

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
    root["buildVersion"] = settings.channel.buildVersion;
    root["iotAdminUrl"] = utils.getDeviceChannelUrl(settings.channel);
    root["controlPin"] = settings.channel.controlPin;
    root["channelName"] = settings.channel.name;
    root["MAC"] = SettingValue::format("#{unique_id}");
    root["IP"] = settings.channel.IP;

    if(settings.channel.enableDateRange){
      time_t currentTime = time(nullptr);
      DateRange dateRange = utils.getActiveDateRange(settings.channel.activeStartDateRange,
      settings.channel.activeEndDateRange, currentTime);
      if(dateRange.valid){
        String startDate = utils.eraseLineFeed(ctime(&dateRange.startDate));
        startDate.remove(10,9);
        String endDate = utils.eraseLineFeed(ctime(&dateRange.endDate));
        endDate.remove(10,9);
        root["StartDate"] = startDate;
        root["EndDate"] = endDate;
        
        if(settings.channel.activeOutsideDateRange){
          root["ActiveOutsideDateRange"] = "true";
        }
      }
    }

    if(settings.channel.enabled){
      root["startTime"] = utils.formatTime(settings.channel.schedule.startTimeHour, settings.channel.schedule.startTimeMinute);
      root["endTime"] = utils.formatTime(settings.channel.schedule.endTimeHour, settings.channel.schedule.endTimeMinute);

      if(settings.channel.schedule.overrideTime > 0){
        root["overrideTime"] = utils.formatTimePeriod(settings.channel.schedule.overrideTime);
      }

      if(!settings.channel.enableTimeSpan){
        root["runEvery"] = utils.formatTimePeriod(settings.channel.schedule.runEvery);
        root["offAfter"] = utils.formatTimePeriod(settings.channel.schedule.offAfter);

        if(settings.channel.randomize){
          if(settings.channel.schedule.hotTimeHour > 0){
            root["HotTime"] = utils.formatTimePeriod(settings.channel.schedule.hotTimeHour);
          }

          if(settings.channel.enableMinimumRunTime){
            root["MinimumRunTime"] = "true";
          }
        }
      }
    }else{
      root["scheduleDisabled"] = "true";
    }
  }

  static StateUpdateResult haUpdate(JsonObject& root, ChannelState& settings) {
    String state = root["state"];
    settings.channel.controlOn = strcmp(ON_STATE, state.c_str()) ? false : true;
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
      
    schedule["runEvery"] = floor(float(float(channel.schedule.runEvery)/float(60)) * 1000) * 0.001;
    schedule["offAfter"] = floor(float(float(channel.schedule.offAfter)/float(60)) * 1000) * 0.001;
    schedule["startTimeHour"] = round(float(float(channel.schedule.startTimeHour)/float(3600)) * 1000) / 1000;
    schedule["startTimeMinute"] = round(float(float(channel.schedule.startTimeMinute)/float(60)) * 1000) / 1000;
    schedule["hotTimeHour"] = round(float(float(channel.schedule.hotTimeHour)/float(3600)) * 1000) /1000;
    schedule["overrideTime"] = floor(float(float(channel.schedule.overrideTime)/float(60)) * 1000) * 0.001;
    schedule["endTimeHour"] = round(float(float(channel.schedule.endTimeHour)/float(3600)) * 1000) / 1000;
    schedule["endTimeMinute"] = round(float(float(channel.schedule.endTimeMinute)/float(60)) * 1000) / 1000;
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
    scheduled["isHotScheduleActive:"] =  scheduledTime.isHotScheduleActive;
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

    String activeStartDateRange = activeDateRange[0].as<String>();
    if(activeStartDateRange.length() == 24){
      channel.activeStartDateRange = activeStartDateRange;
    }
    
    String activeEndDateRange = activeDateRange[1].as<String>();
    if(activeEndDateRange.length() == 24){
      channel.activeEndDateRange = activeEndDateRange;
    }
    
    JsonObject schedule = json["schedule"];
    channel.schedule.runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : channel.schedule.runEvery;
    channel.schedule.offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : channel.schedule.offAfter;
    channel.schedule.startTimeHour = schedule["startTimeHour"] ? (int)(round(3600 * float(schedule["startTimeHour"]))) : channel.schedule.startTimeHour;
    channel.schedule.startTimeMinute = schedule["startTimeMinute"] ? (int)(round(60 * float(schedule["startTimeMinute"]))) : channel.schedule.startTimeMinute;
    if (channel.schedule.startTimeMinute >= 3600) { channel.schedule.startTimeMinute  = 0; }
    channel.schedule.endTimeHour = schedule["endTimeHour"] ? (int)(round(3600 * float(schedule["endTimeHour"]))) : channel.schedule.endTimeHour;
    channel.schedule.endTimeMinute = schedule["endTimeMinute"] ? (int)(round(60 * float(schedule["endTimeMinute"]))) : channel.schedule.endTimeMinute;
    if (channel.schedule.endTimeMinute >= 3600) { channel.schedule.endTimeMinute  = 0; }

    channel.schedule.isOverride = schedule["isOverride"];

    channel.schedule.hotTimeHour = schedule["hotTimeHour"] ? (int)(round(3600 * float(schedule["hotTimeHour"]))) : channel.schedule.hotTimeHour;
    channel.schedule.overrideTime = schedule["overrideTime"] ? (int)(round(60 * float(schedule["overrideTime"]))) : channel.schedule.overrideTime;
    
    if ((channel.schedule.hotTimeHour > 57600) | (channel.schedule.hotTimeHour < 0)) { channel.schedule.hotTimeHour  = 0; }
  
    if ((channel.schedule.overrideTime > 57600) | (channel.schedule.overrideTime < 0)) { channel.schedule.overrideTime  = 0; }

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
    // TO DO to be expanded for more validation
    JsonObject schedule = json["schedule"];
    int runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : channelState.channel.schedule.runEvery;
    int offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : channelState.channel.schedule.offAfter;
    return (runEvery > offAfter);
  }
};

#endif