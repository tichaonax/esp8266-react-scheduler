import { AxiosPromise } from 'axios';

import { AXIOS } from '../../../api/endpoints';
import { RemoteUtils } from '../utils/remoteUtils';
import { ChannelState } from '../redux/types/channel';
import { ChannelMqttSettings } from '../redux/types/mqtt';

export const createReadChannelApi = (channelId: string): AxiosPromise<ChannelState> => {
     return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}channel${channelId}State`);
};

export const createUpdateChannelApi = (channelId: string, channelState: ChannelState): AxiosPromise<ChannelState> => {
     return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}channel${channelId}State`, channelState);
};

export const createReadChannelBrokerSettingsApi = (channelId: string): AxiosPromise<ChannelMqttSettings> => {
     return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}Channel${channelId}BrokerSettings`);
};

export const createUpdateChannelBrokerSettingsApi = (
    channelId: string, channelMqttSettings: ChannelMqttSettings): AxiosPromise<ChannelMqttSettings> => {
     return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}Channel${channelId}BrokerSettings`, channelMqttSettings);
};

