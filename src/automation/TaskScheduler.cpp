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
                              time_t  runEvery,
                              time_t  offAfter,
                              time_t  startTimeHour,
                              time_t  startTimeMinute,
                              time_t  endTimeHour,
                              time_t  endTimeMinute,
                              bool    enabled,
                              String  channelName,
                              bool  enableTimeSpan,
                              ChannelMqttSettingsService* channelMqttSettingsService,
                              bool randomize,
                              time_t hotTimeHour) :
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

void TaskScheduler::scheduleHotTaskTicker(){
  ScheduleHotTicker.attach(1, +[&](TaskScheduler* task) {
     task->ScheduleHotTime--;
     if(task->ScheduleHotTime <= 0){
      task->ScheduleHotTicker.attach(1, +[&](){});
      task->scheduleHotTask();
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
    task->OffHotHourTicker.attach(1, +[&](){});
    task->stopHotTask();
    }
  }, this);
}

void TaskScheduler::scheduleTimeSpanTaskTicker(){
  SpanTicker.attach(1, +[&](TaskScheduler* task) {
    task->SpanTime--;
    if(task->SpanTime <= 0){
    task->SpanTicker.attach(1, +[&](){});
    task->scheduleTimeSpanTask();
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
      task->ControlOnTicker.attach(1, +[&](){});
      task->controlOn();
     }
  }, this);
}

void TaskScheduler::controlOffTicker(){
  ControlOffTicker.attach(1, +[&](TaskScheduler* task) {
     task->ControlOffTime--;
     if(task->ControlOffTime <= 0){
      task->ControlOffTicker.attach(1, +[&](){});
      task->controlOff();
     }
  }, this);
}

void TaskScheduler::scheduleTaskTicker(){
  ScheduleTicker.attach(1, +[&](TaskScheduler* task) {
    task->ScheduleTime--;
    if(task->ScheduleTime <= 0){
    task->ScheduleTicker.attach(1, +[&](){});
    task->scheduleTask();
    }
  }, this);
}

ScheduledTime TaskScheduler::getNextRunTime(){
  ScheduledTime schedule;
  schedule.currentTime = time(nullptr);
  schedule.scheduleTime = 0;  
  CurrentTime current = getCurrentTime();

  if(_channel.enableTimeSpan){ 
   schedule = getTimeSpanScheduleNextRunTime(schedule);
    if( schedule.scheduleTime <= 0 ) { schedule.scheduleTime = 1;}
    return schedule;
  }
  
  if(_channel.startTime < _channel.endTime){
    if(current.totalCurrentTime > _channel.endTime){
      schedule.scheduleTime = _channel.startTime + MID_NIGHT_SECONDS - current.totalCurrentTime + 1;
      } 
    else if(current.totalCurrentTime < _channel.startTime){ 
      schedule.scheduleTime = _channel.startTime -  current.totalCurrentTime;
    }
    else {
      if(current.minutes < _channel.schedule.startTimeMinute){
        if((current.minutes + _channel.schedule.runEvery) < _channel.schedule.startTimeMinute){
          schedule.scheduleTime = ceil(current.minutes/_channel.schedule.runEvery) * _channel.schedule.runEvery  + _channel.schedule.runEvery - current.minutes - current.seconds;
        }else{
          schedule.scheduleTime = _channel.schedule.startTimeMinute - current.minutes - current.seconds;
        }
      }else if(current.minutes > _channel.schedule.startTimeMinute){
        if((current.minutes + _channel.schedule.runEvery) > 3600){
          schedule.scheduleTime =  3600 - current.minutes - current.seconds;
        }else{
          if((current.minutes + _channel.schedule.runEvery) < _channel.schedule.startTimeMinute){
            schedule.scheduleTime = ceil(current.minutes/_channel.schedule.runEvery) * _channel.schedule.runEvery  + _channel.schedule.runEvery - current.minutes - current.seconds;
          }else{
            schedule.scheduleTime = _channel.schedule.startTimeMinute + _channel.schedule.runEvery - current.minutes  + current.seconds;
          }        
        }
      }else{
        schedule.scheduleTime = 0;
      } 
    }
    if( schedule.scheduleTime <= 0 ) { schedule.scheduleTime = 1;}
    return schedule;
  }
  if( (current.totalCurrentTime > _channel.startTime) && (current.totalCurrentTime < _channel.endTime)){
    schedule.scheduleTime = 0;
  }else{ 
      schedule.scheduleTime = getTimeSpanStartTimeFromNow() ;
      if(_channel.randomize){
        schedule.scheduleTime = schedule.scheduleTime  + _channel.schedule.hotTimeHour;
      }
  }
  
  if( schedule.scheduleTime <= 0 ) { schedule.scheduleTime = 1;}
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
    if(!_channel.randomize){
      ScheduleTime = schedule.scheduleTime;
      scheduleTaskTicker();
    }else{
      if(_channel.schedule.hotTimeHour == 0){
        ScheduleTime = schedule.scheduleTime;
        scheduleTaskTicker();
      }else{
        if(_channel.startTime + _channel.schedule.hotTimeHour >= current.totalCurrentTime){
          ScheduleHotTime = schedule.scheduleTime;
          scheduleHotTaskTicker();
        }
        if(schedule.scheduleTime > 1){
          ScheduleHotTime = schedule.scheduleTime;
          scheduleHotTaskTicker();
          ScheduleTime = schedule.scheduleTime + _channel.schedule.hotTimeHour;
          scheduleTaskTicker();
        }else{
          if(_channel.startTime + _channel.schedule.hotTimeHour <= current.totalCurrentTime){
              ScheduleTime = schedule.scheduleTime;
              scheduleTaskTicker();
          }else{
            ScheduleTime = schedule.scheduleTime + _channel.startTime + _channel.schedule.hotTimeHour - current.totalCurrentTime;
            scheduleTaskTicker();
          }
        }
      }
    }

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.lastStartedChangeTime = Utils.getLocalTime();
      channelState.channel.nextRunTime = Utils.getLocalNextRunTime(getNextRunTime().scheduleTime);
      Serial.print("Task set to start at : ");
      Serial.println(channelState.channel.nextRunTime);
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  }
}

