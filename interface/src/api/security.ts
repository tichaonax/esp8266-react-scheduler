import { AxiosPromise } from 'axios';
import { RemoteUtils } from '../project/automation/utils/remoteUtils';

import { SecuritySettings } from '../types';
import { AXIOS } from './endpoints';

export function readSecuritySettings(): AxiosPromise<SecuritySettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}securitySettings`);
}

export function updateSecuritySettings(securitySettings: SecuritySettings): AxiosPromise<SecuritySettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}securitySettings`, securitySettings);
}

