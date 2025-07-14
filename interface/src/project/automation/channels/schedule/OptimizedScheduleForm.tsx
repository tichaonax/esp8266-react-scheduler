import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  TextField,
  Button,
  Chip,
  Grid,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Checkbox,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import CloudIcon from '@mui/icons-material/Cloud';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimerIcon from '@mui/icons-material/Timer';
import Icon from '@mdi/react';
import {
  mdiPower, mdiAirConditioner, mdiCamera,
  mdiCeilingFanLight, mdiFan, mdiFridgeOutline,
  mdiGarage, mdiGarageVariant, mdiMicrowave,
  mdiPrinter, mdiPrinterWireless, mdiSpeaker,
  mdiTelevision, mdiTelevisionAmbientLight,
  mdiToaster, mdiToasterOven, mdiWaterPump,
  mdiLightbulbOn, mdiSpeakerMultiple
} from '@mdi/js';
import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { DateRangePicker } from 'rsuite';
import { DateRange } from "rsuite/DateRangePicker";
import { updateValue, useRest } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';
import 'rsuite/dist/rsuite.min.css';

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    maxWidth: 900,
    margin: '0 auto',
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
  header: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3, 3, 0),
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2.5),
    fontWeight: 600,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.primary,
    '& .MuiSvgIcon-root': {
      fontSize: '1.3rem',
      opacity: 0.8,
    },
  },
  formSection: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.02)',
  },
  enhancedChip: {
    transition: 'all 0.2s ease',
    fontWeight: 500,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  timePickerContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  saveButton: {
    marginTop: theme.spacing(3),
    minWidth: 140,
    height: 48,
    borderRadius: theme.spacing(3),
    fontWeight: 600,
    fontSize: '1rem',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D1 90%)',
      boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.3)',
    },
  },
  enabledSwitch: {
    marginBottom: theme.spacing(3),
    '& .MuiFormControlLabel-label': {
      fontWeight: 500,
      fontSize: '1rem',
    },
    '& .MuiSwitch-root': {
      '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#4CAF50',
        '& + .MuiSwitch-track': {
          backgroundColor: '#4CAF50',
        },
      },
    },
  },
  checkboxGroup: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  selectControl: {
    marginLeft: theme.spacing(1),
    minWidth: 220,
    transition: 'all 0.2s ease',
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2196F3',
        borderWidth: 2,
      },
    },
  },
  selectWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  constraintIndicator: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.05) 100%)',
    border: '1px solid rgba(33, 150, 243, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      color: '#2196F3',
      fontSize: '1.1rem',
    },
    '& .MuiTypography-root': {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  sliderContainer: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    '& .MuiSlider-root': {
      color: '#2196F3',
      '& .MuiSlider-thumb': {
        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
        },
      },
      '& .MuiSlider-track': {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      },
    },
  },
  iconLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 140,
    fontWeight: 500,
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      opacity: 0.7,
    },
  },
  gridContainer: {
    '& .MuiGrid-item': {
      transition: 'all 0.2s ease',
    },
  },
  enhancedTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      transition: 'all 0.2s ease',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#2196F3',
        borderWidth: 2,
        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2196F3',
    },
  },
  channelTitleOne: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleTwo: {
    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleThree: {
    background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleFour: {
    background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
}));

interface OptimizedScheduleFormProps {
  channelId: string;
}

