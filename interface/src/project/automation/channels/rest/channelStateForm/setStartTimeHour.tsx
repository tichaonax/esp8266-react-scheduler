import { TextField } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { StartTime } from '../../tooltips/StartTime';
import { Schedule } from '../../../redux/types/schedule';

export function setStartTimeHour(startTime: Date, handleDateChange: (date: Date | null) => void,
handleChannelScheduleValueChange: (name: keyof Schedule) => (event: any) => void) {
  return (<LocalizationProvider dateAdapter={AdapterDateFns}>
    <TimePicker
      label={(<StartTime />)}
      value={startTime}
      onChange={handleDateChange}
      onAccept={handleChannelScheduleValueChange('startTimeHour')}
      renderInput={(params) => <TextField {...params} />}
    />
          </LocalizationProvider>);
}
