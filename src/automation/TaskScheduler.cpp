#include <cstdlib>
#include "Utilities.h"
#include "Channels.h"
#include "TaskScheduler.h"

TaskScheduler::TaskScheduler(AsyncWebServer* server,
                              SecurityManager* securityManager,
                              AsyncMqttClient* mqttClient,
                              FS* fs,
                              uint8_t channelControlPin,
                              char* channelJsonConfigPath, 
                              String restChannelEndPoint,
                              char* webSocketChannelEndPoint,
                              float  runEvery,
                              float  offAfter,
                              int  startTimeHour,
                              int  startTimeMinute,
                              int  endTimeHour,
                              int  endTimeMinute,
                              bool    enabled,
                              String  channelName,
                              bool  enableTimeSpan,
                              ChannelMqttSettingsService* channelMqttSettingsService,
                              bool randomize,
                              float hotTimeHour,
                              float overrideTime,
                              bool enableMinimumRunTime,
                              uint8_t homeAssistantTopicType,
                              String homeAssistantIcon,
                              bool enableRemoteConfiguration,
                              String masterIPAddress,
                              String restChannelRestartEndPoint) :
    _channelStateService(server,
                        securityManager,
                        mqttClient,
                        fs,
                        channelControlPin,
                        channelJsonConfigPath,
                        restChannelEndPoint,
                        webSocketChannelEndPoint,
                        runEvery,
                        offAfter,
                        startTimeHour,
                        startTimeMinute,
                        endTimeHour,
                        endTimeMinute,
                        enabled,
                        channelName,
                        enableTimeSpan,
                        channelMqttSettingsService,
                        randomize,
                        hotTimeHour,
                        overrideTime,
                        enableMinimumRunTime,
                        homeAssistantTopicType,
                        homeAssistantIcon,
                        enableRemoteConfiguration,
                        masterIPAddress,
                        restChannelRestartEndPoint)
                                       {
                                         _isHotScheduleActive = false;
                                         _isOverrideActive = false;

    _channelStateService.addUpdateHandler([&](const String& originId) {
      if(_channelStateService.getChannel().schedule.isOverride){
        this->setOverrideTime();
      }  
    }, false);
  };

void TaskScheduler::begin(){
    _channelStateService.begin();
}

void TaskScheduler::scheduleHotTaskTicker(ScheduledTime schedule){
  if(schedule.scheduleTime > 1){
    ScheduleHotTime = schedule.scheduleTime;
  }else{
    ScheduleHotTime = TWENTY_FOUR_HOUR_DURATION - (schedule.currentTime - schedule.scheduleStartDateTime) - 1;
      runHotTask();
      if((schedule.currentTime < schedule.scheduleHotTimeEndDateTime)
        && ((schedule.currentTime + TWENTY_FOUR_HOUR_DURATION - schedule.scheduleStartDateTime) > _channel.schedule.hotTimeHour) ){
        _isHotScheduleActive = false;
      }
      if(OffHotHourTime > 1){
        _isHotScheduleActive = true;
      }
      _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.isHotScheduleActive = _isHotScheduleActive;
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  }

  ScheduleHotTicker.attach(1, +[](TaskScheduler* task) {
    task->ScheduleHotTime--;
    if(task->ScheduleHotTime <= 0){
      task->ScheduleHotTicker.once(0.010, +[](TaskScheduler* once){once->scheduleHotTask();}, task);
    }
  }, this);
}

void TaskScheduler::runHotTaskTicker(){
  HotHourTaskTimeCopy = HotHourTaskTime;
  HotHourTaskTicker.attach(1, +[](TaskScheduler* task) {
     task->HotHourTaskTime--;
     if(task->HotHourTaskTime <= 0){
      task->HotHourTaskTime = task->HotHourTaskTimeCopy;
      task->updateStatus(task->HotHourTaskTimeCopy);
      task->runHotTask();
     }
  }, this);
}

