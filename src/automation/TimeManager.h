#ifndef TIMEMANAGER_H
#define TIMEMANAGER_H

#include <ctime>

class TimeManager {
public:
    struct CurrentTime {
        int minutesInSec;
        int totalCurrentTimeInSec;
    };

    CurrentTime getCurrentTime() {
        CurrentTime current;
        time_t curr_time = time(nullptr);
        tm *tm_local = localtime(&curr_time);
        current.minutesInSec = 60 * tm_local->tm_min;
        current.totalCurrentTimeInSec = 3600 * tm_local->tm_hour + current.minutesInSec + tm_local->tm_sec;
        return current;
    }

    void digitalClockDisplay() {
        time_t now = time(nullptr);
        digitalClockDisplay(now);
    }

    void digitalClockDisplay(time_t tnow) {
        tm *tm_local = localtime(&tnow);
        // Display the time in a human-readable format
    }
};

#endif