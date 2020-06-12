#ifndef ChannelState_h
#define ChannelState_h

#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketTxRx.h>
#include <FSPersistence.h> 
#include "Utilities.h"


#define DEFAULT_LED_STATE false
#define DEFAULT_CONTROL_STATE false
#define DEFAULT_ENABLED_STATE false
#define DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false;
#define OFF_STATE "OFF"
#define ON_STATE "ON"

#define DEFAULT_JSON_DOCUMENT_SIZE 1024 

#define DEFAULT_CHANNEL_NAME "Default Channel Name"
#define DEFAULT_CONTROL_RUN_EVERY 30
#define DEFAULT_CONTROL_OFF_AFTER 5
#define DEFAULT_CONTROL_START_TIME_HOUR 8
#define DEFAULT_CONTROL_START_TIME_MINUTE 0
#define DEFAULT_CONTROL_END_TIME_HOUR 16
#define DEFAULT_CONTROL_END_TIME_MINUTE 0

struct ScheduledTime {
  time_t scheduleTime;
  time_t currentTime;
}; 

struct CurrentTime {
  time_t hours;
  time_t minutes;
  time_t seconds;
  time_t totalCurrentTime;
};

struct Schedule {
    time_t  runEvery;         // run every 30 mins
    time_t  offAfter;         // stop after 5 mins
    time_t  startTimeHour;    // 8
    time_t  startTimeMinute;  // 30
    time_t  endTimeHour;      // 16
    time_t  endTimeMinute;    // 30
    bool    isOverride;         // when true ignore schedule run
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
};

class ChannelState {
public:
 Channel channel;
  static void read(ChannelState& settings, JsonObject& root) {
    readChannel(settings.channel, root);
  }

 static StateUpdateResult update(JsonObject& root, ChannelState& settings) {
    if (dataIsValid(root)) {
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
    // parse new led state 
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
  static void readChannel(Channel& settings, JsonObject channel) {
    channel["controlPin"] = settings.controlPin;
    channel["controlOn"] = settings.controlOn;
    channel["name"] = settings.name;
    channel["enabled"] = settings.enabled;
    channel["enableTimeSpan"] = settings.enableTimeSpan;
    channel["lastStartedChangeTime"] = settings.lastStartedChangeTime;

    JsonObject schedule = channel.createNestedObject("schedule");
    
    schedule["runEvery"] = round(float(float(settings.schedule.runEvery)/float(60)) * 1000)/ 1000;
    schedule["offAfter"] = round(float(float(settings.schedule.offAfter)/float(60)) * 1000)/ 1000;
    schedule["startTimeHour"] = round(float(float(settings.schedule.startTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["startTimeMinute"] = round(float(float(settings.schedule.startTimeMinute)/float(60)) * 1000)/ 1000;
    schedule["endTimeHour"] = round(float(float(settings.schedule.endTimeHour)/float(3600)) * 1000)/ 1000;
    schedule["endTimeMinute"] = round(float(float(settings.schedule.endTimeMinute)/float(60)) * 1000)/ 1000;
  }

static void updateChannel(JsonObject& channel, Channel& settings) {
    settings.controlPin = channel["controlPin"];// | DEFAULT_CONTROL_STATE;
    settings.controlOn = channel["controlOn"] | DEFAULT_CONTROL_STATE;
    settings.name = channel["name"] | settings.name;
    settings.enabled = channel["enabled"] | DEFAULT_ENABLED_STATE;
    settings.enableTimeSpan = channel["enableTimeSpan"] | DEFAULT_ENABLE_TIME_SPAN_SCHEDULE;
    settings.lastStartedChangeTime = channel["lastStartedChangeTime"] | Utils.getLocalTime();

    JsonObject schedule = channel["schedule"];

    settings.schedule.runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : (int)(60 * DEFAULT_CONTROL_RUN_EVERY);
    settings.schedule.offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : (int)(60 * DEFAULT_CONTROL_OFF_AFTER);
    settings.schedule.startTimeHour = schedule["startTimeHour"] ? (int)(round(3600 * float(schedule["startTimeHour"]))) : (int)(3600 * DEFAULT_CONTROL_START_TIME_HOUR);
    settings.schedule.startTimeMinute = schedule["startTimeMinute"] ? (int)(round(60 * float(schedule["startTimeMinute"]))) : (int)(60 * DEFAULT_CONTROL_START_TIME_MINUTE);
    settings.schedule.endTimeHour = schedule["endTimeHour"] ? (int)(round(3600 * float(schedule["endTimeHour"]))) : (int)(3600 * DEFAULT_CONTROL_END_TIME_HOUR);
    settings.schedule.endTimeMinute = schedule["endTimeMinute"] ? (int)(round(60 * float(schedule["endTimeMinute"]))) : (int)(60 * DEFAULT_CONTROL_END_TIME_MINUTE);
  }

  static boolean dataIsValid(JsonObject& channel){
    // TO DO to be expanded for more validation
    JsonObject schedule = channel["schedule"];
    time_t runEvery = schedule["runEvery"] ? (int)(round(60 * float(schedule["runEvery"]))) : (int)(60 * DEFAULT_CONTROL_RUN_EVERY);
    time_t offAfter = schedule["offAfter"] ? (int)(round(60 * float(schedule["offAfter"]))) : (int)(60 * DEFAULT_CONTROL_OFF_AFTER);
    if(runEvery > offAfter){ return true; }
    return false;
  }
};

#endif