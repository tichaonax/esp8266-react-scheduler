import { createAction } from 'redux-actions';

import {
 PROXY,
 SET_DEVICE_PROXY,
 Proxy,
} from '../types/proxy';

export const setProxy = (proxy : Proxy) => (
  createAction(
    SET_DEVICE_PROXY,
    () => proxy,
    () => ({feature: PROXY}),
  )
)(proxy);
