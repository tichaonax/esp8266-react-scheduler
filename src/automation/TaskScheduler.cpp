#include "TaskScheduler.h"

TaskScheduler::TaskScheduler(AsyncWebServer* server,
                              SecurityManager* securityManager,
                              AsyncMqttClient* mqttClient,
                              FS* fs,
                              int channelControlPin,
                              char* channelJsonConfigPath,  
                              String defaultChannelName,
                              String restChannelEndPoint,
                              char* webSocketChannelEndPoint) :
    _channelStateService(server,
                        securityManager,
                        mqttClient,
                        fs,
                        channelControlPin,
                        channelJsonConfigPath,
                        defaultChannelName,
                        restChannelEndPoint,
                        webSocketChannelEndPoint)
                                       {
  };

void TaskScheduler::begin(){
    _channelStateService.begin();
}
void TaskScheduler::loop() {
    // check to see if NTP updated the local time
    if(!getIsNewDate()){
        int year = getCurrenYear();
        if(year != 70){
        setIsNewDate(true);
        setSchedule();
        }
    }
    // You need to call the Alarm.delay() to run the set alarms
    Alarm.delay(0);
}

ScheduledTime TaskScheduler::getNextRunTime(){
  Serial.print("Next Run Time Task for channel : ");
  Serial.println(_channel.name);
  ScheduledTime schedule;
  schedule.currentTime = time(nullptr);
  schedule.scheduleTime = 0;
  
  CurrentTime current = getCurrentTime();
  Serial.println(current.hours);
  Serial.println(current.minutes);
  Serial.println(current.seconds);
  
  Serial.print("current.totalCurrentTime =>");
  Serial.println(current.totalCurrentTime);
  Serial.print("channel.startTime =>");
  Serial.println(_channel.startTime);
  Serial.print("channel.endTime =>");
  Serial.println(_channel.endTime);
  Serial.print("current.minutes =>");
  Serial.println(current.minutes);
  Serial.print("current.hours =>");
  Serial.println(current.hours);

  if(current.totalCurrentTime > _channel.endTime){
    Serial.println("if(current.totalCurrentTime > channel.endTime)");
    schedule.scheduleTime = _channel.startTime + MID_NIGHT_SECONDS - current.totalCurrentTime + 1 ; //MID_NIGHT_SECONDS
    } 
  else if(current.totalCurrentTime < _channel.startTime){ 
    Serial.println("if(current.totalCurrentTime < channel.startTime)");
    schedule.scheduleTime = _channel.startTime -  current.totalCurrentTime;
  }
  else {
    if(current.minutes < _channel.schedule.startTimeMinute){
      Serial.println("if(current.minutes < channel.schedule.startTimeMinute) =>");
       if((current.minutes + _channel.schedule.runEvery) < _channel.schedule.startTimeMinute){
        Serial.println("(current.minutes + channel.schedule.runEvery) < channel.schedule.startTimeMinute)");
        schedule.scheduleTime = ceil(current.minutes/_channel.schedule.runEvery) * _channel.schedule.runEvery  + _channel.schedule.runEvery - current.minutes - current.seconds;
      }else{
        Serial.println("(current.minutes + channel.schedule.runEvery) > channel.schedule.startTimeMinute)");
        schedule.scheduleTime = _channel.schedule.startTimeMinute - current.minutes - current.seconds;
      }
    }else if(current.minutes > _channel.schedule.startTimeMinute){
      Serial.println("if(current.minutes > channel.schedule.startTimeMinute))");
      if((current.minutes + _channel.schedule.runEvery) > 3600){
        Serial.println("(current.minutes + channel.schedule.startTimeMinute)) > 3600)");
        schedule.scheduleTime =  3600 - current.minutes - current.seconds;
      }else{
        Serial.println("(current.minutes + channel.schedule.startTimeMinute) < 3600)");
        if((current.minutes + _channel.schedule.runEvery) < _channel.schedule.startTimeMinute){
          Serial.println("(current.minutes + channel.schedule.runEvery) < channel.schedule.startTimeMinute)");
          schedule.scheduleTime = ceil(current.minutes/_channel.schedule.runEvery) * _channel.schedule.runEvery  + _channel.schedule.runEvery - current.minutes - current.seconds;
        }else{
          Serial.println("(current.minutes + channel.schedule.runEvery) > channel.schedule.startTimeMinute)");
          schedule.scheduleTime = _channel.schedule.startTimeMinute + _channel.schedule.runEvery - current.minutes  + current.seconds;
        }        
      }
    }else{
      // start the schedule now
      Serial.println("start now =>");
      schedule.scheduleTime = 0;
    } 
  }
   return schedule;
}

