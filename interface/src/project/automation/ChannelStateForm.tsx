import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { TextField, Checkbox } from '@material-ui/core';
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

import { ChannelState, Schedule } from './types';

type ChannelStateRestControllerFormProps = RestFormProps<ChannelState>;

const ChannelStateForm = (props : ChannelStateRestControllerFormProps) => {
 
    const { data, saveData, loadData, setData, handleValueChange } = props;
  
    const makeDateFromTime = (hour: number, minute: number) => {
      return new Date(`Mon May 18 2020 ${hour}:${minute}:00`);
    }
    
    const startTime: Date = makeDateFromTime(data.schedule.startTimeHour, data.schedule.startTimeMinute);
    const endTime: Date = makeDateFromTime(data.schedule.endTimeHour, data.schedule.endTimeMinute);
  
      const handleDateChange = (date: Date | null) => {};
  
      const extractDateValue =(date: Date | null, period: string) => {
        const defaultHour = (period === 'startTimeHour') ? 8 : 16;
        const timeHour: number = date?.getHours() || defaultHour;
        const timeMinute: number = date?.getMinutes() || 0;  
        return { timeHour, timeMinute };
      }
  
      const handleScheduleValueChange = (name: keyof Schedule) => (event: any) => {
        //const { data, setData } = props;
        switch (name) {
          case 'startTimeHour':
            const startTime = extractDateValue(event, name);
            setData({ ...data, schedule: {...data.schedule,  startTimeHour: startTime.timeHour, startTimeMinute: startTime.timeMinute } });
            break;
            case 'endTimeHour':
              const endTime = extractDateValue(event, name);
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

    return (
      <ValidatorForm onSubmit={saveData}>
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
        <TextField
          name="name"
          label="Channel Name"
          fullWidth
          variant="outlined"
          value={data.name}
          onChange={handleValueChange('name')}
          margin="normal"
        />
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
export default ChannelStateForm;
