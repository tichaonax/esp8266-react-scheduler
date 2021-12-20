import { AxiosPromise } from 'axios';

import { AXIOS } from '../../../api/endpoints';
import { RemoteUtils } from '../utils/remoteUtils';
import { ChannelState } from '../redux/types/channel';
import { ChannelMqttSettings } from '../redux/types/mqtt';
import { REMOTE_AXIOS } from './remote';

RemoteUtils.setRemoteToken();

export const createReadChannelApi = (channelId: string): AxiosPromise<ChannelState> => {
    return RemoteUtils.isRemoteIpDevice() ? REMOTE_AXIOS.get(`/channel${channelId}State`)
    : AXIOS.get(`/channel${channelId}State`);
};

export const createUpdateChannelApi = (channelId: string, channelState: ChannelState): AxiosPromise<ChannelState> => {
    return RemoteUtils.isRemoteIpDevice() ? REMOTE_AXIOS.post(`/channel${channelId}State`, channelState)
    : AXIOS.post(`/channel${channelId}State`, channelState);
};

export const createReadChannelBrokerSettingsApi = (channelId: string): AxiosPromise<ChannelMqttSettings> => {
    return RemoteUtils.isRemoteIpDevice() ? REMOTE_AXIOS.get(`/Channel${channelId}BrokerSettings`)
    :AXIOS.get(`/Channel${channelId}BrokerSettings`);
};

export const createUpdateChannelBrokerSettingsApi = (
    channelId: string, channelMqttSettings: ChannelMqttSettings): AxiosPromise<ChannelMqttSettings> => {
    return RemoteUtils.isRemoteIpDevice() ? REMOTE_AXIOS.post(`/Channel${channelId}BrokerSettings`, channelMqttSettings)
    :AXIOS.post(`/Channel${channelId}BrokerSettings`, channelMqttSettings);
};

