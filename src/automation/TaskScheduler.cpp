#include <cstdlib>
#include "Utilities.h"
#include "Channels.h"
#include "TaskScheduler.h"

TaskScheduler::TaskScheduler(const TaskSchedulerConfig& config):
                             _channelStateService(ChannelStateConfig{
                                 .server = config.server,
                                 .securityManager = config.securityManager,
                                 .mqttClient = config.mqttClient,
                                 .fs = config.fs,
                                 .channelControlPin = config.channelControlPin,
                                 .channelJsonConfigPath = config.channelJsonConfigPath,
                                 .restChannelEndPoint = config.restChannelEndPoint,
                                 .webSocketChannelEndPoint = config.webSocketChannelEndPoint,
                                 .schedule = {
                                     .runEvery = config.runEvery,
                                     .offAfter = config.offAfter,
                                     .startTimeHour = config.startTimeHour,
                                     .startTimeMinute = config.startTimeMinute,
                                     .endTimeHour = config.endTimeHour,
                                     .endTimeMinute = config.endTimeMinute,
                                     .enabled = config.enabled,
                                     .enableTimeSpan = config.enableTimeSpan,
                                     .randomize = config.randomize,
                                     .hotTimeHour = config.hotTimeHour,
                                     .overrideTime = config.overrideTime,
                                     .enableMinimumRunTime = config.enableMinimumRunTime
                                 },
                                 .channel = {
                                     .name = config.channelName,
                                     .homeAssistantTopicType = config.homeAssistantTopicType,
                                     .homeAssistantIcon = config.homeAssistantIcon,
                                     .enableRemoteConfiguration = config.enableRemoteConfiguration,
                                     .masterIPAddress = config.masterIPAddress,
                                     .restChannelRestartEndPoint = config.restChannelRestartEndPoint
                                 },
                                 .dateRange = {
                                     .enableDateRange = config.enableDateRange,
                                     .activeOutsideDateRange = config.activeOutsideDateRange,
                                     .activeStartDateRange = config.activeStartDateRange,
                                     .activeEndDateRange = config.activeEndDateRange,
                                     .weekDays = config.weekDays
                                 },
                                 .system = {
                                     .buildVersion = config.buildVersion,
                                     .autoRebootSystem = config.autoRebootSystem
                                 },
                                 .channelMqttSettingsService = config.channelMqttSettingsService
                             }) {

                              _isHotScheduleActive = false;
                              _isOverrideActive = false;

    _channelStateService.addUpdateHandler([&](const String& originId) {
    if(_channelStateService.getChannel().schedule.isOverride){
    this->setOverrideTime();
    }  
    }, false);
}

TaskScheduler::TaskScheduler(AsyncWebServer* server,
                             SecurityManager* securityManager,
                             AsyncMqttClient* mqttClient,
                             FS* fs,
                             uint8_t channelControlPin,
                             const char* channelJsonConfigPath,
                             String restChannelEndPoint,
                             const char* webSocketChannelEndPoint,
                             float runEvery,
                             float offAfter,
                             int startTimeHour,
                             int startTimeMinute,
                             int endTimeHour,
                             int endTimeMinute,
                             bool enabled,
                             String channelName,
                             bool enableTimeSpan,
                             ChannelMqttSettingsService* channelMqttSettingsService,
                             bool randomize,
                             float hotTimeHour,
                             float overrideTime,
                             bool enableMinimumRunTime,
                             uint8_t homeAssistantTopicType,
                             String homeAssistantIcon,
                             bool enableRemoteConfiguration,
                             String masterIPAddress,
                             String restChannelRestartEndPoint,
                             bool enableDateRange,
                             bool activeOutsideDateRange,
                             String activeStartDateRange,
                             String activeEndDateRange,
                             String buildVersion,
                             String weekDays,
                             bool autoRebootSystem):
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
                                                 restChannelRestartEndPoint,
                                                 enableDateRange,
                                                 activeOutsideDateRange,
                                                 activeStartDateRange,
                                                 activeEndDateRange,
                                                 buildVersion,
                                                 weekDays,
                                                 autoRebootSystem) {

                              _isHotScheduleActive = false;
                              _isOverrideActive = false;

    _channelStateService.addUpdateHandler([&](const String& originId) {
    if(_channelStateService.getChannel().schedule.isOverride){
    this->setOverrideTime();
    }  
    }, false);
}

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
    channelState.channel.controlOffDateTime = _utilities.strDeltaLocalTime(ControlOffTime);
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
   TimeManager::CurrentTime currentTime = _timeManager.getCurrentTime();
    ScheduleTime = _channel.schedule.runEvery - (currentTime.minutesInSec % _channel.schedule.runEvery);
  }
  ScheduleTicker.attach(1, +[](TaskScheduler* task) {
    task->ScheduleTime--;
    if(task->ScheduleTime <= 0){
      task->ScheduleTicker.once(0.010, +[](TaskScheduler* once){once->scheduleRunEveryTask();}, task);
    }
  }, this);
}

