#include <cstdlib>
#include "Utilities.h"
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
   return getTimeSpanSchedule(schedule);
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
    return schedule;
  }
  // we are starting later than ending next day
  if( (current.totalCurrentTime > _channel.startTime) || (current.totalCurrentTime < _channel.endTime)){
    schedule.scheduleTime = 0;
  }else{ 
      schedule.scheduleTime = _channel.startTime - current.totalCurrentTime;
  }
  
  return schedule;
}

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
  _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
}

void TaskScheduler::setSchedule(){
  time_t scheduleTime = 0;
  if(_channel.enabled){
    ScheduledTime schedule = getNextRunTime();
    Serial.println("");
    Serial.print("Current Time:");
    digitalClockDisplay();
    Serial.print("Time to next task run: ");
    Serial.print(schedule.scheduleTime);
    Serial.println("s");
    if ( schedule.scheduleTime > 0 ){
      scheduleTime = schedule.scheduleTime;
      _alarmScheduler = Alarm.timerOnce(scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
    }
    else{
       _alarmScheduler = Alarm.timerOnce(1, std::bind(&TaskScheduler::scheduleTask, this));
    }
    _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.nextRunTime =  Utils.getLocalNextRunTime(scheduleTime);
    Serial.print(_channel.name);
    Serial.print(": Task set to start at : ");
    Serial.println(channelState.channel.nextRunTime);
    return StateUpdateResult::CHANGED;
    }, _channel.name);
  } 
}

void TaskScheduler::scheduleTask(){
  Alarm.disable(_alarmScheduler);
  if(_channel.enableTimeSpan){
    _alarmRepeat = Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runTask, this));
  }else{
    _alarmRepeat = Alarm.timerRepeat(_channel.schedule.runEvery, std::bind(&TaskScheduler::runTask, this));
  }
  runTask();  // run once initially on set
 }

bool TaskScheduler::shouldRunTask(){
  CurrentTime current = getCurrentTime();
  time_t currentTime = current.hours + current.minutes;
  if(_channel.startTime < _channel.endTime){
    return(currentTime >= _channel.startTime  && currentTime <= _channel.endTime);
  }
  return(currentTime >= _channel.startTime || currentTime <= _channel.endTime);
}

void TaskScheduler::updateNextRunStatus(String nextRunTime){
   _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.nextRunTime = nextRunTime;  
    return StateUpdateResult::CHANGED;
    }, _channel.name);
}

time_t TaskScheduler::getRandomOnTimeSpan(){
  return(rand() % (_channel.schedule.runEvery - _channel.schedule.offAfter));
}

time_t TaskScheduler::getRandomOffTimeSpan(){
 return(rand() % (_channel.schedule.offAfter));
}

void TaskScheduler::runTask(){
  if(shouldRunTask()){
    if(!_channel.randomize){
      controlOn();
    }
    else{
      _alarmSwitch = Alarm.timerOnce(getRandomOnTimeSpan(), std::bind(&TaskScheduler::controlOn, this));
    }
  }else{
    String nextRunTime = "";
    if(_channel.enableTimeSpan){
      nextRunTime =  Utils.getLocalNextRunTime(TWENTY_FOUR_HOUR_DURATION);
    }else{
      nextRunTime =  Utils.getLocalNextRunTime(_channel.schedule.runEvery);
    } 
    updateNextRunStatus(nextRunTime);
  }
}

void TaskScheduler::controlOn(){
  Alarm.disable(_alarmSwitch);
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
        _alarmSwitch = Alarm.timerOnce(getScheduleTimeSpan(), std::bind(&TaskScheduler::controlOff, this));
      }else{
        if(!_channel.randomize){
          _alarmSwitch = Alarm.timerOnce(_channel.schedule.offAfter, std::bind(&TaskScheduler::controlOff, this));
        }else{
           _alarmSwitch = Alarm.timerOnce(getRandomOffTimeSpan(), std::bind(&TaskScheduler::controlOff, this));
        }
      }
    }
  }
    String nextRunTime = "";
    if(_channel.enableTimeSpan){
      nextRunTime =  Utils.getLocalNextRunTime(TWENTY_FOUR_HOUR_DURATION);
    }else{
      nextRunTime =  Utils.getLocalNextRunTime(_channel.schedule.runEvery);
    } 
  updateNextRunStatus(nextRunTime);
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
  }
}

 void TaskScheduler::digitalClockDisplay() {
  time_t tnow = time(nullptr);
  Serial.print(ctime(&tnow));
}

 void TaskScheduler::digitalClockDisplay(time_t tnow) {
  Serial.println(ctime(&tnow));
}

time_t TaskScheduler::getScheduleTimeSpan(){
  CurrentTime current = getCurrentTime();
  if(_channel.startTime < _channel.endTime){
    return (_channel.endTime - current.totalCurrentTime);
  }
  if(current.totalCurrentTime < _channel.endTime){
    return(_channel.endTime - current.totalCurrentTime);
  }
  return (MID_NIGHT_SECONDS + 1 - current.totalCurrentTime + _channel.endTime);
}

ScheduledTime TaskScheduler::getTimeSpanSchedule(ScheduledTime& schedule){
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

void TaskScheduler::resetSchedule(){
  Serial.print("Resetting schedule for channel: ");
  Serial.println(_channel.name);

  Alarm.disable(_alarmScheduler);
  Alarm.disable(_alarmRepeat);
  Alarm.disable(_alarmSwitch);

  begin();
  setScheduleTimes();
  setSchedule();
}