import { AxiosPromise } from 'axios';
import { RemoteUtils } from '../project/automation/utils/remoteUtils';

import { WiFiNetworkList, WiFiSettings, WiFiStatus } from '../types';
import { AXIOS } from './endpoints';

export function readWiFiStatus(): AxiosPromise<WiFiStatus> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}wifiStatus`);
}

export function scanNetworks(): AxiosPromise<void> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}scanNetworks`);
}

export function listNetworks(): AxiosPromise<WiFiNetworkList> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}listNetworks`);
}

export function readWiFiSettings(): AxiosPromise<WiFiSettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}wifiSettings`);
}

export function updateWiFiSettings(wifiSettings: WiFiSettings): AxiosPromise<WiFiSettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}wifiSettings`, wifiSettings);
}
