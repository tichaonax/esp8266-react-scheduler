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
//void TaskScheduler::loop(){ 
    //Alarm.delay(0);
//}

void scheduleHotTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->scheduleHotTask();
  //Serial.print("scheduleHotTaskTicker:");
  //Serial.print(taskScheduler->ScheduleHotTime);
  taskScheduler->ScheduleHotTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->ScheduleHotTime);
     if(task->ScheduleHotTime == 0){
      task->ScheduleHotTicker.detach();
      task->scheduleHotTask();
     }
     task->ScheduleHotTime--;
      }, taskScheduler);
}

void runHotTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->runHotTask();
  taskScheduler->HotHourTaskTimeCopy = taskScheduler->HotHourTaskTime;
  //Serial.print("runHotTaskTicker:");
  //Serial.print(taskScheduler->HotHourTaskTime);
  taskScheduler->HotHourTaskTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->HotHourTaskTime);
     if(task->HotHourTaskTime == 0){
      //task->HotHourTaskTicker.detach();
      task->HotHourTaskTime = task->HotHourTaskTimeCopy;
      task->runHotTask();
     }
     task->HotHourTaskTime--;
      }, taskScheduler);
}

void stopHotTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->stopHotTask();
  //Serial.print("stopHotTaskTicker:");
  //Serial.print(taskScheduler->OffHotHourTime);
  taskScheduler->OffHotHourTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->OffHotHourTime);
     if(task->OffHotHourTime == 0){
      task->OffHotHourTicker.detach();
      task->stopHotTask();
     }
     task->OffHotHourTime--;
      }, taskScheduler);
}

void scheduleTimeSpanTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->scheduleTimeSpanTask();
  //Serial.print("scheduleTimeSpanTaskTicker:");
  //Serial.print(taskScheduler->SpanTime);
  taskScheduler->SpanTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->SpanTime);
     if(task->SpanTime == 0){
      task->SpanTicker.detach();
      task->scheduleTimeSpanTask();
     }
     task->SpanTime--;
  }, taskScheduler);
}

void runTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->runTask();
  taskScheduler->RunEveryTimeCopy = taskScheduler->RunEveryTime;
  //Serial.print("runTaskTicker:");
  //Serial.print(taskScheduler->RunEveryTime);
  taskScheduler->RunEveryTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->RunEveryTime);
     if(task->RunEveryTime == 0){
      //task->RunEveryTicker.detach();
      task->RunEveryTime = task->RunEveryTimeCopy;
      task->runTask();
     }
     task->RunEveryTime--;
  }, taskScheduler);
}

void runSpanTaskTicker(TaskScheduler* taskScheduler){
  taskScheduler->SpanRepeatTimeCopy = taskScheduler->SpanRepeatTime;
  //Serial.print("runSpanTaskTicker:");
  //Serial.print(taskScheduler->SpanRepeatTime);
  taskScheduler->SpanRepeatTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->SpanRepeatTime);
     if(task->SpanRepeatTime == 0){
      //task->SpanRepeatTicker.detach();
      task->SpanRepeatTime = task->SpanRepeatTimeCopy;
      task->runTask();
     }
     task->SpanRepeatTime--;
  }, taskScheduler);
}

void controlOnTicker(TaskScheduler* taskScheduler){
  //taskScheduler->controlOn();
  //Serial.print("controlOnTicker:");
  //Serial.print(taskScheduler->ControlOnTime);
  taskScheduler->ControlOnTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->ControlOnTime);
     if(task->ControlOnTime == 0){
      task->ControlOnTicker.detach();
      task->runTask();
     }
     task->ControlOnTime--;
  }, taskScheduler);
}

void controlOffTicker(TaskScheduler* taskScheduler){
  //taskScheduler->controlOff();
  //Serial.print("controlOffTicker:");
  //Serial.print(taskScheduler->ControlOffTime);
  taskScheduler->ControlOffTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->ControlOffTime);
     if(task->ControlOffTime == 0){
      task->ControlOffTicker.detach();
      task->controlOff();
     }
     task->ControlOffTime--;
  }, taskScheduler);
}

