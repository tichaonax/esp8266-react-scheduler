import React, { Dispatch, useEffect } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TextField, Checkbox, Typography } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import SaveIcon from '@material-ui/icons/Save';
import MenuItem from "@material-ui/core/MenuItem";
import Grid from '@material-ui/core/Grid';
import Select from "@material-ui/core/Select";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';

import { RestFormProps, FormActions, FormButton, BlockFormControlLabel, extractEventValue } from '../../components';
import history from '../../history';

import { setChannelSettings} from '../automation/redux/actions/channel';
import { channelSettingsSelector } from '../automation/redux/selectors/channel';
import { removeLoader } from '../automation/redux/actions/ui';
import { Loader, LoaderActions } from './redux/types/ui';

import { ChannelState, Schedule, ChannelSettingsActions, Channels, ChannelSettings, CHANNEL, RESTART } from '../automation/redux/types/channel';
import {
  CHANNEL_ONE_CONTROL_PIN,
  CHANNEL_TWO_CONTROL_PIN,
  CHANNEL_THREE_CONTROL_PIN,
  CHANNEL_FOUR_CONTROL_PIN,
 } from './constants';
import { connect } from 'react-redux';
import { AppState } from './redux/store';
import { uiLoaderProjector } from './redux/selectors/uiLoaderProjector';
import SystemStateWebSocketController from './SystemStateWebSocketController';


type ChannelStateRestControllerFormProps = RestFormProps<ChannelState>;

const ChannelStateForm = (props : ChannelStateRestControllerFormProps) => {

  // @ts-ignore 
  const { channels, loader, enqueueSnackbar, data, saveData, loadData, setData, handleValueChange, onSetChannelSettings, onRemoveLoader } = props;
  // suppress onSetChannelSettings, onRemoveLoader not part of props;

  const restartSuccessMessage = (name: string, loader: Loader) => {
    if(loader.success){
      enqueueSnackbar(name +  " Schedule Restarted Successfully!", { variant: 'success' });
      }else{
        enqueueSnackbar(name + " " + loader.errorMessage, { variant: 'error' });
      }
      onRemoveLoader();
  }

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
  
    const saveFormAndRestartSchedule = () => {
      saveData();
      restartSchedule();
    }

    const makeDateFromTime = (hour: number, minute: number) => {
      const newHour = (hour >= 24) ? 24 : hour;
      const newMinute = (minute >= 60) ? 0 : minute;
      return new Date(`Mon May 18 2020 ${newHour}:${newMinute}:00`);
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
            setData({ ...data, schedule: {...data.schedule,  startTimeHour: startTime.timeHour, startTimeMinute: startTime.timeMinute } });
            break;
            case 'endTimeHour':
              const endTime = extractDateValue(event);
              setData({ ...data, schedule: {...data.schedule, endTimeHour: endTime.timeHour, endTimeMinute: endTime.timeMinute } });
            break;
          default:
            setData({ ...data, schedule: {...data.schedule, [name]: extractEventValue(event) } });
            break;
        }
      }
      
      const onGoBack = () => {
        history.goBack();
      }

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
      const valuetext = (value: number) => {
        return `${value}hr`;
      }

      const formatHotTimeHour = (hotTimeHour: number) => {
        const totalTimeSeconds = hotTimeHour * 3600;
        const hours: number = Math.floor((hotTimeHour));
        const minutes: number = Math.floor(((totalTimeSeconds - (hours*3600)) / 60));
        const seconds: number = Math.floor(totalTimeSeconds - (hours*3600) - (minutes * 60));
        
        let hString: string = hours.toString();
        if(hours < 10){hString = "0" + hours;}
        if (hours == 0){
          hString="";
        }else{
          hString= hString + "h ";
        }

        let mString: string = minutes.toString();
        if(minutes < 10){mString = "0" + minutes;}
        if (minutes == 0){
          mString="";
        }else{
          mString= mString + "m ";
        }

        let sString: string = seconds.toString();
        if(seconds < 10){sString = "0" + seconds;}
        if (seconds == 0){
          sString="";
        }else{
          sString= sString + "s";
        }

        return (hString + mString + sString);
      }

    return (
      <ValidatorForm onSubmit={saveFormAndRestartSchedule}>
        <Typography variant="h6">{data.name} <SystemStateWebSocketController/></Typography>
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enabled}
                onChange={handleValueChange('enabled')}
                color="primary"
            />
            }
            label="Enable schedule?"
        />
        <BlockFormControlLabel
            control={
            <Checkbox
                checked={data.enableTimeSpan}
                onChange={handleValueChange('enableTimeSpan')}
                color="primary"
            />
            }
            label="Enable TimeSpan?"
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
            label="Randomize Switch?"
        />
        <TextField
          name="name"
          label="Channel Name"
          fullWidth
          variant="outlined"
          value={data.name}
          onChange={handleValueChange('name')}
          margin="normal"
        />
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
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={20}>20 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
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
              label="Run Every"
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
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={20}>20 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
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
              label="Off After"
            />
            <p/>
          </div>
        )}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="flex-start">
            <KeyboardTimePicker
                margin="normal"
                label="Start Time"
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
          Hot Time: {formatHotTimeHour(data.schedule.hotTimeHour)} 
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
                label="End Time"
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
          <FormButton variant="contained" color="secondary" onClick={onGoBack}>
            Go Back
          </FormButton>
        </FormActions>
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
      onRemoveLoader: () => {
        // @ts-ignore 
        dispatch(removeLoader(`${CHANNEL}${RESTART}`));
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelStateForm);