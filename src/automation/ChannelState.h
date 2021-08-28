#ifndef ChannelState_h
#define ChannelState_h

#include <SettingValue.h>
#include "Utilities.h"

#define DEFAULT_LED_STATE false
#define DEFAULT_CONTROL_STATE false
#define OFF_STATE "OFF"
#define ON_STATE "ON"

#define DEFAULT_JSON_DOCUMENT_SIZE 1024 

struct CurrentTime {
  int minutesInSec;
  int totalCurrentTimeInSec;
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
    bool    controlOn;
    uint8_t     controlPin;
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

class ChannelState {
public:
  static String getMqttUniqueIdOrPath(uint8_t controlPin, bool isUniqueIdOrPath, String homeAssistantEntity=""){
      String topicType;
      String topicHeader;
      switch (controlPin)
      {
        case CHANNEL_ONE_CONTROL_PIN:
        case CHANNEL_TWO_CONTROL_PIN:
          topicHeader = "homeassistant/switch/";
          topicType = "switch";
        break;
        default:
          topicHeader = "homeassistant/light/";
          topicType = "light";
        break;
      }
      return isUniqueIdOrPath ? 
      SettingValue::format(topicType + "-pin-" + String(controlPin) + "-#{unique_id}") :
      SettingValue::format(topicHeader + homeAssistantEntity + "-pin-" + String(controlPin) + "/#{unique_id}");
  }

 Channel channel;
  static void read(ChannelState& settings, JsonObject& root) {
    readChannel(settings.channel, root);
  }

 static StateUpdateResult update(JsonObject& root, ChannelState& settings) {
    if (dataIsValid(root, settings)) {
      updateChannel(root, settings.channel, false);
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }
  

   static StateUpdateResult wsUpdate(JsonObject& root, ChannelState& settings) {
    if (dataIsValid(root, settings)) {
      updateChannel(root, settings.channel, true);
      return StateUpdateResult::CHANGED;
    }
    return StateUpdateResult::UNCHANGED;
  }

  static void haRead(ChannelState& settings, JsonObject& root) {
    root["state"] = settings.channel.controlOn ? ON_STATE : OFF_STATE;
    root["espAdminUrl"] = "http://" + settings.channel.IP;
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
    jsonObject["controlOn"] = channel.controlOn;
    jsonObject["name"] = channel.name;
    jsonObject["enabled"] = channel.enabled;
    jsonObject["enableTimeSpan"] = channel.enableTimeSpan;
    jsonObject["lastStartedChangeTime"] = channel.lastStartedChangeTime;
    jsonObject["nextRunTime"] = channel.nextRunTime;
    jsonObject["randomize"] = channel.randomize;
    jsonObject["IPAddress"] = channel.IP;
    jsonObject["uniqueId"] = getMqttUniqueIdOrPath(channel.controlPin, true);
    jsonObject["enableMinimumRunTime"] = channel.enableMinimumRunTime;

    JsonObject schedule = jsonObject.createNestedObject("schedule");
    
    schedule["runEvery"] = round(float(float(channel.schedule.runEvery)/float(60)) * 1000)/ 1000;
    schedule["offAfter"] = round(float(float(channel.schedule.offAfter)/float(60)) * 1000)/ 1000;
    schedule["startTimeHour"] = round(float(float(channel.schedule.startTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["startTimeMinute"] = round(float(float(channel.schedule.startTimeMinute)/float(60)) * 1000)/ 1000;
    schedule["hotTimeHour"] = round(float(float(channel.schedule.hotTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["overrideTime"] = round(float(float(channel.schedule.overrideTime)/float(60)) * 1000)/ 1000;
    schedule["endTimeHour"] = round(float(float(channel.schedule.endTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["endTimeMinute"] = round(float(float(channel.schedule.endTimeMinute)/float(60)) * 1000)/ 1000;
    schedule["isOverride"] = channel.schedule.isOverride;
  

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

static void updateChannel(JsonObject& json, Channel& channel, bool isOverride) { 
    channel.controlPin = json["controlPin"];
    channel.controlOn = json["controlOn"] | DEFAULT_CONTROL_STATE;
    channel.name = json["name"] | channel.name;
    channel.enabled = json["enabled"] | channel.enabled;
    channel.enableTimeSpan = json["enableTimeSpan"] | channel.enableTimeSpan;
    channel.lastStartedChangeTime = json["lastStartedChangeTime"] | utils.strLocalTime();
    channel.nextRunTime = json["nextRunTime"] | "";
    channel.randomize = json["randomize"] | channel.randomize;
    channel.uniqueId = json["uniqueId"] |  getMqttUniqueIdOrPath(channel.controlPin, true);
    channel.enableMinimumRunTime = json["enableMinimumRunTime"] | channel.enableMinimumRunTime;

    JsonObject schedule = json["schedule"];

    channel.schedule.runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : channel.schedule.runEvery;
    channel.schedule.offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : channel.schedule.offAfter;
    channel.schedule.startTimeHour = schedule["startTimeHour"] ? (int)(round(3600 * float(schedule["startTimeHour"]))) : channel.schedule.startTimeHour;
    channel.schedule.startTimeMinute = schedule["startTimeMinute"] ? (int)(round(60 * float(schedule["startTimeMinute"]))) : channel.schedule.startTimeMinute;
    if (channel.schedule.startTimeMinute >= 3600) { channel.schedule.startTimeMinute  = 0; }
    channel.schedule.endTimeHour = schedule["endTimeHour"] ? (int)(round(3600 * float(schedule["endTimeHour"]))) : channel.schedule.endTimeHour;
    channel.schedule.endTimeMinute = schedule["endTimeMinute"] ? (int)(round(60 * float(schedule["endTimeMinute"]))) : channel.schedule.endTimeMinute;
    if (channel.schedule.endTimeMinute >= 3600) { channel.schedule.endTimeMinute  = 0; }

    channel.schedule.isOverride = isOverride ? true : schedule["isOverride"];

    channel.schedule.hotTimeHour = schedule["hotTimeHour"] ? (int)(round(3600 * float(schedule["hotTimeHour"]))) : channel.schedule.hotTimeHour;
    channel.schedule.overrideTime = schedule["overrideTime"] ? (int)(round(60 * float(schedule["overrideTime"]))) : channel.schedule.overrideTime;
    
    if ((channel.schedule.hotTimeHour > 57600) | (channel.schedule.hotTimeHour < 0)) { channel.schedule.hotTimeHour  = 0; }
  
    if ((channel.schedule.overrideTime > 57600) | (channel.schedule.overrideTime < 0)) { channel.schedule.overrideTime  = 0; }

  }

  static boolean dataIsValid(JsonObject& json, ChannelState& channelState){
    // TO DO to be expanded for more validation
    JsonObject schedule = json["schedule"];
    int runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : channelState.channel.schedule.runEvery;
    int offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : channelState.channel.schedule.offAfter;
    if(runEvery > offAfter){ return true; }
    return false;
  }
};

#endif