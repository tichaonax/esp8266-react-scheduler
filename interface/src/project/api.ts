import { AxiosPromise } from "axios";

import { AXIOS } from "../api/endpoints";
import { RemoteUtils } from "./automation/utils/remoteUtils";
import { LightMqttSettings, LightState } from "./types";

export function readLightState(): AxiosPromise<LightState> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}lightState`);
}

export function updateLightState(lightState: LightState): AxiosPromise<LightState> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}lightState`, lightState);
}

export function readBrokerSettings(): AxiosPromise<LightMqttSettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}brokerSettings`);
}

export function updateBrokerSettings(lightMqttSettings: LightMqttSettings): AxiosPromise<LightMqttSettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}brokerSettings`, lightMqttSettings);
}
