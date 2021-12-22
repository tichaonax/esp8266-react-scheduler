import {
    createSelector
} from 'reselect';

export const deviceProxySelector = createSelector(
    (state) => state.host,
    (host) => host
);
