#include <cstdlib>
#include "Utilities.h"
#include "Channels.h"
#include "TaskScheduler.h"

TaskScheduler::TaskScheduler(AsyncWebServer* server,
                              SecurityManager* securityManager,
                              AsyncMqttClient* mqttClient,
                              FS* fs,
                              int channelControlPin,
                              char* channelJsonConfigPath, 
                              String restChannelEndPoint,
                              char* webSocketChannelEndPoint,
                              float  runEvery,
                              float  offAfter,
                              time_t  startTimeHour,
                              time_t  startTimeMinute,
                              time_t  endTimeHour,
                              time_t  endTimeMinute,
                              bool    enabled,
                              String  channelName,
                              bool  enableTimeSpan,
                              ChannelMqttSettingsService* channelMqttSettingsService,
                              bool randomize,
                              float hotTimeHour,
                              float overrideTime) :
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
                        overrideTime)
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

  ScheduleHotTicker.attach(1, +[&](TaskScheduler* task) {
    task->ScheduleHotTime--;
    if(task->ScheduleHotTime <= 0){
      task->ScheduleHotTicker.once(1, +[&](TaskScheduler* once){once->scheduleHotTask();}, task);
    }
  }, this);
}

void TaskScheduler::runHotTaskTicker(){
  HotHourTaskTimeCopy = HotHourTaskTime;
  HotHourTaskTicker.attach(1, +[&](TaskScheduler* task) {
     task->HotHourTaskTime--;
     if(task->HotHourTaskTime <= 0){
      task->HotHourTaskTime = task->HotHourTaskTimeCopy;
      task->updateStatus(task->HotHourTaskTimeCopy);
      task->runHotTask();
     }
  }, this);
}

void TaskScheduler::stopHotTaskTicker(){
  OffHotHourTicker.attach(1, +[&](TaskScheduler* task) {
    task->OffHotHourTime--;
    if(task->OffHotHourTime <= 0){
      task->OffHotHourTicker.once(1, +[&](TaskScheduler* once){once->stopHotTask();}, task);
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
  SpanTicker.attach(1, +[&](TaskScheduler* task) {
    task->SpanTime--;
    if(task->SpanTime <= 0){
      task->SpanTicker.once(1, +[&](TaskScheduler* once){once->scheduleTimeSpanTask();}, task);
    }
  }, this);
}

void TaskScheduler::runTaskTicker(){
  RunEveryTimeCopy = RunEveryTime;
  RunEveryTicker.attach(1, +[&](TaskScheduler* task) {
    task->RunEveryTime--;
    if(task->RunEveryTime <= 0){
      task->RunEveryTime = task->RunEveryTimeCopy;
      task->runTask();
    }
  }, this);
}

void TaskScheduler::runSpanTaskTicker(){
  SpanRepeatTimeCopy = SpanRepeatTime;
  SpanRepeatTicker.attach(1, +[&](TaskScheduler* task) {
    task->SpanRepeatTime--;
    if(task->SpanRepeatTime <= 0){
      task->SpanRepeatTime = task->SpanRepeatTimeCopy;
      task->runTask();
    }
  }, this);
}

void TaskScheduler::controlOnTicker(){
  updateNextRunStatus();
  ControlOnTicker.attach(1, +[&](TaskScheduler* task) {
    task->ControlOnTime--;
    if(task->ControlOnTime <= 0){
      task->ControlOnTicker.once(1, +[&](TaskScheduler* once){once->controlOn();}, task);
    }
  }, this);
}

void TaskScheduler::controlOffTicker(){
  _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.controlOffDateTime = Utils.strDeltaLocalTime(ControlOffTime);
    return StateUpdateResult::CHANGED;
  }, _channel.name);

  ControlOffTicker.attach(1, +[&](TaskScheduler* task) {
    task->ControlOffTime--;
    if(task->ControlOffTime <= 0){
      task->ControlOffTicker.once(1, +[&](TaskScheduler* once){once->controlOff();}, task);
    }
  }, this);
}

void TaskScheduler::scheduleTaskTicker(ScheduledTime schedule){
   if(ScheduleTime == 1){
    CurrentTime currentTime = getCurrentTime();
    ScheduleTime = _channel.schedule.runEvery - (currentTime.minutesInSec % _channel.schedule.runEvery);
  }
  ScheduleTicker.attach(1, +[&](TaskScheduler* task) {
    task->ScheduleTime--;
    if(task->ScheduleTime <= 0){
      task->ScheduleTicker.once(1, +[&](TaskScheduler* once){once->scheduleRunEveryTask();}, task);
    }
  }, this);
}

ScheduledTime TaskScheduler::getNextRunTime(){
    ScheduledTime schedule = Utils.getScheduleTimes(_channel.startTime,
    _channel.endTime, _channel.schedule.hotTimeHour, _channel.enableTimeSpan,
    _isHotScheduleActive, _channel.name, _channel.randomize, _isOverrideActive);
    return schedule;
}

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
  _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
}