void TaskScheduler::stopHotTaskTicker(){
  OffHotHourTicker.attach(1, +[](TaskScheduler* task) {
    task->OffHotHourTime--;
    if(task->OffHotHourTime <= 0){
      task->OffHotHourTicker.once(0.010, +[](TaskScheduler* once){once->stopHotTask();}, task);
    }
  }, this);
}

void TaskScheduler::stopHotTask(){
  _isHotScheduleActive = false;
  _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.isHotScheduleActive = _isHotScheduleActive;
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  controlOff();
}


void TaskScheduler::scheduleTimeSpanTaskTicker(ScheduledTime schedule){
  if(schedule.scheduleTime > 1){
    SpanTime = schedule.scheduleTime;
  }else{
    SpanTime = TWENTY_FOUR_HOUR_DURATION - (schedule.currentTime - schedule.scheduleStartDateTime) - 1;
    runTask();
  }
  SpanTicker.attach(1, +[](TaskScheduler* task) {
    task->SpanTime--;
    if(task->SpanTime <= 0){
      task->SpanTicker.once(0.010, +[](TaskScheduler* once){once->scheduleTimeSpanTask();}, task);
    }
  }, this);
}

void TaskScheduler::runTaskTicker(){
  RunEveryTimeCopy = RunEveryTime;
  RunEveryTicker.attach(1, +[](TaskScheduler* task) {
    task->RunEveryTime--;
    if(task->RunEveryTime <= 0){
      task->RunEveryTime = task->RunEveryTimeCopy;
      task->runTask();
    }
  }, this);
}

void TaskScheduler::runSpanTaskTicker(){
  SpanRepeatTimeCopy = SpanRepeatTime;
  SpanRepeatTicker.attach(1, +[](TaskScheduler* task) {
    task->SpanRepeatTime--;
    if(task->SpanRepeatTime <= 0){
      task->SpanRepeatTime = task->SpanRepeatTimeCopy;
      task->runTask();
    }
  }, this);
}

void TaskScheduler::controlOnTicker(){
  updateNextRunStatus();
  ControlOnTicker.attach(1, +[](TaskScheduler* task) {
    task->ControlOnTime--;
    if(task->ControlOnTime <= 0){
      task->ControlOnTicker.once(0.010, +[](TaskScheduler* once){once->controlOn();}, task);
    }
  }, this);
}

void TaskScheduler::controlOffTicker(){
  _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.controlOffDateTime = utils.strDeltaLocalTime(ControlOffTime);
    return StateUpdateResult::CHANGED;
  }, _channel.name);

  ControlOffTicker.attach(1, +[](TaskScheduler* task) {
    task->ControlOffTime--;
    if(task->ControlOffTime <= 0){
      task->ControlOffTicker.once(0.010, +[](TaskScheduler* once){once->controlOff();}, task);
    }
  }, this);
}

void TaskScheduler::scheduleTaskTicker(ScheduledTime schedule){
   if(ScheduleTime == 1 && !_isReschedule){
    CurrentTime currentTime = getCurrentTime();
    ScheduleTime = _channel.schedule.runEvery - (currentTime.minutesInSec % _channel.schedule.runEvery);
  }
  ScheduleTicker.attach(1, +[](TaskScheduler* task) {
    task->ScheduleTime--;
    if(task->ScheduleTime <= 0){
      task->ScheduleTicker.once(0.010, +[](TaskScheduler* once){once->scheduleRunEveryTask();}, task);
    }
  }, this);
}

ScheduledTime TaskScheduler::getNextRunTime(){
    ScheduledTime schedule = utils.getScheduleTimes(_channel.startTime,
    _channel.endTime, _channel.schedule.hotTimeHour, _channel.enableTimeSpan,
    _channel.isHotScheduleActive, _channel.name, _channel.randomize,
    _isOverrideActive, _channel.enableMinimumRunTime);
    return schedule;
}

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
  _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
}

