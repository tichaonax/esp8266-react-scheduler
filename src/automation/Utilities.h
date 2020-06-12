#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>

class Utilities {
public:
  String getLocalTime(){
    time_t now = time(0);
    return ctime(&now);
  }

  String getLocalNextRunTime(time_t delta){
    time_t now = time(0) + delta;
    return ctime(&now);
  }
};

extern Utilities Utils;  // make an instance for the user

#endif