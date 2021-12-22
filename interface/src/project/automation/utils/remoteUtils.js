import { WS_BASE_URL, API_BASE_URL, ACCESS_TOKEN } from '../../../api/endpoints';
import { isValidIpAddress } from '../../../validators/shared';

import { store } from '../redux/store';
import { deviceProxySelector } from '../redux/selectors/proxy';

const SIGN_IN_ENDPOINT = '/rest/signIn';

export class RemoteUtils {
  static RemoteToken;
  static PROXY = "device";
  static LOCALHOST ='localhost;'

  static getProxy() {
      let isProxy = false;
      const localhost = this.parseUrl(this.getUrlAddress());
      let remote = this.getRemoteDeviceUrl();
      let proxy = localhost;
      if(remote){
        if(isValidIpAddress(remote)){
          remote = `http://${remote}`;
        }
        proxy = this.parseUrl(remote);
        if (proxy.hostname !== localhost.hostname){
          isProxy = true;
        }
      }
      return({
        isProxy,
        localhost,
        proxy,
        channelOne : this.isChannelEnabled('channelOne'),
        channelTwo : this.isChannelEnabled('channelTwo'),
        channelThree : this.isChannelEnabled('channelThree'),
        channelFour : this.isChannelEnabled('channelFour'),
      });
    }

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

    static getRemoteDeviceUrl(){
        return this.getParameterByName(this.PROXY);
    }

    static isRemoteDevice(){
        return (this.getRemoteDeviceUrl() != null);
    }

    static isRoute(route){
      return(this.parseUrl(this.getUrlAddress()).pathname.includes(route));
    }

    static isChannelEnabled(route){
      const isRemote = this.isRemoteDevice();
      return(!isRemote || (isRemote && this.isRoute(route)));
    }

    static correctEndPointUrl(endpointUrl){
     const remoteUrl = this.getRemoteDeviceUrl();
     if(remoteUrl){
       const {protocol, pathname, search} = this.parseUrl(endpointUrl);
       return(`${protocol}//${remoteUrl}${pathname}${search}`);
     }
     return (endpointUrl);
    }

    static getAccessToken(){
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

    static makeParams(_params){
      let accessToken = this.getLocalAccessToken() || "";
      if(this.isRemoteDevice()) accessToken = this.RemoteToken;
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

    static getApiBaseAddress() {
      const host = deviceProxySelector(store.getState());
      if(host.isProxy){
        return `${host.proxy.protocol}//${host.proxy.hostname}:${host.proxy.port}${API_BASE_URL}`;
      }else{
        return `${host.localhost.protocol}//${host.localhost.hostname}:${host.localhost.port}${API_BASE_URL}`;
      }
    }

    static getWsBaseAddress() {
      const host = deviceProxySelector(store.getState());
      let webProtocol;
      if(host.isProxy){
        webProtocol = host.proxy.protocol === "https:" ? "wss:" : "ws:";
        return `${webProtocol}//${host.proxy.hostname}${WS_BASE_URL}`;
      }else{
        webProtocol = host.localhost.protocol === "https:" ? "wss:" : "ws:";
        return `${webProtocol}//${host.localhost.hostname}${WS_BASE_URL}`;
      }
    }

    static getDeviceHost(){
      return deviceProxySelector(store.getState());
    }
  }

  const remoteUtils = { RemoteUtils };

  export default remoteUtils;
