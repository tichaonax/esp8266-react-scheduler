import { AxiosPromise } from "axios";
import { RemoteUtils } from "../project/automation/utils/remoteUtils";

import { NTPSettings, NTPStatus, Time } from "../types";
import { AXIOS } from "./endpoints";

export function readNTPStatus(): AxiosPromise<NTPStatus> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}ntpStatus`);
}

export function readNTPSettings(): AxiosPromise<NTPSettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}ntpSettings`);
}

export function updateNTPSettings(ntpSettings: NTPSettings): AxiosPromise<NTPSettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}ntpSettings`, ntpSettings);
}

export function updateTime(time: Time): AxiosPromise<Time> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}time`, time);
}
