#ifndef Channels_h
#define Channels_h

#ifdef CHANNEL_ONE_LIGHT
  // onboard relay control pin = 5
  #define CHANNEL_ONE_CONTROL_PIN 5 // use channel 3
#else
  #ifdef SINILINK
    // onboard relay control pin = 4
    #define CHANNEL_ONE_CONTROL_PIN 4
  #else
    #define CHANNEL_ONE_CONTROL_PIN 5
  #endif
#endif

#define CHANNEL_ONE_REST_ENDPOINT_PATH "/rest/channelOneState"  //restChannelEndPoint
#define CHANNEL_ONE_SOCKET_PATH "/ws/channelOneState"  // webSocketChannelEndPoint
#define CHANNEL_ONE_DEFAULT_NAME "Water Pump" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath
#define CHANNEL_ONE_HOME_ASSISTANT_ENTITY "channel_one"
#define CHANNEL_ONE_DEFAULT_CONTROL_RUN_EVERY 15.0f
#define CHANNEL_ONE_DEFAULT_CONTROL_OFF_AFTER 3.0f
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_HOUR 16
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_ENABLED_STATE true
#define CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_ONE_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_ONE_DEFAULT_SPAN_TIME 0.0f
#define CHANNEL_ONE_DEFAULT_OVERRIDE_TIME 15.0f // override time in minutes
#define CHANNEL_ONE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false

#ifdef CHANNEL_TWO_LIGHT
  // onboard relay control pin = 5
  #define CHANNEL_TWO_CONTROL_PIN 5
#else
  #ifdef SINILINK
    // onboard relay control pin = 4
    #define CHANNEL_TWO_CONTROL_PIN 4
  #else
    #define CHANNEL_TWO_CONTROL_PIN 12
  #endif
#endif

#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Solar Fridge" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath
#define CHANNEL_TWO_HOME_ASSISTANT_ENTITY "channel_two"
#define CHANNEL_TWO_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_TWO_DEFAULT_CONTROL_OFF_AFTER 15.0f
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_HOUR 18
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_ENABLED_STATE true
#define CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_TWO_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_TWO_DEFAULT_SPAN_TIME 0.0f
#define CHANNEL_TWO_DEFAULT_OVERRIDE_TIME 60.0f // override time in minutes
#define CHANNEL_TWO_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false

#ifdef CHANNEL_THREE_LIGHT
  // onboard relay control pin = 5
  #define CHANNEL_THREE_CONTROL_PIN 5
#else
  #ifdef SINILINK
    // onboard relay control pin = 4
    #define CHANNEL_THREE_CONTROL_PIN 4
  #else
    #define CHANNEL_THREE_CONTROL_PIN 13
  #endif
#endif

#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Bedside Light" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath
#define CHANNEL_THREE_HOME_ASSISTANT_ENTITY "channel_three"    // homeAssistantEntity
#define CHANNEL_THREE_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_THREE_DEFAULT_CONTROL_OFF_AFTER 10.0f
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_HOUR 1
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_HOUR 13
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_THREE_DEFAULT_ENABLED_STATE true
#define CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_THREE_DEFAULT_RANDOMIZE_SCHEDULE true
#define CHANNEL_THREE_DEFAULT_SPAN_TIME 3.0f
#define CHANNEL_THREE_DEFAULT_OVERRIDE_TIME 120.0f // override time in minutes
#define CHANNEL_THREE_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false

#ifdef CHANNEL_FOUR_LIGHT
  // onboard relay control pin = 5p
  #define CHANNEL_FOUR_CONTROL_PIN 5
#else
  #ifdef SINILINK
    // onboard relay control pin = 4
    #define CHANNEL_FOUR_CONTROL_PIN 4
  #else
    #define CHANNEL_FOUR_CONTROL_PIN 14
  #endif
#endif

#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Outside Lights" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath
#define CHANNEL_FOUR_HOME_ASSISTANT_ENTITY "channel_four"    // homeAssistantEntity
#define CHANNEL_FOUR_DEFAULT_CONTROL_RUN_EVERY 30.0f
#define CHANNEL_FOUR_DEFAULT_CONTROL_OFF_AFTER 5.0f
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_HOUR 19
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_HOUR 4
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_FOUR_DEFAULT_ENABLED_STATE true
#define CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_FOUR_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_FOUR_DEFAULT_SPAN_TIME 0.0f
#define CHANNEL_FOUR_DEFAULT_OVERRIDE_TIME 0.0f // override time in minutes
#define CHANNEL_FOUR_DEFAULT_ENABLE_MINIMUM_RUN_TIME_SCHEDULE false

#endif