#ifndef Automation_h
#define Automation_h
#include <ESP8266React.h>
#include <Ticker.h>

#include "./Utilities.h"
#include "./ChannelMqttSettingsService.h"
#include "./TaskScheduler.h"
#include "./ChannelStateService.h"
#include "./ChannelScheduleRestartService.h"
#include "./SystemStateService.h"

#ifdef LILYGO
  #define LED 25
#else
  #ifdef SONOFF
   #define LED 13 
  #else
   #define LED 2 
  #endif
#endif

#ifdef ESP32
  #ifdef LILYGO
     #define LED_ON !CONTROL_ON
  #define LED_OFF !CONTROL_OFF
  #else
    #define LED_ON CONTROL_ON
    #define LED_OFF CONTROL_OFF
  #endif
#elif defined(ESP8266)
  #define LED_ON !CONTROL_ON
  #define LED_OFF !CONTROL_OFF
#endif

struct ScheduleTask {
    TaskScheduler* channelTaskScheduler;
}; 

struct SystemRestart {
    int day;
    int restartTime;
};

class Automation {
    public:
 
    Automation();
    void setSchedules(std::list<ScheduleTask>* scheduleTaskList);
    void ntpSearch();

    private:

    Ticker _blinkerHeartBeat;
    Ticker _blinkerHeartBeatOff;
    Ticker _restartTicker;

    bool _validNTP;

    static void staticTickerCallbackChangeState(Automation *pThis);
    void changeState();
   
    static void staticTickerCallbackTurnLedOn(Automation *pThis);
    void turnLedOn();

    static void staticTickerCallbackTurnLedOff(Automation *pThis);
    void turnLedOff();

    static void staticTickerCallbackRestartSystemNow(Automation *pThis);
    void restartSystemNow();

    SystemRestart getSystemRestart(time_t t_now);

};

#endif
