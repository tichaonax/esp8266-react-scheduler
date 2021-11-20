export interface LightState {
    led_on: boolean;
  }
  
  export interface LightMqttSettings { 
    unique_id : string;
    name: string;
    mqtt_path : string;
  }
  
  export interface Schedule{
    runEvery: number;
    offAfter: number;
    startTimeHour: number;
    startTimeMinute: number;
    endTimeHour: number;
    endTimeMinute: number;
    hotTimeHour: number;
    overrideTime: number;
 }

  export interface ChannelState {
    controlOn: boolean;
    name: string;
    enabled: boolean;
    schedule: Schedule;
    enableTimeSpan: boolean;
    lastStartedChangeTime: string;
    controlPin: number;
    homeAssistantTopicType: number;
    homeAssistantIcon: string;
    nextRunTime: string;
    randomize: boolean;
    enableMinimumRunTime: boolean;
  }
  
  export interface ChannelMqttSettings { 
    unique_id : string;
    name: string;
    mqtt_path : string;
  }