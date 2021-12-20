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

#define LED 2  //On board LED

#ifdef ESP32
  #define LED_ON CONTROL_ON
  #define LED_OFF CONTROL_OFF
#elif defined(ESP8266)
  #define LED_ON !CONTROL_ON  // LED 2 is inverted
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