void TaskScheduler::reScheduleTasks(){
  ReScheduleTasksTime = 3600; // reschedule task after 1 hour
  ReScheduleTasksTicker.attach(1, +[](TaskScheduler* task) {
    task->ReScheduleTasksTime--;
    if(task->ReScheduleTasksTime <= 0){
      task->scheduleRestart(
        false,
        false,
        task->getChannelControlPin(),
        task->getChannelControlPin(),
        task->getChannelHomeAssistantTopicType(),
        task->getChannelHomeAssistantTopicType()
      );
    }
  }, this);
}

void TaskScheduler::setSchedule(bool isReschedule){
  debugln(F(""));
  debug(F("Current Time: "));
  digitalClockDisplay();
  debug(_channel.name);
  debug(": " );
  _isReschedule = isReschedule;
  if(_channel.enabled){
    reScheduleTasks();
    ScheduledTime schedule = getNextRunTime();
    printSchedule(schedule);
    if (schedule.scheduleTime <= 0) { schedule.scheduleTime = 1; } 
    debug(F("Time to next task run: "));
    debug(schedule.scheduleTime);
    debugln(F("s"));
    ScheduleTime = schedule.scheduleTime;

    if(schedule.isHotSchedule){scheduleHotTaskTicker(schedule);}

    if(schedule.isSpanSchedule){
      scheduleTimeSpanTaskTicker(schedule);
    }else{
      scheduleTaskTicker(schedule);    
    }

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.lastStartedChangeTime = utils.strLocalTime();
      channelState.channel.nextRunTime = utils.strDeltaLocalTime(schedule.scheduleTime);
      debug(F("Task set to start at : "));
      debugln(channelState.channel.nextRunTime);
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  }
}

void TaskScheduler::scheduleRunEveryTask(){
  RunEveryTime = _channel.schedule.runEvery;
  runTaskTicker();
  runTask();
 }

void TaskScheduler::scheduleHotTask(){
  HotHourTaskTime = TWENTY_FOUR_HOUR_DURATION;
  updateStatus(HotHourTaskTime);
  runHotTaskTicker();
  runHotTask();
}

void TaskScheduler::runHotTask(){
  if(_channel.enabled){
    _isHotScheduleActive = true;
    ScheduledTime schedule = getNextRunTime();
    OffHotHourTime = schedule.scheduleHotTimeEndDateTime - schedule.currentTime;
    if(schedule.isHotScheduleAdjust){
      OffHotHourTime = OffHotHourTime - TWENTY_FOUR_HOUR_DURATION;
    }
    if(OffHotHourTime < 1) { OffHotHourTime = 1; _isHotScheduleActive = false;}

    if(OffHotHourTime > 1){
      _channelStateService.update([&](ChannelState& channelState) {
        channelState.channel.isHotScheduleActive = true;
        channelState.channel.controlOn = true;
        channelState.channel.lastStartedChangeTime =  utils.strLocalTime();
        channelState.channel.offHotHourDateTime = utils.strDeltaLocalTime(OffHotHourTime);
        channelState.channel.controlOffDateTime = channelState.channel.offHotHourDateTime;
        return StateUpdateResult::CHANGED;
      }, _channel.name);
      stopHotTaskTicker();
    }
  }
}

void TaskScheduler::scheduleTimeSpanTask(){
  SpanRepeatTime = TWENTY_FOUR_HOUR_DURATION;
  updateStatus(SpanRepeatTime);
  runSpanTaskTicker();
  runTask();
}

void TaskScheduler::updateStatus(short delta){
  _channelStateService.update([&](ChannelState& channelState) {
  channelState.channel.nextRunTime = utils.strDeltaLocalTime(delta);;  
  return StateUpdateResult::CHANGED;
  }, _channel.name);
}

void TaskScheduler::updateNextRunStatus(){
  updateStatus(getNextRunTime().scheduleTime);
}

int TaskScheduler::getRandomOnTimeSpan(){
  return(rand() % (_channel.schedule.runEvery - _channel.schedule.offAfter -1) + 1);
}

