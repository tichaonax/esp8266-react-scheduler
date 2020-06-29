import {
    createSelector
} from 'reselect';

export const channelSettingsSelector = createSelector(
    state => state.channels,
    channels => channels,
    (channels) => channels
);