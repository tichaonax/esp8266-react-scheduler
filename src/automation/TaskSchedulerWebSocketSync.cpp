#include "TaskSchedulerWebSocketSync.h"

void TaskSchedulerWebSocketSync::publishControlPinStateChange(String restChannelEndPoint, bool controlPin){
    Serial.print("Rest channel end point: ");
    Serial.println(restChannelEndPoint);
    Serial.print("Pin status: ");
    Serial.println(controlPin);

    HTTPClient http;  //Declare an object of class HTTPClient
    
    http.begin(restChannelEndPoint);  //Specify request destination
    int httpCode = http.GET();  
    
     Serial.print("httpCode status code============>: ");                                                                //Send the request
    Serial.println(httpCode);   

    if (httpCode > 0) { //Check the returning code
    
    String payload = http.getString();   //Get the request response payload
    Serial.println(payload);                     //Print the response payload
    
    }
    
    http.end();   //Close connection
 
}

void TaskSchedulerWebSocketSync::readPinState(String restChannelEndPoint, bool controlPin){

}