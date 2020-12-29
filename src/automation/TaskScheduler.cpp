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
                              float hotTimeHour) :
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
                        hotTimeHour)
                                       {
  };

void TaskScheduler::begin(){
    _channelStateService.begin();
}

void TaskScheduler::scheduleHotTaskTicker(ScheduledTime schedule){
  if(schedule.scheduleTime > 1){
    ScheduleHotTime = schedule.scheduleTime;  // hotTime in future
  }else{
    ScheduleHotTime = schedule.currentTime - schedule.scheduleStartDateTime + TWENTY_FOUR_HOUR_DURATION - 1; // schedule following day
    if(schedule.scheduleHotTimeEndDateTime > schedule.currentTime) {  
      runHotTask(); // we are inside window must run now
    }
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

void TaskScheduler::scheduleTimeSpanTaskTicker(){
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
  ControlOnTicker.attach(1, +[&](TaskScheduler* task) {
    task->ControlOnTime--;
    if(task->ControlOnTime <= 0){
      task->ControlOnTicker.once(1, +[&](TaskScheduler* once){once->controlOn();}, task);
    }
  }, this);
}

void TaskScheduler::controlOffTicker(){
  ControlOffTicker.attach(1, +[&](TaskScheduler* task) {
    task->ControlOffTime--;
    if(task->ControlOffTime <= 0){
      task->ControlOffTicker.once(1, +[&](TaskScheduler* once){once->controlOff();}, task);
    }
  }, this);
}

void TaskScheduler::scheduleTaskTicker(){
  ScheduleTicker.attach(1, +[&](TaskScheduler* task) {
    task->ScheduleTime--;
    if(task->ScheduleTime <= 0){
      task->ScheduleTicker.once(1, +[&](TaskScheduler* once){once->scheduleTask();}, task);
    }
  }, this);
}

ScheduledTime TaskScheduler::getNextRunTime(){
    ScheduledTime schedule = Utils.getScheduleTimes(_channel.startTime, _channel.endTime, _channel.schedule.hotTimeHour);
    return schedule;
}

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
  _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
}

void TaskScheduler::setSchedule(){
  Serial.println("");
  Serial.print("Current Time: ");
  digitalClockDisplay();
  Serial.print(_channel.name);

  if(_channel.enabled){
    CurrentTime current = getCurrentTime();
    ScheduledTime schedule = getNextRunTime();
    if (schedule.scheduleTime <= 0) { schedule.scheduleTime = 1; } 
    Serial.print(": Time to next task run: ");
    Serial.print(schedule.scheduleTime);
    Serial.println("s");
    ScheduleTime = schedule.scheduleTime;
    scheduleTaskTicker();
    scheduleHotTaskTicker(schedule);

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.lastStartedChangeTime = Utils.strLocalTime();
      channelState.channel.nextRunTime = Utils.strLocalNextRunTime(schedule.scheduleTime);
      Serial.print("Task set to start at : ");
      Serial.println(channelState.channel.nextRunTime);
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  }
}

void TaskScheduler::scheduleTask(){
  if(_channel.enableTimeSpan){
    SpanTime = getNextRunTime().scheduleTime;
    scheduleTimeSpanTaskTicker();
  }else{
    RunEveryTime = _channel.schedule.runEvery;
    runTaskTicker();
  }
  runTask();
 }

void TaskScheduler::scheduleHotTask(){
  HotHourTaskTime = TWENTY_FOUR_HOUR_DURATION;
  runHotTaskTicker();
  runHotTask();
}

void TaskScheduler::runHotTask(){
  if(_channel.enabled){
    _timeSpanActive = true;
    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.controlOn = true;
      channelState.channel.lastStartedChangeTime =  Utils.strLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    ScheduledTime schedule = getNextRunTime();
    OffHotHourTime = schedule.scheduleHotTimeEndDateTime - schedule.currentTime;
    if(OffHotHourTime < 1) { OffHotHourTime = 1;}
    stopHotTaskTicker();
  }
}

void TaskScheduler::stopHotTask(){
  _timeSpanActive = false;
  controlOff();
}

void TaskScheduler::scheduleTimeSpanTask(){
  SpanRepeatTime = TWENTY_FOUR_HOUR_DURATION;
  runSpanTaskTicker();
  runTask();
}

bool TaskScheduler::shouldRunTaskNow(){
  if (_timeSpanActive) { return false; }
  ScheduledTime schedule = getNextRunTime();
  
  if (!schedule.isHotSchedule){
    return schedule.scheduleTime < 1;
  }

  return schedule.currentTime > schedule.scheduleHotTimeEndDateTime && schedule.currentTime < schedule.scheduleEndDateTime;

}

void TaskScheduler::updateNextRunStatus(){
  String nextRunTime = "";
  if(_channel.enableTimeSpan){
    nextRunTime = Utils.strLocalNextRunTime(getNextRunTime().scheduleTime);
  }else{
    if(shouldRunTaskNow()){
      nextRunTime =  Utils.strLocalNextRunTime(_channel.schedule.runEvery);
    }else{
      nextRunTime =  Utils.strLocalNextRunTime(getNextRunTime().scheduleTime);
    }
  } 
  _channelStateService.update([&](ChannelState& channelState) {
  channelState.channel.nextRunTime = nextRunTime;  
  return StateUpdateResult::CHANGED;
  }, _channel.name);
}

time_t TaskScheduler::getRandomOnTimeSpan(){
  return(rand() % (_channel.schedule.runEvery - _channel.schedule.offAfter) + 1);
}

time_t TaskScheduler::getRandomOffTimeSpan(){ 
 return(rand() % _channel.schedule.offAfter + 1);
}

void TaskScheduler::runTask(){
  if(shouldRunTaskNow()){
    if(!_channel.randomize){
      controlOn();
    }
    else{
      ControlOnTime = getRandomOnTimeSpan();
      controlOnTicker();
    }
  }
  updateNextRunStatus();
}

void TaskScheduler::controlOn(){
  if(_channel.enabled){
    if(!_channel.schedule.isOverride){
      _channelStateService.update([&](ChannelState& channelState) {
        channelState.channel.controlOn = true;
        channelState.channel.lastStartedChangeTime =  Utils.strLocalTime();
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
  if(!_channel.schedule.isOverride){
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
    if(current.totalCurrentTime < _channel.endTime ){
      next = _channel.endTime - current.totalCurrentTime;
    }
  }else{
    if(current.totalCurrentTime > _channel.endTime){
      next = MID_NIGHT_SECONDS + _channel.endTime - current.totalCurrentTime + 1;
    }else{
      next = _channel.endTime - current.totalCurrentTime;
    }
  }
  
  if (next <= 0 ) { next = 1;}
  return next;
}

void TaskScheduler::scheduleRestart(){
  tickerDetachAll();
  setScheduleTimes();
  overrideControlOff();
  setSchedule();
}

void TaskScheduler::tickerDetachAll(){
  HotHourTaskTicker.once(1, +[&](){});
  RunEveryTicker.once(1, +[&](){});
  SpanRepeatTicker.once(1, +[&](){});
  SpanRepeatTicker.once(1, +[&](){});
  OffHotHourTicker.once(1, +[&](){});
  HotHourTaskTicker.once(1, +[&](){});
  ScheduleTicker.once(1, +[&](){});
  ScheduleHotTicker.once(1, +[&](){});
  SpanTicker.once(1, +[&](){});
  RunEveryTicker.once(1, +[&](){});
  ControlOnTicker.once(1, +[&](){});
  ControlOffTicker.once(1, +[&](){});
}