int TaskScheduler::getRandomOffTimeSpan(){
  if(_channel.enableMinimumRunTime){
    return(rand() % (_channel.schedule.runEvery - _controlOnTime - _channel.schedule.offAfter) + _channel.schedule.offAfter);
  }
 return(rand() % _channel.schedule.offAfter + 1);
}

void TaskScheduler::printSchedule(ScheduledTime schedule){
  debugln(F(" "));
  debug(F("channelName:         "));
  debugln(schedule.channelName);
  debug(F("controlPin:         "));
  debugln(_channel.controlPin);
  debug(F("scheduleTime:        "));
  debugln(schedule.scheduleTime);
  debug(F("isHotSchedule:       "));
  debugln(schedule.isHotSchedule);
  debug(F("isSpanSchedule:      "));
  debugln(schedule.isSpanSchedule);
  debug(F("isHotScheduleActive:        "));
  debugln(schedule.isHotScheduleActive);
  debug(F("isRunTaskNow:        "));
  debugln(schedule.isRunTaskNow);
  debug(F("currentTime:                 "));
  debug(ctime(&schedule.currentTime));
  debug(F("startTime:                   "));
  debugln(schedule.startTime);
  debug(F("endTime:                     "));
  debugln(schedule.endTime);
  debug(F("scheduleStartDateTime:       "));
  debug(ctime(&schedule.scheduleStartDateTime));
  debug(F("scheduleHotTimeEndDateTime:  "));
  debug(ctime(&schedule.scheduleHotTimeEndDateTime));
  debug(F("scheduleEndDateTime:         "));
  debug(ctime(&schedule.scheduleEndDateTime));
  debug(F("isOverride:                  "));
  debugln(_channel.schedule.isOverride);
  debug(F("isOverrideActive:            "));
  debugln(schedule.isOverrideActive);
  debug(F("overrideTime:            "));
  debug(_channel.schedule.overrideTime);
  debugln(F("s"));
}

void TaskScheduler::runTask(){
  ScheduledTime schedule = getNextRunTime();
  // printSchedule(schedule);
  if(schedule.isRunTaskNow){
    if(!_channel.randomize){
      controlOn();
    }
    else{
      _controlOnTime = getRandomOnTimeSpan();
      ControlOnTime = _controlOnTime;
      updateStatus(ControlOnTime);
      controlOnTicker();
    }
  }else{
    updateStatus(schedule.scheduleTime);
  }
}

void TaskScheduler::controlOn(){
  if(_channel.enabled && !_isOverrideActive){
    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.controlOn = true;
      channelState.channel.lastStartedChangeTime =  utils.strLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    if(_channel.enableTimeSpan){
      ControlOffTime = getScheduleTimeSpanOff();
      controlOffTicker();
    }else{
      if(!_channel.randomize){
        ControlOffTime = _channel.schedule.offAfter;
        controlOffTicker();
      }else{
          ControlOffTime = getRandomOffTimeSpan();
          controlOffTicker();
      }
    }
  }
  updateNextRunStatus();
}

void TaskScheduler::overrideControlOff(){
  _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.controlOn = false;
      channelState.channel.lastStartedChangeTime = utils.strLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    updateNextRunStatus();
}

void TaskScheduler::controlOff(){
  if(!_isOverrideActive){
    overrideControlOff();
  }
}

void TaskScheduler::digitalClockDisplay() {
  time_t tnow = time(nullptr);
  debug(ctime(&tnow));
}

void TaskScheduler::digitalClockDisplay(time_t tnow) {
  debugln(ctime(&tnow));
}

int TaskScheduler::getScheduleTimeSpanOff(){
  int next = 1;
  CurrentTime current = getCurrentTime();
  if(_channel.startTime < _channel.endTime){
    if(current.totalCurrentTimeInSec < _channel.endTime ){
      next = _channel.endTime - current.totalCurrentTimeInSec;
    }
  }else{
    if(current.totalCurrentTimeInSec > _channel.endTime){
      next = MID_NIGHT_SECONDS + _channel.endTime - current.totalCurrentTimeInSec + 1;
    }else{
      next = _channel.endTime - current.totalCurrentTimeInSec;
    }
  }
  
  if (next <= 0 ) { next = 1;}
  return next;
}

