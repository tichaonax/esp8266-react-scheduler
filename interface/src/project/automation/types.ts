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
 }

  export interface ChannelState {
    controlOn: boolean;
    name: string;
    enabled: boolean;
    schedule: Schedule;
    enableTimeSpan: boolean;
    lastStartedChangeTime: string;
    controlPin: number;
    nextRunTime: string;
  }
  
  export interface ChannelMqttSettings { 
    unique_id : string;
    name: string;
    mqtt_path : string;
  }