void TaskScheduler::setScheduleTimes(){
  _channel = _channelStateService.getChannel();
  if(_channel.enabled){
    _channel.startTime = _channel.schedule.startTimeHour + _channel.schedule.startTimeMinute;
    _channel.endTime = _channel.schedule.endTimeHour + _channel.schedule.endTimeMinute;
    Serial.println("");
    Serial.print("Set Schedule Settings for > ");
    Serial.println(_channel.name);
    Serial.print("controlOn: ");
    Serial.println(_channel.controlOn);
    Serial.print("runEvery: ");
    Serial.println(_channel.schedule.runEvery);
    Serial.print("offAfter: ");
    Serial.println(_channel.schedule.offAfter);
    Serial.print("startTime: ");
    Serial.println(_channel.startTime);
    Serial.print("endTime: ");
    Serial.println(_channel.endTime);
  }
}

void TaskScheduler::setSchedule(){
  if(_channel.enabled){
    digitalClockDisplay();
    Serial.print("Setting schedule for channel : ");
    Serial.println(_channel.name);
    ScheduledTime schedule = getNextRunTime();
    Serial.print("Scheduled to stat at => ");
    Serial.println(schedule.scheduleTime);
    digitalClockDisplay(schedule.currentTime + schedule.scheduleTime);

    if ( schedule.scheduleTime > 0 ){
      Alarm.timerOnce(schedule.scheduleTime, std::bind(&TaskScheduler::scheduleTask, this));
    }
    else{
      scheduleTask();
    } 
  }
}

void TaskScheduler::scheduleTask(){
  if(_channel.enableTimeSpan){
    Alarm.timerRepeat(TWENTY_FOUR_HOUR_DURATION, std::bind(&TaskScheduler::runTask, this));  // periodic schedule
  }else{
    Alarm.timerRepeat(_channel.schedule.runEvery, std::bind(&TaskScheduler::runTask, this));  // onde a day
  }

  Serial.print("Schedule Task for channel : ");
  Serial.println(_channel.name);
  runTask();  // run once initially on set
  digitalClockDisplay();
}

bool TaskScheduler::shouldRunTask(){
  CurrentTime current = getCurrentTime();
  time_t currentTimeMinutes = current.hours + current.minutes;
  return(currentTimeMinutes >= _channel.startTime  && currentTimeMinutes <= _channel.endTime);
}

void TaskScheduler::runTask(){
  if(shouldRunTask()){
    Serial.print("Control Scheduler started => ");
    digitalClockDisplay();
    controlOn();
  }else{
    Serial.print("Task for channel : ");
    Serial.println(_channel.name);
    Serial.print("Control system outside run window at:  ");
    digitalClockDisplay();
  }
}

void TaskScheduler::controlOn(){
  if(_channel.enabled){
    if(!_channel.schedule.isOverride){
      _channelStateService.update([&](ChannelState& channelState) {
      if (channelState.channel.controlOn) {
        return StateUpdateResult::UNCHANGED;
      }
        channelState.channel.controlOn = true;
        Serial.print(_channel.name);
        Serial.print(": Task started at: ");
        digitalClockDisplay();
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
      Serial.print(_channel.name);
      Serial.print(": Task stopped at: ");
      digitalClockDisplay();
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