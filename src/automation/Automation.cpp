#include "Automation.h"

Automation::Automation()
        {           
          _validNTP = false;
          pinMode(LED, OUTPUT);
        };

SystemRestart Automation::getSystemRestart(time_t t_now){
  struct tm *lt = localtime(&t_now);
  lt->tm_hour = 0;
  lt->tm_min = 0;
  lt->tm_sec = 0;

  time_t midNightToday = mktime(lt);
  SystemRestart restart;
  restart.restartTime = TWENTY_FOUR_HOUR_DURATION + midNightToday - t_now;
  restart.monthDay = lt->tm_mday;
  return(restart);
}

void Automation::staticTickerCallbackRestartSystemNow(Automation *pThis)
{
    pThis->restartSystemNow();
}

void Automation::restartSystemNow() {
    WiFi.disconnect(true);
    delay(500);
    ESP.restart();
  }

void Automation::ntpSearch(){
    _blinkerHeartBeat.attach(0.125, &Automation::staticTickerCallbackChangeState, this);
}

void Automation::staticTickerCallbackChangeState(Automation *pThis)
{
    pThis->changeState();
}

void Automation::changeState()
{
  digitalWrite(LED, !(digitalRead(LED)));
}

void Automation::staticTickerCallbackTurnLedOff(Automation *pThis)
{
    pThis->turnLedOff();
}

void Automation::turnLedOff(){
  digitalWrite(LED, LED_OFF);
}

void Automation::resetSystem(time_t restartTime){
  _bRebootScheduled = true;
  _restartTicker.once(restartTime , &Automation::staticTickerCallbackRestartSystemNow, this);
}

void Automation::staticTickerCallbackTurnLedOn(Automation *pThis)
{
  pThis->turnLedOn();
  if(pThis->_bAutoRebootSystem){
    //check to see if we need a system reboot
    time_t t_now = time(nullptr);
    SystemRestart restart = pThis->getSystemRestart(t_now);
    //schedule reset the system one hour after midnight on first of every month
    if(restart.monthDay == 1 && !pThis->_bRebootScheduled && restart.restartTime > 0 && restart.restartTime <= 10){
      pThis->resetSystem(ONE_HOUR_DURATION + restart.restartTime);
    }
  }
}

void Automation::turnLedOn(){
  digitalWrite(LED, LED_ON);
  _blinkerHeartBeatOff.once(0.125, &Automation::staticTickerCallbackTurnLedOff, this);
}

void Automation::setSchedules(std::list<ScheduleTask>* scheduleTaskList){
    // check to see if NTP updated the local time
    if(!_validNTP){
      _bRebootScheduled = false;
      time_t t_now = time(nullptr);
      String dateText = ctime(&t_now); 
      int year = dateText.substring(dateText.lastIndexOf(" ")+1).toInt();
      if(year > 1970){
        _validNTP = true;
        _blinkerHeartBeat.detach();
        _blinkerHeartBeat.attach(2.0, &Automation::staticTickerCallbackTurnLedOn, this);    
        for(std::list<ScheduleTask>::iterator i = scheduleTaskList->begin(); i != scheduleTaskList->end();)
          {
            i->channelTaskScheduler->setSchedule();
            i->channelTaskScheduler->setToggleSwitch(
              i->bToggleSwitch,
              i->toggleReadPin,
              i->blinkLed,
              i->ledOn);
              _bAutoRebootSystem = i->bAutoRebootSystem;
            i++;
          }
      }
    }
}
