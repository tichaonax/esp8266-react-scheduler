
//#include <ESP8266React.h>
#include <ESPAsyncWebServer.h>
#include <LittleFS.h>
#include "./automation/Automation.h"
#include "./automation/Schedules.h"

#define SERIAL_BAUD_RATE 115200

AsyncWebServer server(80);
ESP8266React esp8266React(&server);


#if defined(TOGGLE_READ_PIN)
boolean bToggleSwitch = true;
#else
#ifndef TOGGLE_READ_PIN
#define TOGGLE_READ_PIN 0
#endif
boolean bToggleSwitch = false;
#endif

Automation automation = Automation();
//Schedules schedules = Schedules(&automation);


void setup()
{

    // start serial and filesystem
    Serial.begin(SERIAL_BAUD_RATE);

    automation.ntpSearch();
    // start the framework and demo project
    esp8266React.begin();

    // start the server
    server.begin();
}

void loop()
{
    // run the framework's loop function
    esp8266React.loop();

    // run the automation schedules
    //schedules.runSchedules();
}
