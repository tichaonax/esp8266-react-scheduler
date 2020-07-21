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
                              bool randomize) :
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
                        randomize)
                                       {
  };

void TaskScheduler::begin(){
    _channelStateService.begin();
}
void TaskScheduler::loop(){ 
    Alarm.delay(0);
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
  if( (current.totalCurrentTime > _channel.startTime) || (current.totalCurrentTime < _channel.endTime)){
    schedule.scheduleTime = 0;
  }else{ 
      schedule.scheduleTime = _channel.startTime - current.totalCurrentTime;
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
  Serial.print("Current Time:");
  digitalClockDisplay();
  Serial.print(_channel.name);

  if(_channel.enabled){
    ScheduledTime schedule = getNextRunTime();
    if (schedule.scheduleTime <= 0) { schedule.scheduleTime = 1; } 
    Serial.print(": Time to next task run: ");
    Serial.print(schedule.scheduleTime);
    Serial.println("s");
    
    Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
    
    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.nextRunTime = Utils.getLocalNextRunTime(getNextRunTime().scheduleTime);
      Serial.print("Task set to start at : ");
      Serial.println(channelState.channel.nextRunTime);
      return StateUpdateResult::CHANGED;
    }, _channel.name);
  }else{
    Serial.println(": Task is DISABLED.");
  } 
}

void TaskScheduler::scheduleTask(){
  if(_channel.enableTimeSpan){
    Alarm.timerOnce(getTimeSpanStartTimeFromNow(), std::bind(&TaskScheduler::scheduleTimeSpanTask, this));
  }else{
    _timerRepeat = Alarm.timerRepeat(_channel.schedule.runEvery, std::bind(&TaskScheduler::runTask, this));
  }
  runTask();  // run once initially on set
 }

void TaskScheduler::scheduleTimeSpanTask(){
  _timerRepeat = Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runTask, this));
  runTask();
}

bool TaskScheduler::shouldRunTask(){
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
      Alarm.timerOnce(getRandomOnTimeSpan(), std::bind(&TaskScheduler::controlOn, this));
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
        Alarm.timerOnce(getScheduleTimeSpanOff(), std::bind(&TaskScheduler::controlOff, this));
      }else{
        if(!_channel.randomize){
          Alarm.timerOnce(_channel.schedule.offAfter, std::bind(&TaskScheduler::controlOff, this));
        }else{
           Alarm.timerOnce(getRandomOffTimeSpan(), std::bind(&TaskScheduler::controlOff, this));
        }
      }
    }
  }
  updateNextRunStatus();
}

void TaskScheduler::controlOff(){
  if(!_channel.schedule.isOverride){
    _channelStateService.update([&](ChannelState& channelState) {
      if (!channelState.channel.controlOn) {
        return StateUpdateResult::UNCHANGED;
      }
      channelState.channel.controlOn = false;
      channelState.channel.lastStartedChangeTime =  Utils.getLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);
    updateNextRunStatus();
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
  Alarm.disable(_timerRepeat);
  setScheduleTimes();
  controlOff();
  setSchedule();
}