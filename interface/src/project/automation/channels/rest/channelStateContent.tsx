import { ValidateFieldsError } from "async-validator";
import { Button, Checkbox } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TextField } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { FormLoader, BlockFormControlLabel, ButtonRow, ValidatedTextField } from '../../../../components';
import { ChannelSettings, ChannelState } from '../../redux/types/channel';
import { MinimumRunTime } from '../tooltips/MinimumRunTime';
import { ScheduleEnabled } from '../tooltips/ScheduleEnabled';
import { TimeSpanEnabled } from '../tooltips/TimeSpanEnabled';
import { RandomizeSwitch } from '../tooltips/RandomizeSwitch';
import { EndTime } from '../tooltips/EndTime';
import { RemoteConfigEnabled } from '../tooltips/RemoteConfigEnabled';
import { createChannelStateValidator } from '../validators';
import { validate } from '../../../../validators';
import { extractEventValue } from '../../../../utils';
import { RemoteUtils } from '../../utils/remoteUtils';
import { DateRangeEnabled } from '../tooltips/DateRangeEnabled';
import { ActiveOutsideDateRange } from '../tooltips/ActiveOutsideDateRange';
import { DateRangePicker } from 'rsuite';
import { DateRange, DisabledDateFunction } from "rsuite/DateRangePicker";
import { selectOverrideTime } from './channelStateForm/selectOverrideTime';
import { selectHomeAssistantIcon } from './channelStateForm/selectHomeAssistantIcon';
import { selectHomeAssistantTopicType } from './channelStateForm/selectHomeAssistantTopicType';
import { selectRunEvery } from './channelStateForm/selectRunEvery';
import { selectOffAfter } from './channelStateForm/selectOffAfter';
import { scheduleValueChanged } from './channelStateForm/scheduleValueChanged';
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { hotTimeHourFormat } from "./channelStateForm/hotTimeHourFormat";
import { selectControlPin } from "./channelStateForm/selectControlPin";
import { selectMarks } from "./channelStateForm/selectMarks";
import { setHotTimeHour } from "./channelStateForm/setHotTimeHour";
import { setStartTimeHour } from "./channelStateForm/setStartTimeHour";
import { selectWeekDays } from "./channelStateForm/selectWeekDays";

