import axios from 'axios';
import {API_REQUEST, apiError, apiSuccess} from "../../actions/api";
import { RemoteUtils } from '../../../utils/remoteUtils';

RemoteUtils.setRemoteToken();

export const apiMiddleware = ({dispatch}) => (next) => (action) => {
    next(action);
    if (action.type.includes(API_REQUEST)) {
      const {headers, url, method, feature} = action.meta;
      const params = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + RemoteUtils.getAccessToken()
        };
      if (headers && headers.length > 0) {
          headers.forEach((item) => {
            params[Object.keys(item)[0]] = Object.values(item)[0];
          });
      }

      if(method === 'POST')
        axios.post(url, {}, { headers:params })
        .then((response) => (dispatch(apiSuccess({data: response.data, feature}))))
        .catch((error) => dispatch(apiError({error: error, feature})));

        if(method === 'GET')
          axios.get(url, { headers:params })
          .then((response) => (dispatch(apiSuccess({data: response.data, feature}))))
          .catch((error) => dispatch(apiError({error: error, feature})));
    }
};
