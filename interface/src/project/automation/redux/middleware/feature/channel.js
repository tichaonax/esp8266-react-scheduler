import {
    CHANNEL, RESTART, RESTART_CHANNEL_SCHEDULE
} from "../../types/channel";
import {API_ERROR, API_SUCCESS, apiRequest} from "../../actions/api";
import {setLoader} from "../../actions/ui";
import {setNotification} from "../../actions/notification";

import { ENDPOINT_ROOT } from '../../../../../api';
import { RemoteUtils } from '../../../../../utils/remoteUtils';

export const channelMiddleware = () => (next) => (action) => {

  next(action);
  
  switch (action.type) {

    case RESTART_CHANNEL_SCHEDULE:
      let channel;
      switch (action.payload) {
        case 1:
          channel = "channelOneScheduleRestart";
          break;
        case 2:
          channel = "channelTwoScheduleRestart";
          break;
        case 3:
          channel = "channelThreeScheduleRestart";
          break;
        case 4:
          channel = "channelFourScheduleRestart";
          break;
        default:
          channel = "";
          break;
      }

      const url = `${RemoteUtils.correctEndPointUrl(ENDPOINT_ROOT)}${channel}`;
      next([
          apiRequest({body: null, method: 'POST', url, feature: `${CHANNEL}${RESTART}`}),
          setLoader({loading: true, success: false, feature: `${CHANNEL}${RESTART}`})
      ]);
    break;

      case `${CHANNEL}${RESTART} ${API_SUCCESS}`:
        next([
          setLoader({loading: false, success: true, feature: `${CHANNEL}${RESTART}`})
        ]);
      break;

      case `${CHANNEL}${RESTART} ${API_ERROR}`:
      next([
        setNotification({message: action.payload, feature: `${CHANNEL}${RESTART}`}),
        setLoader({loading: false, success: false, errorMessage: action.payload.error.message, feature: `${CHANNEL}${RESTART}`})
      ]);

      break;
      
      default:
      break;
  }
};

export default channelMiddleware;
