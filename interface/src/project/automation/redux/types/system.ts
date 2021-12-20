export interface Tm {
    tm_sec: number;
    tm_min: number;
    tm_hour: number;
}
export interface SystemState {
    localTime: Tm;
    localDateTime: string;
    IPAddress: string;
}