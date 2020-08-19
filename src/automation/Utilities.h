#ifndef Utilities_h
#define Utilities_h

#include <ctime>
#include <HttpEndpoint.h>

class Utilities {
public:
  String eraseLineFeed(std::string str){
    str.erase(std::remove(str.begin(), str.end(), '\n'), str.end());
    return str.c_str();
  }

  String getLocalTime(){
    time_t now = time(0);
    return eraseLineFeed(ctime(&now));
  }

  String getLocalNextRunTime(time_t delta){
    time_t now = time(0) + delta;
    return eraseLineFeed(ctime(&now)); 
  }
};

extern Utilities Utils;  // make an instance for the user

#endif