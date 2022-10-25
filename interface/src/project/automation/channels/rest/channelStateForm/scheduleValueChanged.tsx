import { Dispatch } from 'react';
import { ChannelState } from '../../../redux/types/channel';
import { Schedule } from '../../../redux/types/schedule';
import { extractEventValue } from '../../../../../utils';

export function scheduleValueChanged(extractDateValue:
  (date: Date | null) => { timeHour: number; timeMinute: number; },
  setData:Dispatch<React.SetStateAction<ChannelState | undefined>>, data: ChannelState) {
  return (name: keyof Schedule) => (event: any) => {
    switch (name) {
      case 'startTimeHour':
        const _startTime = extractDateValue(event);
        setData({
          ...data, schedule: {
            ...data.schedule,
            startTimeHour: _startTime.timeHour, startTimeMinute: _startTime.timeMinute
          }
        });
        break;
      case 'endTimeHour':
        const _endTime = extractDateValue(event);
        setData({
          ...data, schedule: {
            ...data.schedule,
            endTimeHour: _endTime.timeHour, endTimeMinute: _endTime.timeMinute
          }
        });
        break;
      default:
        setData({ ...data, schedule: { ...data.schedule, [name]: extractEventValue(event) } });
        break;
    }
  };
}
