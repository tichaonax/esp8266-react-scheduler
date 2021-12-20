import { ACCESS_TOKEN } from '../../../api/endpoints';
const SIGN_IN_ENDPOINT = '/rest/signIn';

export class RemoteUtils {
    static RemoteToken;
    // eslint-disable-next-line max-len
    static ipRegex = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    static REMOTE_IP = "device";
    static ACCESS_TOKEN = 'access_token';

    static parseUrl(url) {
      let link = document.createElement('a');

      link.setAttribute('href', url);

      const retValue = {
        port: link.port,
        hostname: link.hostname,
        pathname: link.pathname,
        protocol: link.protocol,
        search: link.search,
      };

      link = null;

    return retValue;
    }

    static getUrlBaseAddress() {
      const newUrl = this.parseUrl(this.getUrlAddress());
      return `${newUrl.protocol}//${newUrl.hostname}:${newUrl.port}`;
    }

    static getUrlAddress = () => window.location.href;

    static getParameterByName = (parameter, url = this.getUrlAddress()) => {
      const cleanParam = parameter.replace(/[[\]]/g, '\\$&');
      const regex = new RegExp(`[?&]${cleanParam}(=([^&#]*)|&|#|$)`);
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    static getRemoteDeviceIp(){
        return this.getParameterByName(this.REMOTE_IP);
    }

    static isRemoteIpDevice(){
        return (this.getRemoteDeviceIp() != null);
    }

    static isRoute(route){
      return(this.parseUrl(this.getUrlAddress()).pathname.includes(route));
    }

    static isChannelEnabled(route){
      const isRemote = this.isRemoteIpDevice();
      return(!isRemote || (isRemote && this.isRoute(route)));
    }

    static correctEndPointUrl(endpointUrl){
     const remoteIp = this.getRemoteDeviceIp();
     if(remoteIp){
       const {protocol, pathname, search} = this.parseUrl(endpointUrl);
       //const url = endpointUrl.replace(this.ipRegex, remoteIp);
       return(`${protocol}//${remoteIp}${pathname}${search}`);
     }
     return (endpointUrl);
    }

    static setRemoteToken(){
      RemoteUtils.getRemoteAccessToken("admin", "admin").then((response) => {
        RemoteUtils.RemoteToken = response;
      });
    }

    static getLocalAccessToken(){
        return this.getStorage().getItem(this.ACCESS_TOKEN);
    }
    static getRemoteAccessToken(username, password) {
       return fetch(this.correctEndPointUrl(SIGN_IN_ENDPOINT), {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
        .then((response) => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            throw Error("Invalid credentials.");
        } else {
            throw Error("Invalid status code: " + response.status);
        }
        }).then((json) => {
        return (json.access_token);
        })
        .catch(() => {
            throw Error("Could not login to remote devices.");
        });
    }

    static getStorage(){
         return localStorage || sessionStorage;
    }

    static getAccessToken(){
      return this.isRemoteIpDevice() ? this.RemoteToken : localStorage.getItem(ACCESS_TOKEN);
    }

    static makeParams(_params){
      let accessToken = this.getLocalAccessToken() || "";
      if(this.isRemoteIpDevice()) accessToken = this.RemoteToken;
      const makeParams = (params) => {
        params = params || {};
        params.credentials = 'include';
        params.headers = {
          ...params.headers,
          "Authorization": 'Bearer ' + accessToken
        };
        return params;
      };
      return makeParams(_params);
    }

    static getNavigationLink(route, endPoint){
      const path = endPoint.split('/').pop();
      let navToUrl = `/project/${route}/${path}`;
      const state = "State";
      return(navToUrl.substring(0, navToUrl.length - state.length));
    }
  }

  const remoteUtils = { RemoteUtils };

  export default remoteUtils;
