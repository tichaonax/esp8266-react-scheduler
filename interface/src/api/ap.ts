import { AxiosPromise } from "axios";
import { RemoteUtils } from "../project/automation/utils/remoteUtils";

import { APSettings, APStatus } from "../types";
import { AXIOS } from "./endpoints";

export function readAPStatus(): AxiosPromise<APStatus> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}apStatus`);
}

export function readAPSettings(): AxiosPromise<APSettings> {
  return AXIOS.get(`${RemoteUtils.getApiBaseAddress()}apSettings`);
}

export function updateAPSettings(apSettings: APSettings): AxiosPromise<APSettings> {
  return AXIOS.post(`${RemoteUtils.getApiBaseAddress()}apSettings`, apSettings);
}