void scheduleTaskTicker(TaskScheduler* taskScheduler){
  //taskScheduler->scheduleTask();
  //Serial.print("scheduleTaskTicker:");
  //Serial.print(taskScheduler->ScheduleTime);
  taskScheduler->ScheduleTicker.attach(1, +[](TaskScheduler* task) {
     //Serial.print(",");
     //Serial.print(task->ScheduleTime);
     if(task->ScheduleTime == 0){
      task->ScheduleTicker.detach();
      task->scheduleTask();
     }
     task->ScheduleTime--;
      }, taskScheduler);
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
      schedule.scheduleTime = _channel.startTime + MID_NIGHT_SECONDS - current.totalCurrentTime + 1 ; //MID_NIGHT_SECONDS
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
  // we are starting later than ending next day
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
      //Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
      //_ticker.once(schedule.scheduleTime, scheduleTaskTicker, this);
      ScheduleTime = schedule.scheduleTime;
      ScheduleTicker.once(1, scheduleTaskTicker, this);
    }else{
      if(_channel.schedule.hotTimeHour == 0){
        //Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
        //_ticker.once(schedule.scheduleTime, scheduleTaskTicker, this);
        ScheduleTime = schedule.scheduleTime;
        ScheduleTicker.once(1, scheduleTaskTicker, this);
      }else{
        if(_channel.startTime + _channel.schedule.hotTimeHour >= current.totalCurrentTime){
          //Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleHotTask, this));
          //_tickerHot.once(schedule.scheduleTime, scheduleHotTaskTicker, this);
          ScheduleHotTime = schedule.scheduleTime;
          ScheduleHotTicker.once(1, scheduleHotTaskTicker, this);
        }
        if(schedule.scheduleTime > 1){
          //Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleHotTask, this));
          //_tickerHot.once(schedule.scheduleTime, scheduleHotTaskTicker, this);
          ScheduleHotTime = schedule.scheduleTime;
          ScheduleHotTicker.once(1, scheduleHotTaskTicker, this);

          //Alarm.timerOnce((schedule.scheduleTime + _channel.schedule.hotTimeHour), std::bind(&TaskScheduler::scheduleTask, this));
          //_ticker.once((schedule.scheduleTime + _channel.schedule.hotTimeHour), scheduleTaskTicker, this);
          ScheduleTime = schedule.scheduleTime + _channel.schedule.hotTimeHour;
          ScheduleTicker.once(1, scheduleTaskTicker, this);
        }else{
          if(_channel.startTime + _channel.schedule.hotTimeHour <= current.totalCurrentTime){
              //Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
              //_ticker.once(schedule.scheduleTime, scheduleTaskTicker, this);
              ScheduleTime = schedule.scheduleTime;
              ScheduleTicker.once(1, scheduleTaskTicker, this);
          }else{
            //Alarm.timerOnce((schedule.scheduleTime + _channel.startTime + _channel.schedule.hotTimeHour - current.totalCurrentTime), std::bind(&TaskScheduler::scheduleTask, this));
            //_ticker.once((schedule.scheduleTime + _channel.startTime + _channel.schedule.hotTimeHour - current.totalCurrentTime), scheduleTaskTicker, this);
            ScheduleTime = schedule.scheduleTime + _channel.startTime + _channel.schedule.hotTimeHour - current.totalCurrentTime;
            ScheduleTicker.once(1, scheduleTaskTicker, this);
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
    //Alarm.timerOnce(getTimeSpanStartTimeFromNow(), std::bind(&TaskScheduler::scheduleTimeSpanTask, this));
    //_tickerSpan.once(getTimeSpanStartTimeFromNow(), scheduleTimeSpanTaskTicker, this);
    SpanTime = getTimeSpanStartTimeFromNow();
    SpanTicker.once(1, scheduleTimeSpanTaskTicker, this);
  }else{
    //_timeEveryRepeat = Alarm.timerRepeat(_channel.schedule.runEvery, std::bind(&TaskScheduler::runTask, this));
    //_tickerEveryRepeat.attach(_channel.schedule.runEvery, runTaskTicker, this);
    RunEveryTime = _channel.schedule.runEvery;
    RunEveryTicker.once(1, runTaskTicker, this);
  }
  runTask();
 }

void TaskScheduler::scheduleHotTask(){
  //_timeHotHourRepeat = Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runHotTask, this));
  //_tickerHotHourRepeat.attach(TWENTY_FOUR_HOUR_DURATION, runHotTaskTicker, this);
  HotHourTaskTime = TWENTY_FOUR_HOUR_DURATION;
  HotHourTaskTicker.once(1, runHotTaskTicker, this);
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
    //Alarm.timerOnce(offSpan, std::bind(&TaskScheduler::stopHotTask, this));
    //_tickerHot.once(1, stopHotTaskTicker, this);
    OffHotHourTicker.once(1, stopHotTaskTicker, this);
  }
}

void TaskScheduler::stopHotTask(){
  _timeSpanActive = false;
  controlOff();
}

void TaskScheduler::scheduleTimeSpanTask(){
  //_timeSpanRepeat = Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runTask, this));
  //_tickerSpanRepeat.attach(TWENTY_FOUR_HOUR_DURATION, runTaskTicker, this);
  SpanRepeatTime = TWENTY_FOUR_HOUR_DURATION;
  SpanRepeatTicker.attach(1, runSpanTaskTicker, this);
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
      controlOn();;
    }
    else{
      //Alarm.timerOnce(getRandomOnTimeSpan(), std::bind(&TaskScheduler::controlOn, this));
      //_ticker.once(getRandomOnTimeSpan(), controlOnTicker, this);
      ControlOnTime = getRandomOnTimeSpan();
      ControlOnTicker.once(1, controlOnTicker, this);
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
        //Alarm.timerOnce(getScheduleTimeSpanOff(), std::bind(&TaskScheduler::controlOff, this));
        //_ticker.once(getScheduleTimeSpanOff(), controlOffTicker, this);
        ControlOffTime = getScheduleTimeSpanOff();
        ControlOffTicker.once(1, controlOffTicker, this);
      }else{
        if(!_channel.randomize){
          //Alarm.timerOnce(_channel.schedule.offAfter, std::bind(&TaskScheduler::controlOff, this));
          //_ticker.once(_channel.schedule.offAfter, controlOffTicker, this);
          ControlOffTime = _channel.schedule.offAfter;
          ControlOffTicker.once(1, controlOffTicker, this);
        }else{
           //Alarm.timerOnce(getRandomOffTimeSpan(), std::bind(&TaskScheduler::controlOff, this));
           //_ticker.once(getRandomOffTimeSpan(), controlOffTicker, this);
           ControlOffTime = getRandomOffTimeSpan();
           ControlOffTicker.once(1, controlOffTicker, this);
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
/*   Alarm.disable(_timeHotHourRepeat);
  Alarm.disable(_timeSpanRepeat);
  Alarm.disable(_timeEveryRepeat); */
  setScheduleTimes();
  overrideControlOff();
  setSchedule();
}

void TaskScheduler::tickerDetachAll(){
  //_tickerHotHourRepeat.detach();
  HotHourTaskTicker.detach();
  //_tickerEveryRepeat.detach();
  RunEveryTicker.detach();
  //_tickerSpanRepeat.detach();
  SpanRepeatTicker.detach();
}