bool TaskScheduler::isScheduleWithInDateRange(String activeStartDateRange,
  String activeEndDateRange, bool enableDateRange, bool activeOutsideDateRange, time_t currentTime) {

  if (!enableDateRange || _isOverrideActive){
    return true;
  }

  DateRange dateRange = _utilities.getActiveDateRange(activeStartDateRange, activeEndDateRange, currentTime);
  if(!dateRange.valid){
    return true;
  }

  bool inBetween = (dateRange.startDate <= currentTime) && (dateRange.endDate >= currentTime);

  if(!activeOutsideDateRange){
    return inBetween;
  }

  return (activeOutsideDateRange && !inBetween);
}

ScheduledTime TaskScheduler::getNextRunTime() {
  // Early return if channel is disabled to avoid unnecessary calculations
  if (!_channel.enabled) {
    ScheduledTime emptySchedule = {};
    return emptySchedule;
  }

  ScheduleCalculationParams params = buildScheduleParams();
  
  ScheduledTime schedule = _utilities.getScheduleTimes(
    params.startTime, params.endTime, params.hotTimeHour,
    params.enableTimeSpan, params.isHotScheduleActive, params.channelName,
    params.randomize, _isOverrideActive, params.enableMinimumRunTime);

  schedule.isWithInDateRange = isScheduleWithInDateRange(
    params.activeStartDateRange, params.activeEndDateRange,
    params.enableDateRange, params.activeOutsideDateRange, schedule.currentTime);

  return schedule;
}

ScheduleCalculationParams TaskScheduler::buildScheduleParams() const {
  return {
    .startTime = _channel.startTime,
    .endTime = _channel.endTime,
    .hotTimeHour = _channel.schedule.hotTimeHour,
    .enableTimeSpan = _channel.enableTimeSpan,
    .isHotScheduleActive = _channel.isHotScheduleActive,
    .channelName = _channel.name,
    .randomize = _channel.randomize,
    .enableMinimumRunTime = _channel.enableMinimumRunTime,
    .activeStartDateRange = _channel.activeStartDateRange,
    .activeEndDateRange = _channel.activeEndDateRange,
    .enableDateRange = _channel.enableDateRange,
    .activeOutsideDateRange = _channel.activeOutsideDateRange
  };
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
        task->getChannelHomeAssistantTopicType(),
        task->getChannelEnableDateRange()
      );
    }
  }, this);
}

void TaskScheduler::scheduleButtonRead(bool bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn){
  ToggleButtonState = HIGH;
  LED = blinkLed;
  LED_ON =ledOn;
  BToggleSwitch = bToggleSwitch;

  ScheduleButtonTicker.attach(0.250, +[](TaskScheduler* task) {
    task->buttonReadCallback();
  }, this);
}

void TaskScheduler::buttonReadCallback() {
  bool bControlOnState = _channelStateService.getChannel().controlOn;
  if(bControlOnState) {
    digitalWrite(LED, LED_ON);
  }
  if(BToggleSwitch) {
    ScheduleButtonDebounceTicker.once(0.050, +[](TaskScheduler* task) {
      task->buttonDebounceCallback();
    }, this);
  }
}

void TaskScheduler::buttonDebounceCallback() {
  ToggleReadPinValue = digitalRead(_toggleReadPin);
  if (ToggleReadPinValue != ToggleButtonState) {
    ToggleButtonState = ToggleReadPinValue;
    if (ToggleButtonState == LOW) {
      toggleSwitch();
    }
  }
}