export function channelStateContent(data: ChannelState | undefined,
  loadData: () => Promise<void>, errorMessage: string | undefined,
  setData:Dispatch<React.SetStateAction<ChannelState | undefined>>,
  onSetChannelSettings: (settings: ChannelSettings) => void,
  oldControlPin: number, oldHomeAssistantTopicType: number,
  setFieldErrors: Dispatch<React.SetStateAction<ValidateFieldsError | undefined>>,
  saveData: () => Promise<void> | undefined,
  fieldErrors: ValidateFieldsError | undefined,
  updateFormValue: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  activeDateRange: DateRange, setDateRange: Dispatch<SetStateAction<DateRange>>,
  allowedMaxDays:  ((days: number) => DisabledDateFunction) | undefined,
  saving: boolean) {

  return () => {

    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    if (!data.schedule && RemoteUtils.isRemoteDevice()) {
      const networkErrorMessage = `Remote device ${RemoteUtils.getRemoteDeviceUrl()} unreachable`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    if (!data.schedule) {
      const networkErrorMessage = `Requested ${RemoteUtils.getLastPathItem(window.location.pathname)} is not configured`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    const extractDateValue = (date: Date | null) => {
      const timeHour: number = date?.getHours() || 0;
      const timeMinute: number = date?.getMinutes() || 0;
      return { timeHour, timeMinute };
    };

    const makeDateFromTime = (hour: number, minute: number) => {
      const newHour = (hour >= 24) ? 24 : hour;
      const newMinute = (minute >= 60) ? 0 : minute;
      return new Date(`Thu July 16 1964 ${newHour}:${newMinute}:00`);
    };

    const startTime: Date = makeDateFromTime(data.schedule.startTimeHour, data.schedule.startTimeMinute);
    const endTime: Date = makeDateFromTime(data.schedule.endTimeHour, data.schedule.endTimeMinute);

    const handleDateChange = (date: Date | null) => { };

    const handleSliderChange = (event: any, newValue: number | number[]) => {
      let slider = Array.isArray(newValue) ? 0 : newValue;
      setData({ ...data, schedule: { ...data.schedule, hotTimeHour: slider } });
    };

    const handleChannelScheduleValueChange = scheduleValueChanged(extractDateValue, setData, data);

    const handleDateRange = (dateRange: string) => {
      setData({ ...data, 'activeDateRange': JSON.parse(dateRange) });
    };

    const handleChannelStateValueChange = (name: keyof ChannelState) => (event: any) => {
      setData({ ...data, [name]: extractEventValue(event) });
    };

    const handleChannelSelectWeekDaysValueChange = (value: number[]) => {
      setData({ ...data, schedule: { ...data.schedule, 'weekDays': value } });
    };

    const marks = selectMarks();

    const formatHotTimeHour = hotTimeHourFormat();

    const restartSchedule = () => {
      onSetChannelSettings({ ...data, oldControlPin, oldHomeAssistantTopicType });
    };

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(createChannelStateValidator(data), data);
        saveData();
        restartSchedule();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    const styles = { width: 260, display: 'block', marginBottom: 10 };

    return (
      <>
        <ValidatedTextField
          fieldErrors={fieldErrors}
          name="name"
          label="Channel Name"
          fullWidth
          variant="outlined"
          value={data.name}
          style={{ height: 45 }}
          onChange={updateFormValue}
          margin="normal"
        />
        <BlockFormControlLabel
          control={<Checkbox
            checked={data.enabled}
            style={{ height: 45 }}
            onChange={handleChannelStateValueChange('enabled')}
            color="primary"
                   />}
          label={(<ScheduleEnabled buildVersion={data.buildVersion} />)}
        />
        {data.enabled && selectWeekDays(data, handleChannelSelectWeekDaysValueChange)}

        <BlockFormControlLabel
          control={<Checkbox
            checked={data.enableDateRange}
            style={{ height: 45 }}
            onChange={handleChannelStateValueChange('enableDateRange')}
            color="primary"
                   />}
          label={(<DateRangeEnabled />)}
        />
        {data.enableDateRange && (
          <div>
            <BlockFormControlLabel
              control={<Checkbox
                checked={data.activeOutsideDateRange}
                style={{ height: 45 }}
                onChange={handleChannelStateValueChange('activeOutsideDateRange')}
                color="primary"
                       />}
              label={(<ActiveOutsideDateRange />)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                size="lg"
                appearance="default"
                style={styles}
                value={activeDateRange}
                onChange={(newValue) => {
                  if (newValue) {
                    handleDateRange(JSON.stringify(newValue));
                    const dateRange = JSON.parse(JSON.stringify(newValue));
                    setDateRange([new Date(dateRange[0]), new Date(dateRange[1])]);
                  }
                }}
                disabledDate={allowedMaxDays?.(365)}
              />
            </LocalizationProvider>
          </div>
        )}
        {selectControlPin(data, handleChannelStateValueChange)}

        {data.enabled && (
          <div>
            <BlockFormControlLabel
              control={<Checkbox
                checked={data.enableTimeSpan}
                onChange={handleChannelStateValueChange('enableTimeSpan')}
                color="primary"
                       />}
              label={(<TimeSpanEnabled />)}
            />
            <BlockFormControlLabel
              control={<Checkbox
                checked={data.randomize}
                disabled={data.enableTimeSpan}
                onChange={handleChannelStateValueChange('randomize')}
                color="primary"
                       />}
              label={(<RandomizeSwitch />)}
            />

            {!data.enableTimeSpan && data.randomize && (
              <BlockFormControlLabel
                control={<Checkbox
                  checked={data.enableMinimumRunTime}
                  onChange={handleChannelStateValueChange('enableMinimumRunTime')}
                  color="primary"
                         />}
                label={(<MinimumRunTime />)}
              />)}
            {selectOverrideTime(data, handleChannelScheduleValueChange)}
            {selectHomeAssistantIcon(data, handleChannelStateValueChange)}
            {selectHomeAssistantTopicType(data, handleChannelStateValueChange)}
            {!data.enableTimeSpan && (
              <div>
                {selectRunEvery(data, handleChannelScheduleValueChange)}
                {selectOffAfter(data, handleChannelScheduleValueChange)}
              </div>
            )}
            <p />
            {setStartTimeHour(startTime, handleDateChange, handleChannelScheduleValueChange)}
            {!data.enableTimeSpan && data.randomize && (
              setHotTimeHour(formatHotTimeHour, data, marks, handleSliderChange)
            )}
            <p />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label={(<EndTime />)}
                value={endTime}
                onChange={handleDateChange}
                onAccept={handleChannelScheduleValueChange('endTimeHour')}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        )}
        <BlockFormControlLabel
          control={<Checkbox
            checked={data.enableRemoteConfiguration}
            onChange={handleChannelStateValueChange('enableRemoteConfiguration')}
            color="primary"
                   />}
          label={(<RemoteConfigEnabled />)}
        />
        {data.enableRemoteConfiguration &&
          <ValidatedTextField
            fieldErrors={fieldErrors}
            name="masterIPAddress"
            label="Master IP"
            fullWidth
            variant="outlined"
            value={data.masterIPAddress}
            onChange={updateFormValue}
            margin="normal"
          />}
        <ButtonRow mt={1}>
          <Button startIcon={<SaveIcon />} disabled={saving} variant="contained" color="primary" type="submit" onClick={validateAndSubmit}>
            Save
          </Button>
        </ButtonRow>
      </>
    );
  };
}



