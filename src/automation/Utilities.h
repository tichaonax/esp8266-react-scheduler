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

   uint8_t getCurrenYear(){
    time_t tnow = time(nullptr);
    struct tm *date = localtime(&tnow);
    return date->tm_year;
  }
};

extern Utilities Utils;  // make an instance for the user

#endif