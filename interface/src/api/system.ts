import { AxiosPromise } from 'axios';
import { RemoteUtils } from '../project/automation/utils/remoteUtils';

import { OTASettings, SystemStatus } from '../types';
import { AXIOS, FileUploadConfig, uploadFile } from './endpoints';

export function readSystemStatus(): AxiosPromise<SystemStatus> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}systemStatus`);
}

export function restart(): AxiosPromise<void> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}restart`);
}

export function factoryReset(): AxiosPromise<void> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}factoryReset`);
}

export function readOTASettings(): AxiosPromise<OTASettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}otaSettings`);
}

export function updateOTASettings(otaSettings: OTASettings): AxiosPromise<OTASettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}otaSettings`, otaSettings);
}

export const uploadFirmware = (file: File, config?: FileUploadConfig): AxiosPromise<void> => (
  uploadFile(`${RemoteUtils.getApiBaseAddress()}uploadFirmware`, file, config)
);
