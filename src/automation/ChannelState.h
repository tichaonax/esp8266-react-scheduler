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
  time_t minutesInSec;
  time_t totalCurrentTimeInSec;
};

struct Schedule {
    time_t  runEvery;         // run every 30 mins
    time_t  offAfter;         // stop after 5 mins
    time_t  startTimeHour;    // 8
    time_t  startTimeMinute;  // 30
    time_t  endTimeHour;      // 16
    time_t  endTimeMinute;    // 30
    bool    isOverride;       // when true ignore schedule run
    time_t  hotTimeHour;      // default 0 hours [0-16]
};


struct Channel {
    bool    controlOn;
    int     controlPin;
    time_t  startTime;
    time_t  endTime;
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
  
  static void haRead(ChannelState& settings, JsonObject& root) {
    root["state"] = settings.channel.controlOn ? ON_STATE : OFF_STATE;
  }

  static StateUpdateResult haUpdate(JsonObject& root, ChannelState& settings) {
    String state = root["state"];
    settings.channel.controlOn = strcmp(ON_STATE, state.c_str()) ? false : true;
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
    jsonObject["localDateTime"] = Utils.eraseLineFeed(ctime(&tnow));
    jsonObject["controlPin"] = channel.controlPin;
    jsonObject["controlOn"] = channel.controlOn;
    jsonObject["name"] = channel.name;
    jsonObject["enabled"] = channel.enabled;
    jsonObject["enableTimeSpan"] = channel.enableTimeSpan;
    jsonObject["lastStartedChangeTime"] = channel.lastStartedChangeTime;
    jsonObject["nextRunTime"] = channel.nextRunTime;
    jsonObject["randomize"] = channel.randomize;
    jsonObject["IPAddress"] = channel.IP;
    jsonObject["uniqueId"] = SettingValue::format("#{unique_id}");

    JsonObject schedule = jsonObject.createNestedObject("schedule");
    
    schedule["runEvery"] = round(float(float(channel.schedule.runEvery)/float(60)) * 1000)/ 1000;
    schedule["offAfter"] = round(float(float(channel.schedule.offAfter)/float(60)) * 1000)/ 1000;
    schedule["startTimeHour"] = round(float(float(channel.schedule.startTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["startTimeMinute"] = round(float(float(channel.schedule.startTimeMinute)/float(60)) * 1000)/ 1000;
    schedule["hotTimeHour"] = round(float(float(channel.schedule.hotTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["endTimeHour"] = round(float(float(channel.schedule.endTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["endTimeMinute"] = round(float(float(channel.schedule.endTimeMinute)/float(60)) * 1000)/ 1000;

    JsonObject scheduled = jsonObject.createNestedObject("scheduledTime");

    ScheduledTime scheduledTime = Utils.getScheduleTimes(
      (channel.schedule.startTimeHour + channel.schedule.startTimeMinute),
      (channel.schedule.endTimeHour + channel.schedule.endTimeMinute),
      channel.schedule.hotTimeHour,
      channel.enableTimeSpan,
      channel.isHotScheduleActive,
      channel.name,
      channel.randomize);

    scheduled["channelName"] = scheduledTime.channelName;
    scheduled["scheduleTime"] = scheduledTime.scheduleTime;
    scheduled["isHotSchedule"] = scheduledTime.isHotSchedule;
    scheduled["isSpanSchedule"] = scheduledTime.isSpanSchedule;
    scheduled["isHotScheduleActive:"] =  scheduledTime.isHotScheduleActive;
    scheduled["isRunTaskNow"] = scheduledTime.isRunTaskNow;
    scheduled["currentTime"] = Utils.eraseLineFeed(ctime(&scheduledTime.currentTime));
    scheduled["startTimeSeconds"] = scheduledTime.startTime;
    scheduled["endTimeSeconds"] = scheduledTime.endTime;
    scheduled["startDateTime"] = Utils.eraseLineFeed(ctime(&scheduledTime.scheduleStartDateTime));
    
    if(scheduledTime.isHotSchedule){
      scheduled["hotTimeEndDateTime"] = Utils.eraseLineFeed(ctime(&scheduledTime.scheduleHotTimeEndDateTime));
      scheduled["offHotHourDateTime"] = channel.offHotHourDateTime; 
    }
    scheduled["controlOffDateTime"] = channel.controlOffDateTime;
    scheduled["endDateTime"] = Utils.eraseLineFeed(ctime(&scheduledTime.scheduleEndDateTime));  
  }

static void updateChannel(JsonObject& json, Channel& channel) {
    channel.controlPin = json["controlPin"];
    channel.controlOn = json["controlOn"] | DEFAULT_CONTROL_STATE;
    channel.name = json["name"] | channel.name;
    channel.enabled = json["enabled"] | channel.enabled;
    channel.enableTimeSpan = json["enableTimeSpan"] | channel.enableTimeSpan;
    channel.lastStartedChangeTime = json["lastStartedChangeTime"] | Utils.strLocalTime();
    channel.nextRunTime = json["nextRunTime"] | "";
    channel.randomize = json["randomize"] | channel.randomize;

    JsonObject schedule = json["schedule"];

    channel.schedule.runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : channel.schedule.runEvery;
    channel.schedule.offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : channel.schedule.offAfter;
    channel.schedule.startTimeHour = schedule["startTimeHour"] ? (int)(round(3600 * float(schedule["startTimeHour"]))) : (int)(3600 * channel.schedule.startTimeHour);
    channel.schedule.startTimeMinute = schedule["startTimeMinute"] ? (int)(round(60 * float(schedule["startTimeMinute"]))) : (int)(60 * channel.schedule.startTimeMinute);
    if (channel.schedule.startTimeMinute >= 3600) { channel.schedule.startTimeMinute  = 0; }
    channel.schedule.endTimeHour = schedule["endTimeHour"] ? (int)(round(3600 * float(schedule["endTimeHour"]))) : (int)(3600 * channel.schedule.endTimeHour);
    channel.schedule.endTimeMinute = schedule["endTimeMinute"] ? (int)(round(60 * float(schedule["endTimeMinute"]))) : (int)(60 * channel.schedule.endTimeMinute);
    if (channel.schedule.endTimeMinute >= 3600) { channel.schedule.endTimeMinute  = 0; }
    channel.schedule.hotTimeHour = schedule["hotTimeHour"] ? (int)(round(3600 * float(schedule["hotTimeHour"]))) : (int)(3600 * channel.schedule.hotTimeHour);
    if ((channel.schedule.hotTimeHour > 57600) | (channel.schedule.hotTimeHour < 0)) { channel.schedule.hotTimeHour  = 0; }
  }

  static boolean dataIsValid(JsonObject& json, ChannelState& channelState){
    // TO DO to be expanded for more validation
    JsonObject schedule = json["schedule"];
    time_t runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : (int)(60 * channelState.channel.schedule.runEvery);
    time_t offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : (int)(60 * channelState.channel.schedule.offAfter);
    if(runEvery > offAfter){ return true; }
    return false;
  }
};

#endif