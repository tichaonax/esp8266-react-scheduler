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
  tm *ltm = localtime(&t_now);
  restart.day = ltm->tm_mday;
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

void Automation::staticTickerCallbackTurnLedOn(Automation *pThis)
{
    pThis->turnLedOn();
}

void Automation::turnLedOn(){
  digitalWrite(LED, LED_ON);
  _blinkerHeartBeatOff.once(0.125, &Automation::staticTickerCallbackTurnLedOff, this);
}

void Automation::setSchedules(std::list<ScheduleTask>* scheduleTaskList){
    // check to see if NTP updated the local time
    if(!_validNTP){
        time_t t_now = time(nullptr);
        String dateText = ctime(&t_now); 
        int year = dateText.substring(dateText.lastIndexOf(" ")+1).toInt();
        if(year > 1970){
          _validNTP = true;
          _blinkerHeartBeat.detach();//.once(1.0, +[](){}); // disable fast blinker
          _blinkerHeartBeat.attach(2.0, &Automation::staticTickerCallbackTurnLedOn, this);  // and replace with normal    
          for(std::list<ScheduleTask>::iterator i = scheduleTaskList->begin(); i != scheduleTaskList->end();)
            {
                i->channelTaskScheduler->setSchedule();
                i++;
            }
          SystemRestart restart = getSystemRestart(t_now);

          if(restart.day == 1 && restart.restartTime > 0) {
            // reset the system midnight first of every month.
            _restartTicker.once(restart.restartTime, &Automation::staticTickerCallbackRestartSystemNow, this);
          }
        }
    }
}
