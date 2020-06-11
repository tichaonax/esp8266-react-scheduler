#ifndef TaskSchedulerWebSocketSync_h
#define TaskSchedulerWebSocketSync_h

#include <ESP8266HTTPClient.h>

class TaskSchedulerWebSocketSync {
    public:
    static void publishControlPinStateChange(String restChannelEndPoint, bool controlPin);

    private:
    static void readPinState(String restChannelEndPoint, bool controlPin);
};

#endif