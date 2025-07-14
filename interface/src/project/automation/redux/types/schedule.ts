export interface Schedule{
    runEvery: number;
    offAfter: number;
    startTimeHour: number;
    startTimeMinute: number;
    endTimeHour: number;
    endTimeMinute: number;
    hotTimeHour: number;
    overrideTime: number;
    isOverride: boolean;
    isOverrideActive: boolean;
    weekDays: Array<number>;
  }