const OptimizedScheduleForm: FC<OptimizedScheduleFormProps> = ({ channelId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [activeDateRange, setDateRange] = useState<DateRange>([new Date(), new Date()]);
  const [saving, setSaving] = useState(false);

  const read = useCallback(() => Api.createReadChannelApi(channelId), [channelId]);
  
  // Don't use the default update from useRest - we'll create our own minimal payload version
  const { setData, data, errorMessage } = useRest<ChannelState>({
    read,
    update: undefined, // Disable default update to avoid the full payload issue
  });

  const updateFormValue = updateValue(setData);

  // Get the appropriate title class based on channel ID
  const getTitleClass = () => {
    switch (channelId) {
      case 'One': return classes.channelTitleOne;
      case 'Two': return classes.channelTitleTwo;
      case 'Three': return classes.channelTitleThree;
      case 'Four': return classes.channelTitleFour;
      default: return classes.channelTitleOne;
    }
  };

  // Initialize selected days when data loads
  useEffect(() => {
    if (data?.schedule?.weekDays) {
      setSelectedDays(data.schedule.weekDays.filter(day => day >= 0));
    }
  }, [data]);

  // Initialize date range
  useEffect(() => {
    if (data && data.activeDateRange) {
      setDateRange([new Date(data.activeDateRange[0]), new Date(data.activeDateRange[1])]);
    }
  }, [data]);

  // Normalize select values to prevent Select errors
  const getValidOverrideTime = (value: number) => {
    const validOptions = [960, 0.033, 0.05, 0.066, 0.083, 0.1, 0.166, 0.2, 0.25, 0.333, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 15, 17, 20, 30, 40, 60, 120, 150, 180, 210, 240];
    
    if (validOptions.includes(value)) {
      return value;
    }
    
    // If invalid value, default to 'none' (960)
    console.warn(`Invalid overrideTime value: ${value}, defaulting to 'none' (960)`);
    return 960;
  };

  const getValidRunEvery = (value: number) => {
    const validOptions = [0.033, 0.05, 0.066, 0.083, 0.1, 0.166, 0.2, 0.25, 0.333, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 15, 17, 20, 30, 40, 60, 120, 180, 240, 360, 480, 720, 1440];
    
    if (validOptions.includes(value)) {
      return value;
    }
    
    // If invalid value, default to 1 minute
    console.warn(`Invalid runEvery value: ${value}, defaulting to 1 minute`);
    return 1;
  };

  // All possible Off After options (full original list)
  const allOffAfterOptions = [
    { value: 0.016, label: '01 second' },
    { value: 0.033, label: '02 seconds' },
    { value: 0.05, label: '03 seconds' },
    { value: 0.066, label: '04 seconds' },
    { value: 0.083, label: '05 seconds' },
    { value: 0.1, label: '06 seconds' },
    { value: 0.166, label: '10 seconds' },
    { value: 0.2, label: '12 seconds' },
    { value: 0.25, label: '15 seconds' },
    { value: 0.333, label: '20 seconds' },
    { value: 0.5, label: '30 seconds' },
    { value: 1, label: '1 minute' },
    { value: 2, label: '2 minutes' },
    { value: 3, label: '3 minutes' },
    { value: 4, label: '4 minutes' },
    { value: 5, label: '5 minutes' },
    { value: 6, label: '6 minutes' },
    { value: 8, label: '8 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 11, label: '11 minutes' },
    { value: 12, label: '12 minutes' },
    { value: 13, label: '13 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 17, label: '17 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 40, label: '40 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 360, label: '6 hours' },
    { value: 480, label: '8 hours' },
    { value: 600, label: '10 hours' },
    { value: 720, label: '12 hours' },
    { value: 780, label: '13 hours' },
    { value: 960, label: '16 hours' },
    { value: 1080, label: '18 hours' },
    { value: 1200, label: '20 hours' }
  ];

  // Get filtered Off After options based on Run Every selection
  const getFilteredOffAfterOptions = () => {
    if (!data?.schedule) return allOffAfterOptions;
    
    const runEveryValue = data.schedule.runEvery;
    return allOffAfterOptions.filter(option => option.value < runEveryValue);
  };

  const getValidOffAfter = (value: number) => {
    const filteredOptions = getFilteredOffAfterOptions();
    const validValues = filteredOptions.map(opt => opt.value);
    
    if (validValues.includes(value)) {
      return value;
    }
    
    // If current value is invalid (too high), select the highest valid option
    const highestValid = Math.max(...validValues);
    console.warn(`Off After value ${value} is >= Run Every ${data?.schedule.runEvery}. Auto-selecting highest valid: ${highestValid}`);
    return highestValid;
  };

  // Days of week configuration
  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const handleDayToggle = (day: number) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    setSelectedDays(newSelectedDays);
    
    if (data) {
      const weekDays = Array(7).fill(-1);
      newSelectedDays.forEach(day => {
        weekDays[day] = day;
      });
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          weekDays
        }
      });
    }
  };

  const formatTimeFromSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (field: 'startTimeHour' | 'endTimeHour', timeString: string) => {
    if (timeString && data) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const totalSeconds = (hours || 0) * 3600 + (minutes || 0) * 60;
      
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          [field]: totalSeconds,
        }
      });
    }
  };

  const handleChannelStateValueChange = (name: keyof ChannelState) => (event: any) => {
    if (!data) return;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setData({ ...data, [name]: value });
  };

  const handleScheduleValueChange = (name: string) => (event: any) => {
    if (!data || !data.schedule) return;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    // Special handling for runEvery changes - auto-adjust offAfter if needed
    if (name === 'runEvery') {
      const newRunEvery = value;
      let newOffAfter = data.schedule.offAfter;
      
      // If current offAfter is >= new runEvery, auto-select highest valid option
      if (newOffAfter >= newRunEvery) {
        const validOptions = allOffAfterOptions.filter(opt => opt.value < newRunEvery);
        if (validOptions.length > 0) {
          newOffAfter = Math.max(...validOptions.map(opt => opt.value));
          console.log(`Run Every changed to ${newRunEvery}. Auto-adjusting Off After from ${data.schedule.offAfter} to ${newOffAfter}`);
        }
      }
      
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          runEvery: newRunEvery,
          offAfter: newOffAfter
        }
      });
    } else {
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          [name]: value
        }
      });
    }
  };

  const handleDateRange = (newDateRange: DateRange | null) => {
    if (!newDateRange || !data) return;
    setDateRange(newDateRange);
    // Convert Date array to string array for activeDateRange
    const dateStrings = newDateRange.map(date => date.toISOString());
    setData({ ...data, activeDateRange: dateStrings });
  };

  const handleSliderChange = (_event: any, newValue: number | number[]) => {
    if (!data || !data.schedule) return;
    const slider = Array.isArray(newValue) ? newValue[0] : newValue;
    setData({ 
      ...data, 
      schedule: { 
        ...data.schedule, 
        hotTimeHour: slider 
      } 
    });
  };

  const handleSave = async () => {
    if (!data || saving) return;
    
    setSaving(true);
    try {
      console.log('🔍 Full data before filtering:', JSON.stringify(data, null, 2));
      
      // Create minimal payload - same pattern as working OptimizedChannelStatus
      const minimalPayload = {
        controlPin: data.controlPin,
        homeAssistantTopicType: data.homeAssistantTopicType,
        homeAssistantIcon: data.homeAssistantIcon,
        controlOn: data.controlOn,
        name: data.name,
        enabled: data.enabled,
        enableTimeSpan: data.enableTimeSpan,
        randomize: data.randomize,
        enableMinimumRunTime: data.enableMinimumRunTime,
        enableRemoteConfiguration: data.enableRemoteConfiguration,
        masterIPAddress: data.masterIPAddress,
        enableDateRange: data.enableDateRange,
        activeOutsideDateRange: data.activeOutsideDateRange,
        activeDateRange: data.activeDateRange,
        schedule: {
          runEvery: data.schedule.runEvery,
          offAfter: data.schedule.offAfter,
          startTimeHour: data.schedule.startTimeHour,
          startTimeMinute: data.schedule.startTimeMinute,
          hotTimeHour: data.schedule.hotTimeHour,
          endTimeHour: data.schedule.endTimeHour,
          endTimeMinute: data.schedule.endTimeMinute,
          overrideTime: data.schedule.overrideTime,
          weekDays: data.schedule.weekDays,
          isOverride: data.schedule.isOverride,
          isOverrideActive: data.schedule.isOverrideActive,
        }
        // Removed read-only fields that cause 400 errors:
        // - nextRunTime (backend generated)
        // - lastStartedChangeTime (backend generated) 
        // - localDateTime (backend generated)
        // - IPAddress (backend generated)
        // - buildVersion (backend generated)
        // - uniqueId (backend generated)
      };
      
      console.log('🚀 Sending minimal payload:', JSON.stringify(minimalPayload, null, 2));
      const response = await Api.createUpdateChannelApi(channelId, minimalPayload as ChannelState);
      setData(response.data);
      console.log('✅ Save successful:', response.data);
      enqueueSnackbar('Schedule saved successfully!', { variant: 'success' });
    } catch (error: any) {
      console.error('❌ Save failed with error:', error);
      console.error('💥 Error response:', error?.response?.data);
      console.error('📡 Error status:', error?.response?.status);
      enqueueSnackbar(`Failed to save schedule: ${error?.response?.status || 'Unknown error'}`, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (!data.schedule) {
    return <Alert severity="warning">Channel not configured</Alert>;
  }

  const { allowedMaxDays } = DateRangePicker;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box className={classes.header}>
          <Typography variant="h5" className={getTitleClass()}>
            {data.name} Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure when and how this channel operates
          </Typography>
        </Box>

        {/* Basic Settings */}
        <Box className={classes.formSection}>
          <Typography className={classes.sectionTitle}>
            <SettingsIcon />
            Basic Configuration
          </Typography>
          <TextField
            className={classes.enhancedTextField}
            label="Channel Name"
            value={data.name}
            onChange={updateFormValue}
            name="name"
            fullWidth
            margin="normal"
            variant="outlined"
          />
          
          <FormControlLabel
            className={classes.enabledSwitch}
            control={
              <Switch
                checked={data.enabled}
                onChange={(e) => setData({ ...data, enabled: e.target.checked })}
                color="primary"
              />
            }
            label="Schedule Enabled"
          />
        </Box>

        {/* Control Pin Selection */}
        <Box className={classes.formSection}>
          <Typography className={classes.sectionTitle}>
            <TuneIcon />
            Hardware Configuration
          </Typography>
          <Box className={classes.selectWrapper}>
            <Typography className={classes.iconLabel}>
              <SettingsIcon />
              Control Pin:
            </Typography>
            <Select
              className={classes.selectControl}
              value={data.controlPin}
              disabled={data.enabled}
              onChange={handleChannelStateValueChange('controlPin')}
              size="small"
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
          </Box>
        </Box>

        {data.enabled && (
          <>
            <Divider />
            
            {/* Active Days */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <CalendarTodayIcon />
                Active Days
              </Typography>
              <Box className={classes.chipContainer}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day.value}
                    label={day.label}
                    onClick={() => handleDayToggle(day.value)}
                    color={selectedDays.includes(day.value) ? "primary" : "default"}
                    variant={selectedDays.includes(day.value) ? "filled" : "outlined"}
                    className={classes.enhancedChip}
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Date Range Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <DateRangeIcon />
                Date Range Settings
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.enableDateRange}
                    onChange={handleChannelStateValueChange('enableDateRange')}
                    color="primary"
                  />
                }
                label="Enable Date Range"
              />
              {data.enableDateRange && (
                <Box className={classes.checkboxGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.activeOutsideDateRange}
                        onChange={handleChannelStateValueChange('activeOutsideDateRange')}
                        color="primary"
                      />
                    }
                    label="Active Outside Date Range"
                  />
                  <Box mt={2}>
                    <DateRangePicker
                      size="lg"
                      appearance="default"
                      style={{ width: 280, display: 'block', marginBottom: 10 }}
                      value={activeDateRange}
                      onChange={handleDateRange}
                      disabledDate={allowedMaxDays?.(365)}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Time and Operation Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <RepeatIcon />
                Operation Mode
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.enableTimeSpan}
                    onChange={handleChannelStateValueChange('enableTimeSpan')}
                    color="primary"
                  />
                }
                label="Enable Time Span Mode"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.randomize}
                    disabled={data.enableTimeSpan}
                    onChange={handleChannelStateValueChange('randomize')}
                    color="primary"
                  />
                }
                label="Randomize Schedule"
              />
              {!data.enableTimeSpan && data.randomize && (
                <Box className={classes.checkboxGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.enableMinimumRunTime}
                        onChange={handleChannelStateValueChange('enableMinimumRunTime')}
                        color="primary"
                      />
                    }
                    label="Enable Minimum Run Time"
                  />
                </Box>
              )}
            </Box>

            <Divider />

            {/* Override Time */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <TimerIcon />
                Override Settings
              </Typography>
              <Box className={classes.selectWrapper}>
                <Typography className={classes.iconLabel}>
                  <TimerIcon />
                  Override Time:
                </Typography>
                <Select
                  className={classes.selectControl}
                  value={getValidOverrideTime(data.schedule.overrideTime)}
                  onChange={handleScheduleValueChange('overrideTime')}
                  size="small"
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
                  <MenuItem value={11}>11 minutes</MenuItem>
                  <MenuItem value={12}>12 minutes</MenuItem>
                  <MenuItem value={13}>13 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={17}>17 minutes</MenuItem>
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
              </Box>
            </Box>

            <Divider />

            {/* Home Assistant Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <HomeIcon />
                Home Assistant Integration
              </Typography>
              <Box className={classes.selectWrapper}>
                <Typography className={classes.iconLabel}>
                  <HomeIcon />
                  Device Icon:
                </Typography>
                <Select
                  className={classes.selectControl}
                  value={data.homeAssistantIcon}
                  onChange={handleChannelStateValueChange('homeAssistantIcon')}
                  size="small"
                >
                  <MenuItem value={"mdi:air-conditioner"}><Icon size={1} path={mdiAirConditioner} color="#2196F3" />air-conditioner</MenuItem>
                  <MenuItem value={"mdi:camera"}><Icon size={1} path={mdiCamera} color="#9C27B0" />camera</MenuItem>
                  <MenuItem value={"mdi:ceiling-fan-light"}><Icon size={1} path={mdiCeilingFanLight} color="#FF9800" />ceiling-fan-light</MenuItem>
                  <MenuItem value={"mdi:fan"}><Icon size={1} path={mdiFan} color="#00BCD4" />fan</MenuItem>
                  <MenuItem value={"mdi:fridge"}><Icon size={1} path={mdiFridgeOutline} color="#607D8B" />fridge</MenuItem>
                  <MenuItem value={"mdi:garage"}><Icon size={1} path={mdiGarage} color="#795548" />garage</MenuItem>
                  <MenuItem value={"mdi:garage-variant"}><Icon size={1} path={mdiGarageVariant} color="#8BC34A" />garage-variant</MenuItem>
                  <MenuItem value={"mdi:lightbulb"}><Icon size={1} path={mdiLightbulbOn} color="#FFC107" />light</MenuItem>
                  <MenuItem value={"mdi:microwave"}><Icon size={1} path={mdiMicrowave} color="#FF5722" />microwave</MenuItem>
                  <MenuItem value={"mdi:power"}><Icon size={1} path={mdiPower} color="#4CAF50" />power</MenuItem>
                  <MenuItem value={"mdi:printer"}><Icon size={1} path={mdiPrinter} color="#673AB7" />printer</MenuItem>
                  <MenuItem value={"mdi:printer-wireless"}><Icon size={1} path={mdiPrinterWireless} color="#3F51B5" />printer-wireless</MenuItem>
                  <MenuItem value={"mdi:speaker"}><Icon size={1} path={mdiSpeaker} color="#E91E63" />speaker</MenuItem>
                  <MenuItem value={"mdi:speaker-wireless"}><Icon size={1} path={mdiSpeakerMultiple} color="#F44336" />speaker-wireless</MenuItem>
                  <MenuItem value={"mdi:television-ambient-light"}><Icon size={1} path={mdiTelevisionAmbientLight} color="#009688" />television-ambient-light</MenuItem>
                  <MenuItem value={"mdi:television"}><Icon size={1} path={mdiTelevision} color="#424242" />television</MenuItem>
                  <MenuItem value={"mdi:toaster"}><Icon size={1} path={mdiToaster} color="#CDDC39" />toaster</MenuItem>
                  <MenuItem value={"mdi:toaster-oven"}><Icon size={1} path={mdiToasterOven} color="#FD6C6C" />toaster-oven</MenuItem>
                  <MenuItem value={"mdi:water-pump"}><Icon size={1} path={mdiWaterPump} color="#03A9F4" />water pump</MenuItem>
                </Select>
              </Box>
              <Box className={classes.selectWrapper}>
                <Typography className={classes.iconLabel}>
                  <SettingsIcon />
                  Topic Type:
                </Typography>
                <Select
                  className={classes.selectControl}
                  value={data.homeAssistantTopicType}
                  onChange={handleChannelStateValueChange('homeAssistantTopicType')}
                  size="small"
                >
                  <MenuItem value={0}>Switch</MenuItem>
                  <MenuItem value={1}>Light</MenuItem>
                  <MenuItem value={2}>Fan</MenuItem>
                </Select>
              </Box>
            </Box>

            <Divider />

            {/* Cycle Settings */}
            {!data.enableTimeSpan && (
              <Box className={classes.formSection}>
                <Typography className={classes.sectionTitle}>
                  <AccessTimeIcon />
                  Cycle Settings
                </Typography>
                <Grid container spacing={2} className={classes.gridContainer}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.selectWrapper}>
                      <Typography className={classes.iconLabel}>
                        <RepeatIcon />
                        Run Every:
                      </Typography>
                      <Select
                        className={classes.selectControl}
                        value={getValidRunEvery(data.schedule.runEvery)}
                        disabled={data.enableTimeSpan}
                        onChange={handleScheduleValueChange('runEvery')}
                        size="small"
                        fullWidth
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
                        <MenuItem value={11}>11 minutes</MenuItem>
                        <MenuItem value={12}>12 minutes</MenuItem>
                        <MenuItem value={13}>13 minutes</MenuItem>
                        <MenuItem value={15}>15 minutes</MenuItem>
                        <MenuItem value={17}>17 minutes</MenuItem>
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
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.selectWrapper}>
                      <Typography className={classes.iconLabel}>
                        <TimerIcon />
                        Off After:
                      </Typography>
                      <Select
                        className={classes.selectControl}
                        value={getValidOffAfter(data.schedule.offAfter)}
                        disabled={data.enableTimeSpan}
                        onChange={handleScheduleValueChange('offAfter')}
                        size="small"
                        fullWidth
                      >
                        {getFilteredOffAfterOptions().map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Constraint Indicator */}
                <Box className={classes.constraintIndicator}>
                  <InfoOutlinedIcon />
                  <Typography>
                    Off After values are automatically filtered to be less than Run Every ({getFilteredOffAfterOptions().length} of {allOffAfterOptions.length} options available)
                  </Typography>
                </Box>
              </Box>
            )}

            <Divider />

            {/* Time Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>
                <AccessTimeIcon />
                Operating Hours
              </Typography>
              <Grid container spacing={3} className={classes.gridContainer}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.enhancedTextField}
                    label="Start Time"
                    type="time"
                    value={formatTimeFromSeconds(data.schedule.startTimeHour)}
                    onChange={(e) => handleTimeChange('startTimeHour', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.enhancedTextField}
                    label="End Time"
                    type="time"
                    value={formatTimeFromSeconds(data.schedule.endTimeHour)}
                    onChange={(e) => handleTimeChange('endTimeHour', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Hot Time Hour Slider for Randomize Mode */}
            {!data.enableTimeSpan && data.randomize && (
              <Box className={classes.formSection}>
                <Typography className={classes.sectionTitle}>
                  <ShuffleIcon />
                  Randomization
                </Typography>
                <Box className={classes.sliderContainer}>
                  <Typography gutterBottom variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                    Hot Time Hour: {data.schedule.hotTimeHour.toFixed(2)}
                  </Typography>
                  <Slider
                    disabled={!data.randomize}
                    value={data.schedule.hotTimeHour}
                    onChange={handleSliderChange}
                    aria-labelledby="discrete-slider-custom"
                    step={0.0167}
                    valueLabelDisplay="off"
                    marks={[
                      { value: 0, label: '0hr' },
                      { value: 1, label: '1hr' },
                      { value: 2, label: '2hr' },
                      { value: 3, label: '3hr' },
                      { value: 4, label: '4hr' }
                    ]}
                    min={0}
                    max={4}
                  />
                </Box>
              </Box>
            )}

            <Divider />
          </>
        )}

        {/* Remote Configuration */}
        <Box className={classes.formSection}>
          <Typography className={classes.sectionTitle}>
            <CloudIcon />
            Remote Configuration
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.enableRemoteConfiguration}
                onChange={handleChannelStateValueChange('enableRemoteConfiguration')}
                color="primary"
              />
            }
            label="Enable Remote Configuration"
          />
          {data.enableRemoteConfiguration && (
            <Box className={classes.checkboxGroup}>
              <TextField
                className={classes.enhancedTextField}
                label="Master IP Address"
                name="masterIPAddress"
                value={data.masterIPAddress}
                onChange={updateFormValue}
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="192.168.1.100"
              />
            </Box>
          )}
        </Box>

        {/* Save Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            className={classes.saveButton}
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Schedule'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OptimizedScheduleForm;