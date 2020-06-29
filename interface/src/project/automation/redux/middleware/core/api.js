import axios from 'axios';
import {API_REQUEST, apiError, apiSuccess} from "../../actions/api";
export const ACCESS_TOKEN = 'access_token';
const accessToken = localStorage.getItem(ACCESS_TOKEN);

export const apiMiddleware = ({dispatch}) => (next) => (action) => {
    next(action);
    if (action.type.includes(API_REQUEST)) {
        const defaults = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };
          if (accessToken) {
            defaults["Authorization"] = 'Bearer ' + accessToken;
          }
        const {headers, url, method, feature} = action.meta;
        //it is possible that caller may have additional headers
        if (headers && headers.length > 0) {
            headers.forEach((item) => {
              defaults[Object.keys(item)[0]] = Object.values(item)[0];
            });
        }
        axios({
            url,
            method,
            headers: defaults,
            data: JSON.stringify(action.payload)
        })
        .then(response => (dispatch(apiSuccess({data: response.data, feature}))))
        .catch(error => dispatch(apiError({error: error, feature})))
    }
};