void TaskScheduler::scheduleRestart(
  bool isTurnOffSwitch,
  bool isResetOverride,
  uint8_t oldControlPin,
  uint8_t controlPin,
  uint8_t oldHomeAssistantTopicType,
  uint8_t homeAssistantTopicType
  ){
  if(isTurnOffSwitch && isResetOverride){
    if((oldControlPin != controlPin) || (oldHomeAssistantTopicType != homeAssistantTopicType)){
      digitalWrite(oldControlPin, CONTROL_OFF);
      _channelStateService.mqttUnregisterConfig(oldControlPin, oldHomeAssistantTopicType);
      _channelStateService.mqttRepublish(controlPin, homeAssistantTopicType);

      pinMode(controlPin, OUTPUT);
      digitalWrite(controlPin, CONTROL_OFF);
      
      overrideControlOff();
    }
  }
  _channelStateService.mqttRepublish();
  tickerDetachAll();
  setScheduleTimes();

  if(isTurnOffSwitch && !isResetOverride){
    overrideControlOff();
  }

  if(isResetOverride){
    overrideControlOff();
    resetOverrideTime();
    _isOverrideActive = false;
  }

  if (!_isOverrideActive){
    setSchedule(true);
  }
}

void TaskScheduler::resetOverrideTime(){
  _isOverrideActive = false;
  _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.schedule.isOverride = false;
      channelState.channel.schedule.isOverrideActive = false;
      return StateUpdateResult::CHANGED;
    }, _channel.name);    
}

void TaskScheduler::setOverrideTime(){
  tickerDetachAll();
  _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.schedule.isOverride = false;
      channelState.channel.schedule.isOverrideActive = true;
      return StateUpdateResult::CHANGED;
    }, _channel.name);

  _isOverrideActive = true;
  ScheduleOverrideTaskTime = _channel.schedule.overrideTime > 1 ? _channel.schedule.overrideTime : 1;

  ScheduleOverrideTicker.attach(1, +[](TaskScheduler* task) {
    task->ScheduleOverrideTaskTime--;
    if(task->ScheduleOverrideTaskTime <= 0){
      task->ScheduleOverrideTicker.once(0.010, +[](TaskScheduler* once){
        once->scheduleRestart(
            true,
            true,
            once->getChannelControlPin(),
            once->getChannelControlPin(),
            once->getChannelHomeAssistantTopicType(),
            once->getChannelHomeAssistantTopicType()
          );
        }, task);
    }
  }, this);
}

uint8_t TaskScheduler::getChannelControlPin(){
  return _channel.controlPin;
}

uint8_t TaskScheduler::getChannelHomeAssistantTopicType(){
  return _channel.homeAssistantTopicType;
}

void TaskScheduler::tickerDetachAll(){
  HotHourTaskTicker.detach();
  RunEveryTicker.detach();
  SpanRepeatTicker.detach();
  OffHotHourTicker.detach();
  ScheduleTicker.detach();
  ScheduleHotTicker.detach();
  SpanTicker.detach();
  ControlOnTicker.detach();
  ControlOffTicker.detach();
  ReScheduleTasksTicker.detach();
}

/* void TaskScheduler::tickerDetachAll(){
  HotHourTaskTicker.once(0.010, +[](){});
  RunEveryTicker.once(0.010, +[](){});
  SpanRepeatTicker.once(0.010, +[](){});
  //OffHotHourTicker.once(0.010, +[&](){});
  ScheduleTicker.once(0.010, +[](){});
  ScheduleHotTicker.once(0.010, +[](){});
  SpanTicker.once(0.010, +[](){});
  //RunEveryTicker.once(0.010, +[](){});
  ControlOnTicker.once(0.010, +[](){});
  ControlOffTicker.once(0.010, +[](){});
  ReScheduleTasksTicker.once(0.010, +[](){});
} */