import {API_REQUEST, apiError, apiSuccess} from "../../actions/api";
import { RemoteUtils } from '../../../../../utils/remoteUtils';

export const apiMiddleware = ({dispatch}) => (next) => (action) => {
    next(action);
    if (action.type.includes(API_REQUEST)) {
      const {headers, url, method, feature} = action.meta;
      const params = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          method: method,
        };
      if (headers && headers.length > 0) {
          headers.forEach((item) => {
            params[Object.keys(item)[0]] = Object.values(item)[0];
          });
      }
      RemoteUtils.authorizedFetch(url, params)
      .then(response => (dispatch(apiSuccess({data: response.data, feature}))))
      .catch(error => dispatch(apiError({error: error, feature})))
    }
};
