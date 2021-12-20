import { createAction } from 'redux-actions';

export const API_REQUEST = 'Api Request';
export const API_SUCCESS = 'Api Success';
export const API_ERROR   = 'Api Error';

export const apiRequest = ({ headers, body, method, url, feature}) => (
  createAction(`${feature} ${API_REQUEST}`,
    () => body,
    () => ({ headers, method, url, feature }),
  ))({ headers, body, method, url, feature});

export const apiSuccess = ({ data, feature }) => (
  createAction(`${feature} ${API_SUCCESS}`,
    () => data,
    () => ({ feature })
  ))({ data, feature });

export const apiError = ({ error, feature }) => (
  createAction(`${feature} ${API_ERROR}`,
    () => ({error}),
    () => ({ feature })
  ))({ error, feature });