void TaskScheduler::scheduleTask(){
  if(_channel.enableTimeSpan){
    SpanTime = getTimeSpanStartTimeFromNow();
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

    if (channelState.channel.controlOn) {
      return StateUpdateResult::UNCHANGED;
    }
      channelState.channel.controlOn = true;
      channelState.channel.lastStartedChangeTime =  Utils.getLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    CurrentTime current = getCurrentTime();
    OffHotHourTime = _channel.startTime + _channel.schedule.hotTimeHour - current.totalCurrentTime;
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

bool TaskScheduler::shouldRunTask(){
  if (_timeSpanActive) { return false; }
  CurrentTime current = getCurrentTime();
  time_t currentTime = current.hours + current.minutes;
  if(_channel.startTime < _channel.endTime){
    return(currentTime >= _channel.startTime  && currentTime <= _channel.endTime);
  }
  return(currentTime >= _channel.startTime || currentTime <= _channel.endTime);
}

void TaskScheduler::updateNextRunStatus(){
  String nextRunTime = "";
  if(_channel.enableTimeSpan){
    nextRunTime = Utils.getLocalNextRunTime(getTimeSpanStartTimeFromNow());
  }else{
    if(shouldRunTask()){
      nextRunTime =  Utils.getLocalNextRunTime(_channel.schedule.runEvery);
    }else{
      nextRunTime =  Utils.getLocalNextRunTime(getNextRunTime().scheduleTime);
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
  if(shouldRunTask()){
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
      if (channelState.channel.controlOn) {
        return StateUpdateResult::UNCHANGED;
      }
        channelState.channel.controlOn = true;
        channelState.channel.lastStartedChangeTime =  Utils.getLocalTime();
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
      if (!channelState.channel.controlOn) {
        return StateUpdateResult::UNCHANGED;
      }
      channelState.channel.controlOn = false;
      channelState.channel.lastStartedChangeTime = Utils.getLocalTime();
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

ScheduledTime TaskScheduler::getTimeSpanScheduleNextRunTime(ScheduledTime& schedule){
 CurrentTime current = getCurrentTime();
  if(_channel.startTime < _channel.endTime){
    if(current.totalCurrentTime > _channel.startTime){
      if(current.totalCurrentTime < _channel.endTime){
        schedule.scheduleTime = 0;
        return(schedule);
      }
      schedule.scheduleTime = _channel.startTime - current.totalCurrentTime;

      if(current.totalCurrentTime < (MID_NIGHT_SECONDS + 1)){
        schedule.scheduleTime = schedule.scheduleTime + MID_NIGHT_SECONDS + 1;
      }

      return(schedule);
    }
    schedule.scheduleTime = _channel.startTime - current.totalCurrentTime;
    return(schedule);
  }

  if(current.totalCurrentTime < _channel.endTime){
    schedule.scheduleTime = 0;
    return(schedule); 
  }

  if(current.totalCurrentTime < _channel.startTime){
    schedule.scheduleTime = _channel.startTime - current.totalCurrentTime;
    return(schedule);
  }
  schedule.scheduleTime = 0;
  return(schedule);
}

time_t TaskScheduler::getTimeSpanStartTimeFromNow(){
  CurrentTime current = getCurrentTime();
  if(current.totalCurrentTime >= _channel.startTime){
    return(MID_NIGHT_SECONDS + 1 + _channel.startTime - current.totalCurrentTime);
  }
  return(_channel.startTime - current.totalCurrentTime);
}

void TaskScheduler::scheduleRestart(){
  tickerDetachAll();
  setScheduleTimes();
  overrideControlOff();
  setSchedule();
}

void TaskScheduler::tickerDetachAll(){
  HotHourTaskTicker.attach(1, +[&](){});
  RunEveryTicker.attach(1, +[&](){});
  SpanRepeatTicker.attach(1, +[&](){});
}