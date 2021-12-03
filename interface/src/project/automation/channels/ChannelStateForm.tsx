import React, { Dispatch, useEffect } from 'react';
import {TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { TextField, Checkbox, Typography } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from "@material-ui/core/MenuItem";
import Grid from '@material-ui/core/Grid';
import Select from "@material-ui/core/Select";
import DateFnsUtils from '@date-io/date-fns';
import SpeakerIcon from '@material-ui/icons/Speaker';
import LinkedCameraIcon from '@material-ui/icons/LinkedCamera';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import TvIcon from '@material-ui/icons/Tv';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import PrintIcon from '@material-ui/icons/Print';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import KitchenIcon from '@material-ui/icons/Kitchen';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ToysIcon from '@material-ui/icons/Toys';
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
import SettingsSystemDaydreamIcon from '@material-ui/icons/SettingsSystemDaydream';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import { makeStyles } from "@material-ui/core/styles";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';

import { RestFormProps, FormActions, FormButton, BlockFormControlLabel, extractEventValue } from '../../../components';

import { setChannelSettings} from '../redux/actions/channel';
import { channelSettingsSelector } from '../redux/selectors/channel';
import { removeLoader } from '../redux/actions/ui';
import { Loader, LoaderActions, RemoveLoaderType } from '../redux/types/ui';

import { ChannelState, ChannelSettingsActions, Channels,
  ChannelSettings, CHANNEL, RESTART, SetChannelSettingsType } from '../redux/types/channel';
import {
  CHANNEL_ONE_CONTROL_PIN,
  CHANNEL_TWO_CONTROL_PIN,
  CHANNEL_THREE_CONTROL_PIN,
  CHANNEL_FOUR_CONTROL_PIN,
 } from '../constants';
import { connect } from 'react-redux';
import { AppState } from '../redux/store';
import { uiLoaderProjector } from '../redux/selectors/uiLoaderProjector';
import { Schedule } from '../types';
import { MinimumRunTime } from './tooltips/MinimumRunTime';
import { SwitchType } from './tooltips/SwitchType';
import { ScheduleEnabled } from './tooltips/ScheduleEnabled';
import { TimeSpanEnabled } from './tooltips/TimeSpanEnabled';
import { RandomizeSwitch } from './tooltips/RandomizeSwitch';
import { OverrideTime } from './tooltips/OverrideTime';
import { MDIIcon } from './tooltips/MDIicon';
import { RunEvery } from './tooltips/RunEvery';
import { OffAfter } from './tooltips/OffAfter';
import { StartTime } from './tooltips/StartTime';
import { EndTime } from './tooltips/EndTime';
import { HotTime } from './tooltips/HotTime';
import { ControlPin } from './tooltips/ControlPin';
import './svg-styles.css';
import { RemoteUtils } from '../../../utils/remoteUtils';
import { RemoteConfigEnabled } from './tooltips/RemoteConfigEnabled';
import { isIP } from '../../../validators';

const useStyles = makeStyles({
  alert: {
    color: "#fc0303"
  },
  ip: {
    color: "#2205fa"
  }
});

type ChannelStateRestControllerFormProps = RestFormProps<ChannelState>
& ({channels: Channels, loader: Loader, onSetChannelSettings: SetChannelSettingsType, onRemoveLoader: RemoveLoaderType });

const ChannelStateForm = (props : ChannelStateRestControllerFormProps) => {

  const { channels, loader, enqueueSnackbar, data, saveData, loadData,
    setData, handleValueChange, onSetChannelSettings, onRemoveLoader } = props;

  const restartSuccessMessage = (name: string, loader: Loader) => {
    if(loader.success){
      enqueueSnackbar(name +  " Schedule Restarted Successfully!", { variant: 'success' });
      }else{
        enqueueSnackbar(name + " " + loader.errorMessage, { variant: 'error' });
      }
      onRemoveLoader(`${CHANNEL}${RESTART}`);
  }

  ValidatorForm.addValidationRule('isIP', isIP);

  useEffect(() => {
    if(loader && !loader.loading && channels ){
      const { channelOne, channelTwo, channelThree, channelFour } = channels;
      switch (data.controlPin) {
        case CHANNEL_ONE_CONTROL_PIN:
          if (channelOne){
            restartSuccessMessage(channelOne.name, loader);
          }
          break;
        case CHANNEL_TWO_CONTROL_PIN:
          if (channelTwo){
            restartSuccessMessage(channelTwo.name, loader);;
          }
          break;
        case CHANNEL_THREE_CONTROL_PIN:
          if (channelThree){
            restartSuccessMessage(channelThree.name, loader);
          }
          break;
        case CHANNEL_FOUR_CONTROL_PIN:
          if (channelFour){
            restartSuccessMessage(channelFour.name, loader);
          }
          break;
        default:
          break;
      }
    }
  },[loader, enqueueSnackbar, channels, data.controlPin]);

    const restartSchedule = () => {
      switch (data.controlPin) {
        case CHANNEL_ONE_CONTROL_PIN:
          onSetChannelSettings(data, 1);
          break;
        case CHANNEL_TWO_CONTROL_PIN:
          onSetChannelSettings(data, 2);
        break;
        case CHANNEL_THREE_CONTROL_PIN:
          onSetChannelSettings(data, 3);
        break;
        case CHANNEL_FOUR_CONTROL_PIN:
          onSetChannelSettings(data, 4);
        break;
        default:
        break;
      }
    }
  
    const checkForRequiredValues = () => {
      if(data.enableTimeSpan) return true;
      
      if(!(data.schedule.runEvery > 0)){
        enqueueSnackbar("RunEvery required!", { variant: 'error' });
        return false;
      }

      if(!(data.schedule.offAfter > 0)){
        enqueueSnackbar("OffAfter required!", { variant: 'error' });
        return false;
      }

      if(!(data.schedule.runEvery > data.schedule.offAfter)){
        enqueueSnackbar("RunEvery must be greater than OffAfter!", { variant: 'error' });
        return false;
      }
      return true;
    }
    const saveFormAndRestartSchedule = () => {
      if(checkForRequiredValues()){
        saveData();
        restartSchedule();
      }
    }

    const makeDateFromTime = (hour: number, minute: number) => {
      const newHour = (hour >= 24) ? 24 : hour;
      const newMinute = (minute >= 60) ? 0 : minute;
      return new Date(`Thu July 16 1964 ${newHour}:${newMinute}:00`);
    }
    
    const startTime: Date = makeDateFromTime(data.schedule.startTimeHour, data.schedule.startTimeMinute);
    const endTime: Date = makeDateFromTime(data.schedule.endTimeHour, data.schedule.endTimeMinute);
  
      const handleDateChange = (date: Date | null) => {};

      const handleSliderChange = (event: any, newValue: number | number[]) => {
        let slider =  Array.isArray(newValue)? 0 : newValue ;
        setData({ ...data, schedule: {...data.schedule, hotTimeHour: slider} });
      };
  
      const extractDateValue =(date: Date | null) => {
        const timeHour: number = date?.getHours() || 0;
        const timeMinute: number = date?.getMinutes() || 0;  
        return { timeHour, timeMinute };
      }
  
      const handleScheduleValueChange = (name: keyof Schedule) => (event: any) => {
        switch (name) {
          case 'startTimeHour':
            const startTime = extractDateValue(event);
            setData({ ...data, schedule: {...data.schedule,
              startTimeHour: startTime.timeHour, startTimeMinute: startTime.timeMinute } });
            break;
            case 'endTimeHour':
              const endTime = extractDateValue(event);
              setData({ ...data, schedule: {...data.schedule,
                endTimeHour: endTime.timeHour, endTimeMinute: endTime.timeMinute } });
            break;
          default:
            setData({ ...data, schedule: {...data.schedule, [name]: extractEventValue(event) } });
            break;
        }
      }
      
      const handleHomeAssistantTopicType = (name: keyof ChannelState) => (event: any) => {
        const homeAssistantTopicType: number = event.target.value;
        setData({ ...data, homeAssistantTopicType });
      };

      const handleHomeAssistantIcon = (name: keyof ChannelState) => (event: any) => {
        const homeAssistantIcon: string = event.target.value;
        setData({ ...data, homeAssistantIcon });
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
      }

    const classes = useStyles();

    return (
      <ValidatorForm onSubmit={saveFormAndRestartSchedule}>
       {RemoteUtils.isRemoteIpDevice() && 
       <Typography variant="body1" color="secondary"className={classes.alert} >
          Remote configuration enabled for device:
          <span className={classes.ip}>{RemoteUtils.getRemoteDeviceIp()}</span>
        </Typography>
       }
        <TextField
          name="name"
          label= "Channel Name"
          fullWidth
          variant="outlined"
          value={data.name}
          onChange={handleValueChange('name')}
          margin="normal"
        />
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enabled}
                onChange={handleValueChange('enabled')}
                color="primary"
            />
            }
            label={(<ScheduleEnabled/>)}
        />
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableTimeSpan}
                onChange={handleValueChange('enableTimeSpan')}
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
                onChange={handleValueChange('randomize')}
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
                onChange={handleValueChange('enableMinimumRunTime')}
                color="primary"
            />
            }
            label={(<MinimumRunTime/>)}
        />)}
        <BlockFormControlLabel
          control={
            <Select style={{ marginLeft: 10 }}
            value={data.schedule.overrideTime}
            onChange={handleScheduleValueChange('overrideTime')}>
            <MenuItem value={0.033}>02 seconds</MenuItem>
            <MenuItem value={0.05}>03 seconds</MenuItem>
            <MenuItem value={0.067}>04 seconds</MenuItem>
            <MenuItem value={0.083}>05 seconds</MenuItem>
            <MenuItem value={0.1}>06 seconds</MenuItem>
            <MenuItem value={0.167}>10 seconds</MenuItem>
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
        <br/>
        <BlockFormControlLabel
              control={
                <Select style={{ marginLeft: 10, verticalAlign: "middle" }}
                value={data.homeAssistantIcon}
                onChange={handleHomeAssistantIcon('homeAssistantIcon')}>
                <MenuItem value={"mdi:lightbulb"}><EmojiObjectsIcon/>light</MenuItem>
                <MenuItem value={"mdi:speaker-wireless"}><SpeakerGroupIcon/>speaker-wireless</MenuItem>
                <MenuItem value={"mdi:speaker"}><SpeakerIcon/>speaker</MenuItem>
                <MenuItem value={"mdi:garage-variant"}><DriveEtaIcon/>garage-variant</MenuItem>
                <MenuItem value={"mdi:garage"}><DriveEtaIcon/>garage</MenuItem>
                <MenuItem value={"mdi:power"}><PowerSettingsNewIcon/>power</MenuItem>
                <MenuItem value={"mdi:fridge"}><KitchenIcon/>fridge</MenuItem>
                <MenuItem value={"mdi:microwave"}><AutorenewIcon/>microwave</MenuItem>
                <MenuItem value={"mdi:toaster-oven"}><ViewHeadlineIcon/>toaster-oven</MenuItem>
                <MenuItem value={"mdi:toaster"}><SettingsSystemDaydreamIcon/>toaster</MenuItem>
                <MenuItem value={"mdi:fan"}><ToysIcon/>fan</MenuItem>
                <MenuItem value={"mdi:fan-chevron-down"}><ToysIcon/>fan-chevron-down</MenuItem>
                <MenuItem value={"mdi:water-pump"}><LocalGasStationIcon/>pump</MenuItem>
                <MenuItem value={"mdi:camera"}><PhotoCameraIcon/>camera</MenuItem>
                <MenuItem value={"mdi:camera-wireless"}><LinkedCameraIcon/>camera-wireless</MenuItem>
                <MenuItem value={"mdi:printer-wireless"}><PrintIcon/>printer-wireless</MenuItem>
                <MenuItem value={"mdi:printer"}><PrintIcon/>printer</MenuItem>
                <MenuItem value={"mdi:television-ambient-light"}><PersonalVideoIcon/>television-ambient-light</MenuItem>
                <MenuItem value={"mdi:television"}><TvIcon/>television</MenuItem>
                <MenuItem value={"mdi:air-conditioner"}><AcUnitIcon/>air-conditioner</MenuItem>
              </Select>
              }
              label={(<MDIIcon/>)}
        />
        <br/>
        <BlockFormControlLabel
              control={
                <Select style={{ marginLeft: 10 }}
                value={data.homeAssistantTopicType}
                onChange={handleHomeAssistantTopicType('homeAssistantTopicType')}>
                <MenuItem value={0}>Light</MenuItem>
                <MenuItem value={1}>Switch</MenuItem>
              </Select>
              }
              label={(<SwitchType/>)}
        />
        <br/>
        <BlockFormControlLabel
              control={
                <Select style={{ marginLeft: 10 }}
                value={data.controlPin}
                onChange={handleHomeAssistantTopicType('controlPin')}>
                <MenuItem value={0}>GPIO0</MenuItem>
                <MenuItem value={4}>GPIO4</MenuItem>
                <MenuItem value={5}>GPIO5</MenuItem>
                <MenuItem value={12}>GPIO12</MenuItem>
                <MenuItem value={13}>GPIO13</MenuItem>
                <MenuItem value={14}>GPIO14</MenuItem>
              </Select>
              }
              label={(<ControlPin/>)}
        />
        <br/>
        {!data.enableTimeSpan && (
          <div>
            <BlockFormControlLabel
              control={
                <Select style={{ marginLeft: 10 }} 
                disabled={data.enableTimeSpan}
                value={data.schedule.runEvery}
                onChange={handleScheduleValueChange('runEvery')}>
                <MenuItem value={0.033}>02 seconds</MenuItem>
                <MenuItem value={0.05}>03 seconds</MenuItem>
                <MenuItem value={0.067}>04 seconds</MenuItem>
                <MenuItem value={0.083}>05 seconds</MenuItem>
                <MenuItem value={0.1}>06 seconds</MenuItem>
                <MenuItem value={0.167}>10 seconds</MenuItem>
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
            <p/>
            <BlockFormControlLabel
              control={
                <Select style={{ marginLeft: 10 }}
                disabled={data.enableTimeSpan}
                value={data.schedule.offAfter}
                onChange={handleScheduleValueChange('offAfter')}>
                <MenuItem value={0.017}>01 seconds</MenuItem>
                <MenuItem value={0.033}>02 seconds</MenuItem>
                <MenuItem value={0.05}>03 seconds</MenuItem>
                <MenuItem value={0.067}>04 seconds</MenuItem>
                <MenuItem value={0.083}>05 seconds</MenuItem>
                <MenuItem value={0.1}>06 seconds</MenuItem>
                <MenuItem value={0.167}>10 seconds</MenuItem>
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
            <p/>
          </div>
        )}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="flex-start">
            <KeyboardTimePicker
                margin="normal"
                label={(<StartTime/>)}
                value={startTime}
                onChange={handleDateChange}
                onAccept={handleScheduleValueChange('startTimeHour')}
                KeyboardButtonProps={{
                'aria-label': 'change time',
                }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="flex-start">
            <KeyboardTimePicker
                margin="normal"
                label={(<EndTime/>)}
                value={endTime}
                onChange={handleDateChange}
                onAccept={handleScheduleValueChange('endTimeHour')}
                KeyboardButtonProps={{
                'aria-label': 'change time',
                }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <FormActions>
          <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
            Save
          </FormButton>
          <FormButton variant="contained" color="secondary" onClick={loadData}>
            Reset
          </FormButton>
        </FormActions>
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableRemoteConfiguration}
                onChange={handleValueChange('enableRemoteConfiguration')}
                color="primary"
            />
            }
            label={(<RemoteConfigEnabled/>)}
        />
        {data.enableRemoteConfiguration &&
         <TextValidator
              validators={['required', 'isIP']}
              errorMessages={['Master IP is required', 'Must be an IP address']}
              name="masterIPAddress"
              label="Master IP"
              fullWidth
              variant="outlined"
              value={data.masterIPAddress}
              onChange={handleValueChange('masterIPAddress')}
              margin="normal"
            />
        }
      </ValidatorForm>
    );
}

const mapStateToProps = (state: AppState ) => {
  const channels: Channels = channelSettingsSelector(state);
  const loader: Loader = uiLoaderProjector(`${CHANNEL}${RESTART}`)(state);
  return {channels, loader}
}

const mapDispatchToProps = (dispatch: Dispatch<ChannelSettingsActions | LoaderActions>) => {
  return {
      onSetChannelSettings: (settings: ChannelSettings, channel: number) => {
        dispatch(setChannelSettings(settings, channel));
      },
      onRemoveLoader: (feature: string) => {
        dispatch(removeLoader(feature));
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelStateForm);