/* eslint-disable max-len */
import { FC, Dispatch, useEffect, useState, Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from "notistack";
import { ValidateFieldsError } from "async-validator";
import Icon from '@mdi/react';
import { Box, Button, Checkbox } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { TextField, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  mdiPower, mdiAirConditioner, mdiCamera,
  mdiCeilingFanLight, mdiFan, mdiFridgeOutline,
  mdiGarage, mdiGarageVariant, mdiMicrowave,
  mdiPrinter, mdiPrinterWireless, mdiSpeaker,
  mdiTelevision, mdiTelevisionAmbientLight,
  mdiToaster, mdiToasterOven, mdiWaterPump,
  mdiLightbulbOn, mdiSpeakerMultiple
 } from '@mdi/js';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import type {} from '@mui/lab/themeAugmentation';

import { SectionContent, FormLoader, BlockFormControlLabel, ButtonRow, ValidatedTextField } from '../../../../components';
import { updateValue, useRest } from '../../../../utils';

import { AppState } from '../../redux/store';
import { uiLoaderProjector } from '../../redux/selectors/uiLoaderProjector';
import { setChannelSettings} from '../../redux/actions/channel';
import { channelSettingsSelector } from '../../redux/selectors/channel';
import { removeLoader } from '../../redux/actions/ui';
import { Loader, LoaderActions } from '../../redux/types/ui';
import { CHANNEL, Channels, ChannelSettings, ChannelSettingsActions, ChannelState, RESTART } from '../../redux/types/channel';

import { Schedule } from '../../redux/types/schedule';
import { MinimumRunTime } from '../tooltips/MinimumRunTime';
import { SwitchType } from '../tooltips/SwitchType';
import { ScheduleEnabled } from '../tooltips/ScheduleEnabled';
import { TimeSpanEnabled } from '../tooltips/TimeSpanEnabled';
import { RandomizeSwitch } from '../tooltips/RandomizeSwitch';
import { OverrideTime } from '../tooltips/OverrideTime';
import { MDIIcon } from '../tooltips/MDIicon';
import { RunEvery } from '../tooltips/RunEvery';
import { OffAfter } from '../tooltips/OffAfter';
import { StartTime } from '../tooltips/StartTime';
import { EndTime } from '../tooltips/EndTime';
import { HotTime } from '../tooltips/HotTime';
import { ControlPin } from '../tooltips/ControlPin';
import { RemoteConfigEnabled } from '../tooltips/RemoteConfigEnabled';
import { createChannelStateValidator } from '../validators';
import { validate } from '../../../../validators';
import { extractEventValue } from '../../../../utils';
import { ChannelStateRestFormProps } from "./rest";
import * as Api from '../../api/channelApi';

import '../svg-styles.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RemoteUtils } from '../../utils/remoteUtils';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import { DateRangeEnabled } from '../tooltips/DateRangeEnabled';
import { ActiveOutsideDateRange } from '../tooltips/ActiveOutsideDateRange';

const theme = createTheme({
  components: {
    // Name of the component
    MuiPaper: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          padding: '5px',
          margin: '5px'
        },
      },
    }
  },
});

