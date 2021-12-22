import { AxiosPromise } from 'axios';
import { RemoteUtils } from '../project/automation/utils/remoteUtils';

import { Features } from '../types';
import { AXIOS } from './endpoints';

export function readFeatures(): AxiosPromise<Features> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}features`);
}
