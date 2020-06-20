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
                              bool  enableTimeSpan) :
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
                        enableTimeSpan)
                                       {
  };

void TaskScheduler::begin(){
    _channelStateService.begin();
}
void TaskScheduler::loop() {
    ESP.wdtFeed();
    // check to see if NTP updated the local time
    if(!_validNTP){
        int year = getCurrenYear();
        if(year != 70){
        _validNTP = true;
        setSchedule();
        }
    }
    // You need to call the Alarm.delay() to run the set alarms
    Alarm.delay(5);
}

ScheduledTime TaskScheduler::getNextRunTime(){
  ScheduledTime schedule;
  schedule.currentTime = time(nullptr);
  schedule.scheduleTime = 0;
  
  CurrentTime current = getCurrentTime();
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

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
  _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
}

void TaskScheduler::setSchedule(){
  time_t scheduleTime = 0;
  if(_channel.enabled){
    ScheduledTime schedule = getNextRunTime();
    if ( schedule.scheduleTime > 0 ){
      scheduleTime = schedule.scheduleTime;
      Alarm.timerOnce(scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
    }
    else{
      scheduleTask();
    }
    _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.nextRunTime =  Utils.getLocalNextRunTime(scheduleTime);
    Serial.print(_channel.name);
    Serial.print(": Task set to start at : ");
    digitalClockDisplay();
    return StateUpdateResult::CHANGED;
    }, _channel.name);
  } 
}

void TaskScheduler::scheduleTask(){
  if(_channel.enableTimeSpan){
    Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runTask, this));
  }else{
    Alarm.timerRepeat(_channel.schedule.runEvery, std::bind(&TaskScheduler::runTask, this));
  }
  runTask();  // run once initially on set
 }

bool TaskScheduler::shouldRunTask(){
  CurrentTime current = getCurrentTime();
  time_t currentTimeMinutes = current.hours + current.minutes;
  return(currentTimeMinutes >= _channel.startTime  && currentTimeMinutes <= _channel.endTime);
}

void TaskScheduler::runTask(){
  String nextRunTime = "";
  if(shouldRunTask()){
    controlOn();
    if(_channel.enableTimeSpan){
      nextRunTime =  Utils.getLocalNextRunTime(TWENTY_FOUR_HOUR_DURATION);
    }else{
      nextRunTime =  Utils.getLocalNextRunTime(_channel.schedule.runEvery);
    } 
  }else{
     if(_channel.enableTimeSpan){
      nextRunTime =  Utils.getLocalNextRunTime(TWENTY_FOUR_HOUR_DURATION);
    }else{
      nextRunTime =  Utils.getLocalNextRunTime(_channel.schedule.runEvery);
    } 
  }
    _channelStateService.update([&](ChannelState& channelState) {
    channelState.channel.nextRunTime = nextRunTime;  
    return StateUpdateResult::CHANGED;
    }, _channel.name);
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
        Alarm.timerOnce(getScheduleTimeSpan(), std::bind(&TaskScheduler::controlOff, this));
      }else{
        Alarm.timerOnce(_channel.schedule.offAfter, std::bind(&TaskScheduler::controlOff, this)); 
      }
    }
  }
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
  Serial.println(ctime(&tnow));
}

 void TaskScheduler::digitalClockDisplay(time_t tnow) {
  Serial.println(ctime(&tnow));
}

 uint8_t TaskScheduler::getCurrenYear(){
    time_t tnow = time(nullptr);
    struct tm *date = localtime(&tnow);
    return date->tm_year;
  }

time_t TaskScheduler::getScheduleTimeSpan(){
   CurrentTime current = getCurrentTime();
  if(_channel.startTime < _channel.endTime){
    return (_channel.endTime - current.totalCurrentTime);
  }else{
    return (MID_NIGHT_SECONDS + 1 - _channel.enabled + _channel.startTime);
  }
}