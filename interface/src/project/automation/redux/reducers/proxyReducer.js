import { HOSTNAME_VALIDATOR } from '../../../../validators';
import {SET_DEVICE_PROXY} from '../types/proxy';

export const proxyReducer = (host = {}, action) => {
  switch (action.type) {
    case SET_DEVICE_PROXY: {
      return {
          ...HOSTNAME_VALIDATOR,
         ...action.payload,
        };
    }

    default:
      return host;
  }
};
