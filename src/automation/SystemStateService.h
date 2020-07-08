#ifndef SystemStateService_h
#define SystemStateService_h

#include <ctime>
#include <HttpEndpoint.h>
#include <WebSocketTxRx.h>
#include <Ticker.h>

#include "Utilities.h"
#define SYSTEM_STATE_ENDPOINT_PATH "/rest/systemState"
#define SYSTEM_STATE_SOCKET_PATH "/ws/systemState"

struct System {
  tm localTime;
  String localDateTime;
}; 

class SystemState {
 public:
  System systemState;
  
    static void read(SystemState& systemState, JsonObject& jsonObject) {
    time_t tnow = time(nullptr);
    struct tm *date = localtime(&tnow);

    JsonObject localTime = jsonObject.createNestedObject("localTime");
    localTime["tm_sec"] = date->tm_sec;		/* seconds after the minute [0-60] */
	  localTime["tm_min"] = date->tm_min;		/* minutes after the hour [0-59] */
	  localTime["tm_hour"] = date->tm_hour;	/* hours since midnight [0-23] */

    jsonObject["localDateTime"] = Utils.eraseLineFeed(ctime(&tnow));
  }

  static StateUpdateResult update(JsonObject& root, SystemState& settings) {
      return StateUpdateResult::CHANGED;
  }
};

class SystemStateService : public StatefulService<SystemState> {
 public:
  SystemStateService(AsyncWebServer* server, SecurityManager* securityManager);
  void begin();

 private:
  HttpEndpoint<SystemState> _httpEndpoint;
  WebSocketTxRx<SystemState> _webSocket;
  Ticker _systemHeartBeat;

  void registerConfig();
  void onConfigUpdated();
  void changeState();
};
#endif