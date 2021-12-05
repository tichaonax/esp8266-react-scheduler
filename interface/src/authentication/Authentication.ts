import * as H from 'history';

import history from '../history';
import { Features } from '../features/types';
import { getDefaultRoute } from '../AppRouting';
import { RemoteUtils } from '../utils/remoteUtils';

export const SIGN_IN_PATHNAME = 'signInPathname';
export const SIGN_IN_SEARCH = 'signInSearch';


export function storeLoginRedirect(location?: H.Location) {
  if (location) {
    RemoteUtils.getStorage().setItem(SIGN_IN_PATHNAME, location.pathname);
    RemoteUtils.getStorage().setItem(SIGN_IN_SEARCH, location.search);
  }
}

export function clearLoginRedirect() {
  RemoteUtils.getStorage().removeItem(SIGN_IN_PATHNAME);
  RemoteUtils.getStorage().removeItem(SIGN_IN_SEARCH);
}

export function fetchLoginRedirect(features: Features): H.LocationDescriptorObject {
  const signInPathname = RemoteUtils.getStorage().getItem(SIGN_IN_PATHNAME);
  const signInSearch = RemoteUtils.getStorage().getItem(SIGN_IN_SEARCH);
  clearLoginRedirect();
  return {
    pathname: signInPathname || getDefaultRoute(features),
    search: (signInPathname && signInSearch) || undefined
  };
}

/**
 * fetch() does not yet support upload progress, this wrapper allows us to configure the xhr request 
 * for a single file upload and takes care of adding the Authorization header and redirecting on 
 * authorization errors as we do for normal fetch operations.
 */
export function redirectingAuthorizedUpload(xhr: XMLHttpRequest, url: string, file: File, onProgress: (event: ProgressEvent<EventTarget>) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    xhr.open("POST", url, true);
    const accessToken = RemoteUtils.getLocalAccessToken();
    if (accessToken) {
      xhr.withCredentials = true;
      xhr.setRequestHeader("Authorization", 'Bearer ' + accessToken);
    }
    xhr.upload.onprogress = onProgress;
    xhr.onload = function () {
      if (xhr.status === 401 || xhr.status === 403) {
        if(RemoteUtils.isRemoteIpDevice()){
          resolve();
        }else{
          history.push("/unauthorized");
        }
      } else {
        resolve();
      }
    };
    xhr.onerror = function (event: ProgressEvent<EventTarget>) {
      reject(new DOMException('Error', 'UploadError'));
    };
    xhr.onabort = function () {
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
}

/**
 * Wraps the normal fetch routine which redirects on 401 response.
 */
export function redirectingAuthorizedFetch(url: RequestInfo, params?: RequestInit): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    RemoteUtils.authorizedFetch(url, params).then(response => {
      if (response.status === 401 || response.status === 403) {
        if(RemoteUtils.isRemoteIpDevice()){
          resolve(response);
        }else{
          history.push("/unauthorized");
        }
        
      } else {
        resolve(response);
      }
    }).catch(error => {
      reject(error);
    });
  });
}

export function addAccessTokenParameter(url: string) {
  const accessToken = RemoteUtils.getLocalAccessToken();
  if (!accessToken) {
    return url;
  }
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set(RemoteUtils.ACCESS_TOKEN, accessToken);
  return parsedUrl.toString();
}
