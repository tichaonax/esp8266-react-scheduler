import { WS_BASE_URL, API_BASE_URL, ACCESS_TOKEN } from '../../../api/endpoints';
import { isValidIpAddress } from '../../../validators/shared';

import { store } from '../redux/store';
import { deviceProxySelector } from '../redux/selectors/proxy';

export class RemoteUtils {
  static DEVICE = "device";
  static CHANNEL ="channel";

  static getProxy() {
      let isProxy = false;
      const currentChannelName = this.getRemoteDeviceChannelName();
      const localhost = this.parseUrl(this.getUrlAddress());
      let device = this.getRemoteDeviceUrl();
      let remote = device;
      let proxy = localhost;
      if(device){
        if(isValidIpAddress(remote)){
          device = `http://${device}`;
        }
        proxy = this.parseUrl(device);
        if (proxy.hostname !== localhost.hostname){
          isProxy = true;
        }
      }
      if(remote === null || remote.length < 2) { remote = "";}
      return({
        isProxy,
        localhost,
        proxy,
        channelOne : this.isChannelEnabled('channelOne'),
        channelTwo : this.isChannelEnabled('channelTwo'),
        channelThree : this.isChannelEnabled('channelThree'),
        channelFour : this.isChannelEnabled('channelFour'),
        remote,
        currentChannelName,
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
        return this.getParameterByName(this.DEVICE);
    }

    static getRemoteDeviceChannelName(){
      return this.getParameterByName(this.CHANNEL);
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

    static getAccessToken(){
        return this.getStorage().getItem(ACCESS_TOKEN);
    }

    static getStorage(){
      return localStorage || sessionStorage;
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
        return `${webProtocol}//${host.proxy.hostname}:${host.proxy.port}${WS_BASE_URL}`;
      }else{
        webProtocol = host.localhost.protocol === "https:" ? "wss:" : "ws:";
        return `${webProtocol}//${host.localhost.hostname}:${host.proxy.port}${WS_BASE_URL}`;
      }
    }

    static getDeviceHost(){
      return deviceProxySelector(store.getState());
    }

    static getLastPathItem = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1);
  }

  const remoteUtils = { RemoteUtils };

  export default remoteUtils;
