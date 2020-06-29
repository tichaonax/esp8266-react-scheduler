import { createAction } from 'redux-actions';

import {
 CHANNEL,
 SET_CHANNEL_SCHEDULE,
 RESTART_CHANNEL_SCHEDULE,
 ChannelSettings,
} from '../types/channel';

export const reStartChannelSchedule = (channel: number) => (
  createAction(
    RESTART_CHANNEL_SCHEDULE,
    () => channel,
    () => ({feature: CHANNEL}),
  )
)(channel)

export const setChannelSettings = (channelSettings : ChannelSettings, channel: number) => (
  createAction(
    SET_CHANNEL_SCHEDULE,
    () => channelSettings,
    () => ({feature: CHANNEL, channel }),
  )
)(channelSettings, channel);
