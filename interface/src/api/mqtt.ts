import { AxiosPromise } from "axios";
import { RemoteUtils } from "../project/automation/utils/remoteUtils";

import { MqttSettings, MqttStatus } from "../types";
import { AXIOS } from "./endpoints";

export function readMqttStatus(): AxiosPromise<MqttStatus> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}mqttStatus`);
}

export function readMqttSettings(): AxiosPromise<MqttSettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}mqttSettings`);
}

export function updateMqttSettings(ntpSettings: MqttSettings): AxiosPromise<MqttSettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}mqttSettings`, ntpSettings);
}
