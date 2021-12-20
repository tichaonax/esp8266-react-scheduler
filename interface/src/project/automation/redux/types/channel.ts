import { Schedule } from './schedule';

export const CHANNEL = '[Channel Schedule]';
export const RESTART = '[Restart]';

export const SET_CHANNEL_SCHEDULE = `${CHANNEL} Set`;
export const RESTART_CHANNEL_SCHEDULE = `${CHANNEL} Reset`;

export interface ChannelSettings {
    controlOn: boolean;
    name: string;
    enabled: boolean;
    schedule: Schedule;
    enableTimeSpan: boolean;
    lastStartedChangeTime: string;
    controlPin: number;
    nextRunTime: string;
    randomize: boolean;
    enableMinimumRunTime: boolean;
    localDateTime: string;
    IPAddress: string;
    oldControlPin: number;
    oldHomeAssistantTopicType: number;
}

export interface Channels {
  channelOne: ChannelSettings;
  channelTwo: ChannelSettings;
  channelThree: ChannelSettings;
  channelFour: ChannelSettings;
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
  onSetChannelSettings: SetChannelSettingsType;
  channels: Channels;
  localDateTime: string;
  IPAddress: string;
  enableRemoteConfiguration: boolean;
  masterIPAddress: string;
  restChannelEndPoint: string;
  restChannelRestartEndPoint: string;
}

export interface ChannelStateFuncs {
  onRestartChannelSchedule: RestartChannelScheduleType;
  onSetChannelSettings: SetChannelSettingsType;
}

export interface SetChannelScheduleAction {
    type: typeof SET_CHANNEL_SCHEDULE;
    payload: ChannelSettings;
    meta?: object;
}

export interface ReStartChannelScheduleAction {
    type: typeof RESTART_CHANNEL_SCHEDULE;
    payload: number;
    meta?: object;
}

export type SetChannelSettingsType = (channelSettings: ChannelSettings, channel: number) => void;
export type RestartChannelScheduleType = (url: string, channel: number) => void;

export type ChannelSettingsActions = SetChannelScheduleAction | ReStartChannelScheduleAction;

export type ChannelSettingsActionTypes = SetChannelSettingsType | RestartChannelScheduleType;
