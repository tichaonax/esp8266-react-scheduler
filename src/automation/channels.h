#ifndef Channels_h
#define Channels_h

#define CHANNEL_ONE_CONTROL_PIN 5
#define CHANNEL_ONE_REST_ENDPOINT_PATH "/rest/channelOneState"  //restChannelEndPoint
#define CHANNEL_ONE_SOCKET_PATH "/ws/channelOneState"  // webSocketChannelEndPoint
#define CHANNEL_ONE_DEFAULT_NAME "Water Pump" //  defaultChannelName
#define CHANNEL_ONE_CONFIG_JSON_PATH "/config/channelOneState.json"  // channelJsonConfigPath
#define CHANNEL_ONE_HOME_ASSISTANT_ENTITY "water_pump_switch"
#define CHANNEL_ONE_DEFAULT_CONTROL_RUN_EVERY 15
#define CHANNEL_ONE_DEFAULT_CONTROL_OFF_AFTER 3
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_ONE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_HOUR 16
#define CHANNEL_ONE_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_ONE_DEFAULT_ENABLED_STATE true
#define CHANNEL_ONE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_ONE_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_ONE_DEFAULT_SPAN_TIME 0

#ifdef SINILINK
  // onboard relay control pin = 4
  #define CHANNEL_TWO_CONTROL_PIN 4
#else
    #define CHANNEL_TWO_CONTROL_PIN 12
#endif

#define CHANNEL_TWO_REST_ENDPOINT_PATH "/rest/channelTwoState"  //restChannelEndPoint
#define CHANNEL_TWO_SOCKET_PATH "/ws/channelTwoState"  // webSocketChannelEndPoint
#define CHANNEL_TWO_DEFAULT_NAME "Solar Fridge" //  defaultChannelName
#define CHANNEL_TWO_CONFIG_JSON_PATH "/config/channelTwoState.json"  // channelJsonConfigPath
#define CHANNEL_TWO_HOME_ASSISTANT_ENTITY "solar_fridge_switch"
#define CHANNEL_TWO_DEFAULT_CONTROL_RUN_EVERY 30
#define CHANNEL_TWO_DEFAULT_CONTROL_OFF_AFTER 15
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_HOUR 8
#define CHANNEL_TWO_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_HOUR 21
#define CHANNEL_TWO_DEFAULT_CONTROL_END_TIME_MINUTE 0
#define CHANNEL_TWO_DEFAULT_ENABLED_STATE true
#define CHANNEL_TWO_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_TWO_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_TWO_DEFAULT_SPAN_TIME 0

#define CHANNEL_THREE_CONTROL_PIN 13
#define CHANNEL_THREE_REST_ENDPOINT_PATH "/rest/channelThreeState"  //restChannelEndPoint
#define CHANNEL_THREE_SOCKET_PATH "/ws/channelThreeState"  // webSocketChannelEndPoint
#define CHANNEL_THREE_DEFAULT_NAME "Bedside Light" //  defaultChannelName
#define CHANNEL_THREE_CONFIG_JSON_PATH "/config/channelThreeState.json"  // channelJsonConfigPath
#define CHANNEL_THREE_HOME_ASSISTANT_ENTITY "inside_light"    // homeAssistantEntity
#define CHANNEL_THREE_DEFAULT_CONTROL_RUN_EVERY 20
#define CHANNEL_THREE_DEFAULT_CONTROL_OFF_AFTER 5
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_HOUR 2
#define CHANNEL_THREE_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_HOUR 13
#define CHANNEL_THREE_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_THREE_DEFAULT_ENABLED_STATE true
#define CHANNEL_THREE_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE false
#define CHANNEL_THREE_DEFAULT_RANDOMIZE_SCHEDULE true
#define CHANNEL_THREE_DEFAULT_SPAN_TIME 2

#define CHANNEL_FOUR_CONTROL_PIN 14
#define CHANNEL_FOUR_REST_ENDPOINT_PATH "/rest/channelFourState"  //restChannelEndPoint
#define CHANNEL_FOUR_SOCKET_PATH "/ws/channelFourState"  // webSocketChannelEndPoint
#define CHANNEL_FOUR_DEFAULT_NAME "Outside Lights" //  defaultChannelName
#define CHANNEL_FOUR_CONFIG_JSON_PATH "/config/channelFourState.json"  // channelJsonConfigPath
#define CHANNEL_FOUR_HOME_ASSISTANT_ENTITY "outside_light"    // homeAssistantEntity
#define CHANNEL_FOUR_DEFAULT_CONTROL_RUN_EVERY 30
#define CHANNEL_FOUR_DEFAULT_CONTROL_OFF_AFTER 5
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_HOUR 19
#define CHANNEL_FOUR_DEFAULT_CONTROL_START_TIME_MINUTE 0
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_HOUR 4
#define CHANNEL_FOUR_DEFAULT_CONTROL_END_TIME_MINUTE 30
#define CHANNEL_FOUR_DEFAULT_ENABLED_STATE true
#define CHANNEL_FOUR_DEFAULT_ENABLE_TIME_SPAN_SCHEDULE true
#define CHANNEL_FOUR_DEFAULT_RANDOMIZE_SCHEDULE false
#define CHANNEL_FOUR_DEFAULT_SPAN_TIME 0

#endif