void TaskScheduler::reScheduleTasks(){
  ReScheduleTasksTime = 3600; // reschedule task after 1 hour
  ReScheduleTasksTicker.attach(1, +[&](TaskScheduler* task) {
    task->ReScheduleTasksTime--;
    if(task->ReScheduleTasksTime <= 0){
      task->scheduleRestart(false, false);
    }
  }, this);
}

void TaskScheduler::setSchedule(){
  Serial.println("");
  Serial.print("Current Time: ");
  digitalClockDisplay();
  Serial.print(_channel.name);

  if(_channel.enabled){
    reScheduleTasks();
    ScheduledTime schedule = getNextRunTime();
    printSchedule(schedule);
    if (schedule.scheduleTime <= 0) { schedule.scheduleTime = 1; } 
    Serial.print(": Time to next task run: ");
    Serial.print(schedule.scheduleTime);
    Serial.println("s");
    ScheduleTime = schedule.scheduleTime;

    if(schedule.isHotSchedule){scheduleHotTaskTicker(schedule);}

    if(schedule.isSpanSchedule){
      scheduleTimeSpanTaskTicker(schedule);
    }else{
      scheduleTaskTicker(schedule);    
    }

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.lastStartedChangeTime = Utils.strLocalTime();
      channelState.channel.nextRunTime = Utils.strDeltaLocalTime(schedule.scheduleTime);
      Serial.print("Task set to start at : ");
      Serial.println(channelState.channel.nextRunTime);
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
    if(OffHotHourTime < 1) { OffHotHourTime = 1;}

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.isHotScheduleActive = _isHotScheduleActive;
      channelState.channel.controlOn = true;
      channelState.channel.lastStartedChangeTime =  Utils.strLocalTime();
      channelState.channel.offHotHourDateTime = Utils.strDeltaLocalTime(OffHotHourTime);
      channelState.channel.controlOffDateTime = channelState.channel.offHotHourDateTime;
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    Serial.print("OffHotHourTime:    ");
    Serial.println(OffHotHourTime);
    stopHotTaskTicker();
  }
}

void TaskScheduler::scheduleTimeSpanTask(){
  SpanRepeatTime = TWENTY_FOUR_HOUR_DURATION;
  updateStatus(SpanRepeatTime);
  runSpanTaskTicker();
  runTask();
}

void TaskScheduler::updateStatus(time_t delta){
  _channelStateService.update([&](ChannelState& channelState) {
  channelState.channel.nextRunTime = Utils.strDeltaLocalTime(delta);;  
  return StateUpdateResult::CHANGED;
  }, _channel.name);
}

void TaskScheduler::updateNextRunStatus(){
  updateStatus(getNextRunTime().scheduleTime);
}

time_t TaskScheduler::getRandomOnTimeSpan(){
  return(rand() % (_channel.schedule.runEvery - _channel.schedule.offAfter) + 1);
}

time_t TaskScheduler::getRandomOffTimeSpan(){ 
 return(rand() % _channel.schedule.offAfter + 1);
}

