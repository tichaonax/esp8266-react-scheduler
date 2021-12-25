export const PROXY = '[Device Proxy]';

export const SET_DEVICE_PROXY = `${PROXY} Set`;

export interface Link {
    port: string,
    hostname: string,
    pathname: string,
    protocol: string,
    search: string
}

export interface Proxy {
    isProxy: boolean;
    localhost: Link;
    proxy: Link;
    channelOne?: boolean;
    channelTwo?: boolean;
    channelThree?: boolean;
    channelFour?: boolean;
    remote: any;
  }
