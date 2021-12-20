import { createAction } from 'redux-actions';

import {
 CHANNEL,
 SET_CHANNEL_SCHEDULE,
 RESTART_CHANNEL_SCHEDULE,
 ChannelSettings,
} from '../types/channel';

export const reStartChannelSchedule = (endpoint: string) => (
  createAction(
    RESTART_CHANNEL_SCHEDULE,
    () => endpoint,
    () => ({feature: CHANNEL}),
  )
)(endpoint);

export const setChannelSettings = (channelSettings : ChannelSettings) => (
  createAction(
    SET_CHANNEL_SCHEDULE,
    () => channelSettings,
    () => ({feature: CHANNEL}),
  )
)(channelSettings);