const ChannelStateRestForm: FC<ChannelStateRestFormProps> = ({
  loader, onRemoveLoader, onSetChannelSettings, channelId
}) => {
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const [oldControlPin, setOldControlPin] = useState<number>(-1);
  const [oldHomeAssistantTopicType, setOldHomeAssistantTopicType] = useState<number>(-1);
  const [activeDateRange, setDateRange] = useState<DateRange<Date>>([null, null]);

  const read = useCallback(
    () => Api.createReadChannelApi(channelId)
    ,[channelId]
  );

  const update = useCallback(
    (channelState: ChannelState) => Api.createUpdateChannelApi(channelId, channelState)
    ,[channelId]
  );

  const {
    loadData, saveData, saving, setData, data, errorMessage
  } = useRest<ChannelState>({ read, update });

  const updateFormValue = updateValue(setData);

  useEffect(() => {
    if(data && (oldControlPin === -1)){
      setOldControlPin(data.controlPin);
    }
  }, [data, oldControlPin]);

  useEffect(() => {
    if(data && (oldHomeAssistantTopicType === -1)){
      setOldHomeAssistantTopicType(data.homeAssistantTopicType);
    }
  }, [data, oldHomeAssistantTopicType]);

  useEffect(() => {
    if(data && data?.activeDateRange){
     setDateRange([new Date(data?.activeDateRange[0]),new Date(data?.activeDateRange[1])]);
    }
  }, [data]);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    if(!data.schedule && RemoteUtils.isRemoteDevice()){
      const networkErrorMessage = `Remote device ${RemoteUtils.getRemoteDeviceUrl()} unreachable`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    if(!data.schedule){
      const networkErrorMessage = `Requested ${RemoteUtils.getLastPathItem(window.location.pathname)} is not configured`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    const extractDateValue =(date: Date | null) => {
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

      const handleDateChange = (date: Date | null) => {};

      const handleSliderChange = (event: any, newValue: number | number[]) => {
        let slider =  Array.isArray(newValue)? 0 : newValue ;
        setData({ ...data, schedule: {...data.schedule, hotTimeHour: slider} });
      };

    const handleChannelScheduleValueChange = (name: keyof Schedule) => (event: any) => {
      switch (name) {
        case 'startTimeHour':
          const _startTime = extractDateValue(event);
          setData({ ...data, schedule: {...data.schedule,
            startTimeHour: _startTime.timeHour, startTimeMinute: _startTime.timeMinute } });
          break;
          case 'endTimeHour':
            const _endTime = extractDateValue(event);
            setData({ ...data, schedule: {...data.schedule,
              endTimeHour: _endTime.timeHour, endTimeMinute: _endTime.timeMinute } });
          break;
        default:
          setData({ ...data, schedule: {...data.schedule, [name]: extractEventValue(event) } });
          break;
      }
    };

    const handleDateRange = (dateRange: string) => {
      setData({ ...data, 'activeDateRange' : JSON.parse(dateRange) });
    };

    const handleChannelStateValueChange = (name: keyof ChannelState) => (event: any) => {
        setData({ ...data, [name]: extractEventValue(event) });
    };

    const marks = [
      {
        value: 0,
        label: '0hr',
      },
      {
        value: 1,
        label: '1hr',
      },
      {
        value: 2,
        label: '2hr',
      },
      {
        value: 3,
        label: '3hr',
      },
      {
        value: 4,
        label: '4hr',
      }
    ];

    const formatHotTimeHour = (hotTimeHour: number) => {
      const totalTimeSeconds = hotTimeHour * 3600;
      const hours: number = Math.floor((hotTimeHour));
      const minutes: number = Math.floor(((totalTimeSeconds - (hours*3600)) / 60));
      const seconds: number = Math.floor(totalTimeSeconds - (hours*3600) - (minutes * 60));

      let hString: string = hours.toString();
      if(hours < 10){hString = "0" + hours;}
      if (hours === 0){
        hString="";
      }else{
        hString= hString + "h ";
      }

      let mString: string = minutes.toString();
      if(minutes < 10){mString = "0" + minutes;}
      if (minutes === 0){
        mString="";
      }else{
        mString= mString + "m ";
      }

      let sString: string = seconds.toString();
      if(seconds < 10){sString = "0" + seconds;}
      if (seconds === 0){
        sString="";
      }else{
        sString= sString + "s";
      }

      return (hString + mString + sString);
    };

    const restartSchedule = () => {
      onSetChannelSettings({...data, oldControlPin, oldHomeAssistantTopicType});
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

    return (
      <>
        <ValidatedTextField
          fieldErrors={fieldErrors}
          name="name"
          label= "Channel Name"
          fullWidth
          variant="outlined"
          value={data.name}
          style={{height:45}}
          onChange={updateFormValue}
          margin="normal"
        />
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enabled}
                style={{height:45}}
                onChange={handleChannelStateValueChange('enabled')}
                color="primary"
            />
            }
            label={(<ScheduleEnabled/>)}
        />

        <BlockFormControlLabel
                    control={
                    <Checkbox
                        checked={data.enableDateRange}
                        style={{height:45}}
                        onChange={handleChannelStateValueChange('enableDateRange')}
                        color="primary"
                    />
                    }
                    label={(<DateRangeEnabled/>)}
        />
        {data.enableDateRange && (
          <div>
            <BlockFormControlLabel
                    control={
                    <Checkbox
                        checked={data.activeOutsideDateRange}
                        style={{height:45}}
                        onChange={handleChannelStateValueChange('activeOutsideDateRange')}
                        color="primary"
                    />
                    }
                    label={(<ActiveOutsideDateRange/>)}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                    startText="Start-Date"
                    endText="End-Date"
                    value={activeDateRange}
                      onChange={(newValue) => {
                        handleDateRange(JSON.stringify(newValue));
                        setDateRange(newValue);
                      }}
                    renderInput={(startProps, endProps) => (
                      <Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </Fragment>
                    )}
                  />
            </LocalizationProvider>
          </div>

      )}

        {data.enabled && (
          <div>
            <BlockFormControlLabel
              control={
                <Select
                  style={{ marginLeft: 10, height: 30 }}
                  value={data.controlPin}
                  disabled={data.enabled}
                  onChange={handleChannelStateValueChange('controlPin')}
                >
                  <MenuItem value={0}>GPIO0</MenuItem>
                  <MenuItem value={4}>GPIO4</MenuItem>
                  <MenuItem value={5}>GPIO5</MenuItem>
                  <MenuItem value={12}>GPIO12</MenuItem>
                  <MenuItem value={13}>GPIO13</MenuItem>
                  <MenuItem value={14}>GPIO14</MenuItem>
                  <MenuItem value={18}>GPIO18</MenuItem>
                  <MenuItem value={19}>GPIO19</MenuItem>
                  <MenuItem value={21}>GPIO21</MenuItem>
                </Select>
              }
              label={(<ControlPin/>)}
            />

          <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableTimeSpan}
                onChange={handleChannelStateValueChange('enableTimeSpan')}
                color="primary"
            />
            }
            label={(<TimeSpanEnabled/>)}
          />
          <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.randomize}
                disabled={data.enableTimeSpan}
                onChange={handleChannelStateValueChange('randomize')}
                color="primary"
            />
            }
            label={(<RandomizeSwitch/>)}
          />

        {!data.enableTimeSpan && data.randomize && (
         <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableMinimumRunTime}
                onChange={handleChannelStateValueChange('enableMinimumRunTime')}
                color="primary"
            />
            }
            label={(<MinimumRunTime/>)}
         />)}
        <BlockFormControlLabel
          control={
            <Select
              style={{ marginLeft: 10, height: 30}}
              value={data.schedule.overrideTime}
              onChange={handleChannelScheduleValueChange('overrideTime')}
            >
            <MenuItem value={960}>none</MenuItem>
            <MenuItem value={0.033}>02 seconds</MenuItem>
            <MenuItem value={0.05}>03 seconds</MenuItem>
            <MenuItem value={0.066}>04 seconds</MenuItem>
            <MenuItem value={0.083}>05 seconds</MenuItem>
            <MenuItem value={0.1}>06 seconds</MenuItem>
            <MenuItem value={0.166}>10 seconds</MenuItem>
            <MenuItem value={0.2}>12 seconds</MenuItem>
            <MenuItem value={0.25}>15 seconds</MenuItem>
            <MenuItem value={0.333}>20 seconds</MenuItem>
            <MenuItem value={0.5}>30 seconds</MenuItem>
            <MenuItem value={1}>1 minute</MenuItem>
            <MenuItem value={2}>2 minutes</MenuItem>
            <MenuItem value={3}>3 minutes</MenuItem>
            <MenuItem value={4}>4 minutes</MenuItem>
            <MenuItem value={5}>5 minutes</MenuItem>
            <MenuItem value={6}>6 minutes</MenuItem>
            <MenuItem value={8}>8 minutes</MenuItem>
            <MenuItem value={10}>10 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={20}>20 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={40}>40 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={120}>2 hours</MenuItem>
            <MenuItem value={150}>2.5 hours</MenuItem>
            <MenuItem value={180}>3 hours</MenuItem>
            <MenuItem value={210}>3.5 hours</MenuItem>
            <MenuItem value={240}>4 hours</MenuItem>
            </Select>
          }
          label={(<OverrideTime/>)}
        />
        <BlockFormControlLabel
              control={
                <Select
                  style={{ marginLeft: 10, verticalAlign: "middle", height: 30 }}
                  value={data.homeAssistantIcon}
                  onChange={handleChannelStateValueChange('homeAssistantIcon')}
                >
                <MenuItem value={"mdi:air-conditioner"}><Icon size={1} path={mdiAirConditioner}/>air-conditioner</MenuItem>
                <MenuItem value={"mdi:camera"}><Icon size={1} path={mdiCamera} />camera</MenuItem>
                <MenuItem value={"mdi:ceiling-fan-light"}><Icon size={1} path={mdiCeilingFanLight}/>ceiling-fan-light</MenuItem>
                <MenuItem value={"mdi:fan"}><Icon size={1} path={mdiFan}/>fan</MenuItem>
                <MenuItem value={"mdi:fridge"}><Icon size={1} path={mdiFridgeOutline}/>fridge</MenuItem>
                <MenuItem value={"mdi:garage"}><Icon size={1} path={mdiGarage}/>garage</MenuItem>
                <MenuItem value={"mdi:garage-variant"}><Icon size={1} path={mdiGarageVariant}/>garage-variant</MenuItem>
                <MenuItem value={"mdi:lightbulb"}><Icon size={1} path={mdiLightbulbOn}/>light</MenuItem>
                <MenuItem value={"mdi:microwave"}><Icon size={1} path={mdiMicrowave}/>microwave</MenuItem>
                <MenuItem value={"mdi:power"}><Icon size={1} path={mdiPower}/>power</MenuItem>
                <MenuItem value={"mdi:printer"}><Icon size={1} path={mdiPrinter}/>printer</MenuItem>
                <MenuItem value={"mdi:printer-wireless"}><Icon size={1} path={mdiPrinterWireless}/>printer-wireless</MenuItem>
                <MenuItem value={"mdi:speaker"}><Icon size={1} path={mdiSpeaker}/>speaker</MenuItem>
                <MenuItem value={"mdi:speaker-wireless"}><Icon size={1} path={mdiSpeakerMultiple}/>speaker-wireless</MenuItem>
                <MenuItem value={"mdi:television-ambient-light"}><Icon size={1} path={mdiTelevisionAmbientLight}/>television-ambient-light</MenuItem>
                <MenuItem value={"mdi:television"}><Icon size={1} path={mdiTelevision}/>television</MenuItem>
                <MenuItem value={"mdi:toaster"}><Icon size={1} path={mdiToaster}/>toaster</MenuItem>
                <MenuItem value={"mdi:toaster-oven"}><Icon size={1} path={mdiToasterOven}/>toaster-oven</MenuItem>
                <MenuItem value={"mdi:water-pump"}><Icon size={1} path={mdiWaterPump}/>water pump</MenuItem>
                </Select>
              }
              label={(<MDIIcon/>)}
        />
        <BlockFormControlLabel
              control={
                <Select
                  style={{ marginLeft: 10, height: 30 }}
                  value={data.homeAssistantTopicType}
                  onChange={handleChannelStateValueChange('homeAssistantTopicType')}
                >
                <MenuItem value={0}>Light</MenuItem>
                <MenuItem value={1}>Switch</MenuItem>
                </Select>
              }
              label={(<SwitchType/>)}
        />
        {!data.enableTimeSpan && (
          <div>
            <BlockFormControlLabel
              control={
                <Select
                  style={{ marginLeft: 10, height: 30 }}
                  disabled={data.enableTimeSpan}
                  value={data.schedule.runEvery}
                  onChange={handleChannelScheduleValueChange('runEvery')}
                >
                <MenuItem value={0.033}>02 seconds</MenuItem>
                <MenuItem value={0.05}>03 seconds</MenuItem>
                <MenuItem value={0.066}>04 seconds</MenuItem>
                <MenuItem value={0.083}>05 seconds</MenuItem>
                <MenuItem value={0.1}>06 seconds</MenuItem>
                <MenuItem value={0.166}>10 seconds</MenuItem>
                <MenuItem value={0.2}>12 seconds</MenuItem>
                <MenuItem value={0.25}>15 seconds</MenuItem>
                <MenuItem value={0.333}>20 seconds</MenuItem>
                <MenuItem value={0.5}>30 seconds</MenuItem>
                <MenuItem value={1}>1 minute</MenuItem>
                <MenuItem value={2}>2 minutes</MenuItem>
                <MenuItem value={3}>3 minutes</MenuItem>
                <MenuItem value={4}>4 minutes</MenuItem>
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={6}>6 minutes</MenuItem>
                <MenuItem value={8}>8 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={20}>20 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={40}>40 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
                <MenuItem value={180}>3 hours</MenuItem>
                <MenuItem value={240}>4 hours</MenuItem>
                <MenuItem value={360}>6 hours</MenuItem>
                <MenuItem value={480}>8 hours</MenuItem>
                <MenuItem value={720}>12 hours</MenuItem>
                <MenuItem value={1440}>24 hours</MenuItem>
                </Select>
              }
              label={(<RunEvery/>)}
            />
            <BlockFormControlLabel
              control={
                <Select
                  style={{ marginLeft: 10, height: 30 }}
                  disabled={data.enableTimeSpan}
                  value={data.schedule.offAfter}
                  onChange={handleChannelScheduleValueChange('offAfter')}
                >
                <MenuItem value={0.016}>01 seconds</MenuItem>
                <MenuItem value={0.033}>02 seconds</MenuItem>
                <MenuItem value={0.05}>03 seconds</MenuItem>
                <MenuItem value={0.066}>04 seconds</MenuItem>
                <MenuItem value={0.083}>05 seconds</MenuItem>
                <MenuItem value={0.1}>06 seconds</MenuItem>
                <MenuItem value={0.166}>10 seconds</MenuItem>
                <MenuItem value={0.2}>12 seconds</MenuItem>
                <MenuItem value={0.25}>15 seconds</MenuItem>
                <MenuItem value={0.333}>20 seconds</MenuItem>
                <MenuItem value={0.5}>30 seconds</MenuItem>
                <MenuItem value={1}>1 minute</MenuItem>
                <MenuItem value={2}>2 minutes</MenuItem>
                <MenuItem value={3}>3 minutes</MenuItem>
                <MenuItem value={4}>4 minutes</MenuItem>
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={6}>6 minutes</MenuItem>
                <MenuItem value={8}>8 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={20}>20 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={40}>40 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
                <MenuItem value={180}>3 hours</MenuItem>
                <MenuItem value={240}>4 hours</MenuItem>
                <MenuItem value={360}>6 hours</MenuItem>
                <MenuItem value={480}>8 hours</MenuItem>
                <MenuItem value={600}>10 hours</MenuItem>
                <MenuItem value={720}>12 hours</MenuItem>
                <MenuItem value={780}>13 hours</MenuItem>
                <MenuItem value={960}>16 hours</MenuItem>
                <MenuItem value={1080}>18 hours</MenuItem>
                <MenuItem value={1200}>20 hours</MenuItem>
                </Select>
              }
              label={(<OffAfter/>)}
            />
          </div>
        )}
         <p/>
        <LocalizationProvider dateAdapter={AdapterDateFns} >
          <TimePicker
            label={(<StartTime/>)}
            value={startTime}
            onChange={handleDateChange}
            onAccept={handleChannelScheduleValueChange('startTimeHour')}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {!data.enableTimeSpan && data.randomize && (
        <div>
          <Typography id="discrete-slider" gutterBottom>
          {(<HotTime/>)}{formatHotTimeHour(data.schedule.hotTimeHour)}
          </Typography>
          <Slider
            disabled={!data.randomize}
            defaultValue={data.schedule.hotTimeHour}
            aria-labelledby="discrete-slider-custom"
            step={0.0167}
            valueLabelDisplay="off"
            marks={marks}
            min={0}
            max={4}
            onChange={handleSliderChange}
          />
        </div>
        )}
        <p/>
         <LocalizationProvider dateAdapter={AdapterDateFns} >
          <TimePicker
            label={(<EndTime/>)}
            value={endTime}
            onChange={handleDateChange}
            onAccept={handleChannelScheduleValueChange('endTimeHour')}
            renderInput={(params) => <TextField {...params} />}
          />
         </LocalizationProvider>
          </div>
        )}
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableRemoteConfiguration}
                onChange={handleChannelStateValueChange('enableRemoteConfiguration')}
                color="primary"
            />
            }
            label={(<RemoteConfigEnabled/>)}
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

  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const restartSuccessMessage = (name: string | undefined, controlPin: number) => {
    if(loader.success){
      enqueueSnackbar(name +  " Schedule Restarted Successfully!", { variant: 'success' });
      setOldControlPin(controlPin);
      }else{
        enqueueSnackbar(name + " " + loader.errorMessage, { variant: 'error' });
      }
      onRemoveLoader(`${CHANNEL}${RESTART}`);
  };

  useEffect(() => {
    if(loader && !loader.loading ){
      restartSuccessMessage(data?.name, data?.controlPin || -1);
    }
  },[loader, enqueueSnackbar, data?.name, restartSuccessMessage, data?.controlPin]);

  return (
    <ThemeProvider theme={theme}>
      <SectionContent title='Channel Schedule' titleGutter>
        {content()}
      </SectionContent>
    </ThemeProvider>
  );

};
const mapStateToProps = (state: AppState ) => {
  const channels: Channels = channelSettingsSelector(state);
  const loader: Loader = uiLoaderProjector(`${CHANNEL}${RESTART}`)(state);
  return {channels, loader};
};

const mapDispatchToProps = (dispatch: Dispatch<ChannelSettingsActions | LoaderActions>) => {
  return {
      onSetChannelSettings: (settings: ChannelSettings) => {
        dispatch(setChannelSettings(settings));
      },
      onRemoveLoader: (feature: string) => {
        dispatch(removeLoader(feature));
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelStateRestForm);
