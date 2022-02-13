#ifndef Channels_h
#define Channels_h

#include "Homeassistant.h"

#define OLD_CHANNEL_CONTROL_PIN "oldControlPin"
#define NEW_CHANNEL_CONTROL_PIN "controlPin"

#define OLD_HA_TOPIC_TYPE "oldHomeAssistantTopicType"
#define NEW_HA_TOPIC_TYPE "homeAssistantTopicType"


#ifdef SINILINK
  #ifdef CHANNEL_ONE
    #define CHANNEL_ONE_CONTROL_PIN 4
  #else
    #define CHANNEL_ONE_CONTROL_PIN 5
  #endif
#else
  #ifdef ESP32
    #define CHANNEL_ONE_CONTROL_PIN 21
  #else
    #ifdef SONOFF
      #define CHANNEL_ONE_CONTROL_PIN 12 
    #else
      #ifdef ESP01_M
        #define CHANNEL_ONE_CONTROL_PIN 0 
      #else
        #define CHANNEL_ONE_CONTROL_PIN 5 
      #endif 
    #endif
  #endif
#endif

#define CHANNEL_ONE_REST_ENDPOINT_PATH "/rest/channelOneState"  //restChannelEndPoint
#define CHANNEL_ONE_SOCKET_PATH "/ws/channelOneState"  // webSocketChannelEndPoint
#define CHANNEL_ONE_DEFAULT_NAME "Fan Heater" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath
#define CHANNEL_ONE_HOME_ASSISTANT_ENTITY "ch1"

#define CHANNEL_ONE_DEFAULT_CONTROL_RUN_EVERY 15.0f
#define CHANNEL_ONE_DEFAULT_CONTROL_OFF_AFTER 5.0f
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_HOUR 1
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_HOUR 20
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_ONE_DEFAULT_ENABLED_STATE true
#define CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_ONE_DEFAULT_RANDOMIZE_SCHEDULE true
#define CHANNEL_ONE_DEFAULT_SPAN_TIME 0.5f
#define CHANNEL_ONE_DEFAULT_OVERRIDE_TIME 40.0f // override time in minutes
#define CHANNEL_ONE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE true
#define CHANNEL_ONE_HOMEASSISTANT_TOPIC_TYPE HOMEASSISTANT_TOPIC_TYPE_SWITCH
#define CHANNEL_ONE_HOMEASSISTANT_ICON "mdi:fan"


#ifdef SINILINK
  #ifdef CHANNEL_TWO
    #define CHANNEL_TWO_CONTROL_PIN 4
  #else
    #define CHANNEL_TWO_CONTROL_PIN 12
  #endif
#else
  #ifdef ESP32
    #define CHANNEL_TWO_CONTROL_PIN 19
  #else
    #define CHANNEL_TWO_CONTROL_PIN 12
  #endif
#endif

#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Living Room Fridge" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath
#define CHANNEL_TWO_HOME_ASSISTANT_ENTITY "ch2"
#define CHANNEL_TWO_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_TWO_DEFAULT_CONTROL_OFF_AFTER 15.0f // minimum runtime
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_HOUR 18
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_ENABLED_STATE true
#define CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_TWO_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_TWO_DEFAULT_SPAN_TIME 0.0f    //hotTime hours
#define CHANNEL_TWO_DEFAULT_OVERRIDE_TIME 60.0f // override time in minutes
#define CHANNEL_TWO_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false
#define CHANNEL_TWO_HOMEASSISTANT_TOPIC_TYPE HOMEASSISTANT_TOPIC_TYPE_SWITCH
#define CHANNEL_TWO_HOMEASSISTANT_ICON MDI_FRIDGE

#ifdef SINILINK
  #ifdef CHANNEL_THREE
    #define CHANNEL_THREE_CONTROL_PIN 4
  #else
    #define CHANNEL_THREE_CONTROL_PIN 13
  #endif
#else
  #ifdef ESP32
    #define CHANNEL_THREE_CONTROL_PIN 18
  #else
    #define CHANNEL_THREE_CONTROL_PIN 13
  #endif
#endif

#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Bedroom Light" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath
#define CHANNEL_THREE_HOME_ASSISTANT_ENTITY "ch3"    // homeAssistantEntity
#define CHANNEL_THREE_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_THREE_DEFAULT_CONTROL_OFF_AFTER 5.0f // minimum runtime
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_HOUR 1
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_HOUR 12
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_THREE_DEFAULT_ENABLED_STATE true
#define CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_THREE_DEFAULT_RANDOMIZE_SCHEDULE true
#define CHANNEL_THREE_DEFAULT_SPAN_TIME 3.0f    //hotTime hours
#define CHANNEL_THREE_DEFAULT_OVERRIDE_TIME 120.0f // override time in minutes
#define CHANNEL_THREE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false
#define CHANNEL_THREE_HOMEASSISTANT_TOPIC_TYPE HOMEASSISTANT_TOPIC_TYPE_LIGHT
#define CHANNEL_THREE_HOMEASSISTANT_ICON MDI_LIGHTBULB


#ifdef SINILINK
  #ifdef CHANNEL_FOUR
    #define CHANNEL_FOUR_CONTROL_PIN 4
  #else
    #define CHANNEL_FOUR_CONTROL_PIN 14
  #endif
#else
  #ifdef ESP32
    #define CHANNEL_FOUR_CONTROL_PIN 5
  #else
    #define CHANNEL_FOUR_CONTROL_PIN 14
  #endif
#endif

#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Outside Lights" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath
#define CHANNEL_FOUR_HOME_ASSISTANT_ENTITY "ch4"    // homeAssistantEntity
#define CHANNEL_FOUR_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_FOUR_DEFAULT_CONTROL_OFF_AFTER 5.0f // minimum runtime
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_HOUR 19
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_HOUR 4
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_FOUR_DEFAULT_ENABLED_STATE true
#define CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_FOUR_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_FOUR_DEFAULT_SPAN_TIME 0.0f    //hotTime hours
#define CHANNEL_FOUR_DEFAULT_OVERRIDE_TIME 120.0f // override time in minutes
#define CHANNEL_FOUR_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false
#define CHANNEL_FOUR_HOMEASSISTANT_TOPIC_TYPE HOMEASSISTANT_TOPIC_TYPE_LIGHT
#define CHANNEL_FOUR_HOMEASSISTANT_ICON MDI_LIGHTBULB

#endif