void TaskScheduler::setSchedule(bool isReschedule){
  digitalClockDisplay();
  _isReschedule = isReschedule;
  reScheduleTasks();
  if(_channel.enabled){
    ScheduledTime schedule = getNextRunTime();
    printSchedule(schedule);
    if (schedule.scheduleTime <= 0) { schedule.scheduleTime = 1; } 
    ScheduleTime = schedule.scheduleTime;

    if(schedule.isHotSchedule){scheduleHotTaskTicker(schedule);}

    if(schedule.isSpanSchedule){
      scheduleTimeSpanTaskTicker(schedule);
    }else{
      scheduleTaskTicker(schedule);    
    }

    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.lastStartedChangeTime = _utilities.strLocalTime();
      channelState.channel.nextRunTime = _utilities.strDeltaLocalTime(schedule.scheduleTime);
      channelState.channel.enableDateRange = _channel.enableDateRange;
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
  ScheduledTime scheduleTime = getNextRunTime();
  bool canTaskRunToday = _utilities.canTaskRunToday(_channel, scheduleTime);
  if(_channel.enabled && canTaskRunToday){
    _isHotScheduleActive = true;
    OffHotHourTime = scheduleTime.scheduleHotTimeEndDateTime - scheduleTime.currentTime;
    if(scheduleTime.isHotScheduleAdjust){
      OffHotHourTime = OffHotHourTime - TWENTY_FOUR_HOUR_DURATION;
    }
    if(OffHotHourTime < 1) { OffHotHourTime = 1; _isHotScheduleActive = false;}

    if(OffHotHourTime > 1){
      _channelStateService.update([&](ChannelState& channelState) {
        channelState.channel.isHotScheduleActive = true;
        channelState.channel.controlOn = true;
        channelState.channel.lastStartedChangeTime =  _utilities.strLocalTime();
        channelState.channel.offHotHourDateTime = _utilities.strDeltaLocalTime(OffHotHourTime);
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
  channelState.channel.nextRunTime = _utilities.strDeltaLocalTime(delta);;  
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
  // Debug output removed for production firmware size optimization
}

void TaskScheduler::runTask(){
  ScheduledTime scheduleTime = getNextRunTime();
  if(!_channel.enabled){
    return;
  }

  bool canTaskRunToday = _utilities.canTaskRunToday(_channel, scheduleTime);

  if(scheduleTime.isRunTaskNow && canTaskRunToday){
    if(!_channel.randomize || (_channel.randomize && _channel.enableTimeSpan)){
      controlOn();
    }
    else{
      _controlOnTime = getRandomOnTimeSpan();
      ControlOnTime = _controlOnTime;
      updateStatus(ControlOnTime);
      controlOnTicker();
    }
  }else{
    updateStatus(scheduleTime.scheduleTime);
  }
}

void TaskScheduler::controlOn(){
  if(_channel.enabled && !_isOverrideActive){
    _channelStateService.update([&](ChannelState& channelState) {
      channelState.channel.controlOn = true;
      channelState.channel.lastStartedChangeTime =  _utilities.strLocalTime();
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
      channelState.channel.lastStartedChangeTime = _utilities.strLocalTime();
      return StateUpdateResult::CHANGED;
    }, _channel.name);

    updateNextRunStatus();
}

void TaskScheduler::controlOff(){
  if(!_isOverrideActive){
    overrideControlOff();
  }
}

void TaskScheduler::setToggleSwitch(bool bToggleSwitch, int toggleReadPin, int blinkLed, int ledOn){
  _toggleReadPin = toggleReadPin;

  if(bToggleSwitch){
    pinMode(toggleReadPin, INPUT_PULLUP);
  }
  scheduleButtonRead(bToggleSwitch, toggleReadPin, blinkLed, ledOn);
}

void TaskScheduler::toggleSwitch(){
  _isOverrideActive = false;
  bool bSwitchState = _channelStateService.getChannel().controlOn;
  if(bSwitchState){
    controlOff();
  }else{
    controlOn();
  }
   setOverrideTime();
}

void TaskScheduler::digitalClockDisplay() {
  // Debug output removed for production firmware size optimization
}

void TaskScheduler::digitalClockDisplay(time_t tnow) {
  // Debug output removed for production firmware size optimization
}

int TaskScheduler::getScheduleTimeSpanOff(){
  int next = 1;
 TimeManager::CurrentTime current = _timeManager.getCurrentTime();
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
  uint8_t homeAssistantTopicType,
  bool enableDateRange
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
  _channelStateService.mqttRepublish(controlPin, homeAssistantTopicType);
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
            once->getChannelHomeAssistantTopicType(),
            once->getChannelEnableDateRange()
          );
        }, task);
    }
  }, this);
}

uint8_t TaskScheduler::getChannelControlPin(){
  return _channelStateService.getChannel().controlPin;
}

uint8_t TaskScheduler::getChannelHomeAssistantTopicType(){
  return _channelStateService.getChannel().homeAssistantTopicType;
}

bool TaskScheduler::getChannelEnableDateRange(){
  return _channelStateService.getChannel().enableDateRange;
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