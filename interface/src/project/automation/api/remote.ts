import axios from 'axios';
import { WS_BASE_URL, API_BASE_URL, ACCESS_TOKEN } from '../../../api/endpoints';
import { RemoteUtils } from '../utils/remoteUtils';
export const REMOTE_WEB_SOCKET_ROOT = calculateRemoteWebSocketRoot(WS_BASE_URL);

  export const REMOTE_AXIOS = axios.create({
    baseURL: RemoteUtils.correctEndPointUrl(`${RemoteUtils.getUrlBaseAddress()}${API_BASE_URL}`),
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [(data, headers) => {
      if (headers) {
        let accessToken = localStorage.getItem(ACCESS_TOKEN);

        if(RemoteUtils.isRemoteIpDevice()){
            accessToken = RemoteUtils.RemoteToken;
        }

        if (accessToken) {
          headers.Authorization = 'Bearer ' + accessToken;
        }
        if (headers['Content-Type'] !== 'application/json') {
          return data;
        }
      }
      return JSON.stringify(data);
    }]
  });

  function calculateRemoteWebSocketRoot(webSocketPath: string) {
    const location = window.location;
    const webProtocol = location.protocol === "https:" ? "wss:" : "ws:";
    return webProtocol + "//" + RemoteUtils.getRemoteDeviceIp() + webSocketPath;
  }