void TaskScheduler::printSchedule(ScheduledTime schedule){
  Serial.println(" ");
  Serial.print("channelName:         ");
  Serial.println(schedule.channelName);
  Serial.print("scheduleTime:        ");
  Serial.println(schedule.scheduleTime);
  Serial.print("isHotSchedule:       ");
  Serial.println(schedule.isHotSchedule);
  Serial.print("isSpanSchedule:      ");
  Serial.println(schedule.isSpanSchedule);
  Serial.print("isHotScheduleActive:        ");
  Serial.println(schedule.isHotScheduleActive);
  Serial.print("isRunTaskNow:        ");
  Serial.println(schedule.isRunTaskNow);
  Serial.print("currentTime:                 ");
  Serial.print(ctime(&schedule.currentTime));
  Serial.print("startTime:                   ");
  Serial.println(schedule.startTime);
  Serial.print("endTime:                     ");
  Serial.println(schedule.endTime);
  Serial.print("scheduleStartDateTime:       ");
  Serial.print(ctime(&schedule.scheduleStartDateTime));
  Serial.print("scheduleHotTimeEndDateTime:  ");
  Serial.print(ctime(&schedule.scheduleHotTimeEndDateTime));
  Serial.print("scheduleEndDateTime:         ");
  Serial.print(ctime(&schedule.scheduleEndDateTime));
  Serial.print("isOverride:                  ");
  Serial.println(_channel.schedule.isOverride);
  Serial.print("isOverrideActive:            ");
  Serial.println(schedule.isOverrideActive);
}

void TaskScheduler::runTask(){
  ScheduledTime schedule = getNextRunTime();
  printSchedule(schedule);
  if(schedule.isRunTaskNow){
    if(!_channel.randomize){
      controlOn();
    }
    else{
      ControlOnTime = getRandomOnTimeSpan();
      Serial.print("ControlOnTime:    ");
      Serial.println(ControlOnTime);
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
      channelState.channel.lastStartedChangeTime =  Utils.strLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    if(_channel.enableTimeSpan){
      ControlOffTime = getScheduleTimeSpanOff();
      Serial.print("ControlOffTime:    ");
      Serial.println(ControlOffTime);
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
      channelState.channel.lastStartedChangeTime = Utils.strLocalTime();
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
  Serial.print(ctime(&tnow));
}

void TaskScheduler::digitalClockDisplay(time_t tnow) {
  Serial.println(ctime(&tnow));
}

time_t TaskScheduler::getScheduleTimeSpanOff(){
  timer_t next = 1;
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

void TaskScheduler::scheduleRestart(bool isTurnOffSwitch, bool isResetOverride){
  tickerDetachAll();
  setScheduleTimes();
  if(isResetOverride){
    resetOverrideTime();
  }
  if(isTurnOffSwitch){
    overrideControlOff();
  }
  setSchedule();
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
  _isOverrideActive = true;
  _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.schedule.isOverride = false;
      channelState.channel.schedule.isOverrideActive = true;
      return StateUpdateResult::CHANGED;
    }, _channel.name);

  if(_channel.schedule.overrideTime >1){
    ScheduleOverrideTicker.once(_channel.schedule.overrideTime, +[&](TaskScheduler* task) {
        task->scheduleRestart(false, true);
    }, this);
  }
}

void TaskScheduler::tickerDetachAll(){
  HotHourTaskTicker.once(1, +[&](){});
  RunEveryTicker.once(1, +[&](){});
  SpanRepeatTicker.once(1, +[&](){});
  SpanRepeatTicker.once(1, +[&](){});
  OffHotHourTicker.once(1, +[&](){});
  ScheduleTicker.once(1, +[&](){});
  ScheduleHotTicker.once(1, +[&](){});
  SpanTicker.once(1, +[&](){});
  RunEveryTicker.once(1, +[&](){});
  ControlOnTicker.once(1, +[&](){});
  ControlOffTicker.once(1, +[&](){});
  ReScheduleTasksTicker.once(1, +[&](){});
}