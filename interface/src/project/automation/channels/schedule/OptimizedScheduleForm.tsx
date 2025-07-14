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
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: theme.spacing(3),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  timePickerContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  saveButton: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  enabledSwitch: {
    marginBottom: theme.spacing(2),
  },
  checkboxGroup: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  selectControl: {
    marginLeft: theme.spacing(1),
    minWidth: 200,
  },
  sliderContainer: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
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

  const read = useCallback(() => Api.createReadChannelApi(channelId), [channelId]);
  const update = useCallback(
    (channelState: ChannelState) => Api.createUpdateChannelApi(channelId, channelState),
    [channelId]
  );

  const { saveData, saving, setData, data, errorMessage } = useRest<ChannelState>({
    read,
    update,
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
    setData({
      ...data,
      schedule: {
        ...data.schedule,
        [name]: value
      }
    });
  };

  const handleDateRange = (newDateRange: DateRange | null) => {
    if (!newDateRange || !data) return;
    setDateRange(newDateRange);
    setData({ ...data, activeDateRange: newDateRange });
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
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
    try {
      await saveData();
      enqueueSnackbar('Schedule saved successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save schedule', { variant: 'error' });
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
          <TextField
            label="Channel Name"
            value={data.name}
            onChange={updateFormValue}
            name="name"
            fullWidth
            margin="normal"
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
          <Typography className={classes.sectionTitle}>Hardware Configuration</Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body2" sx={{ minWidth: 100 }}>Control Pin:</Typography>
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
              <Typography className={classes.sectionTitle}>Active Days</Typography>
              <Box className={classes.chipContainer}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day.value}
                    label={day.label}
                    onClick={() => handleDayToggle(day.value)}
                    color={selectedDays.includes(day.value) ? "primary" : "default"}
                    variant={selectedDays.includes(day.value) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Date Range Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>Date Range Settings</Typography>
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
                      style={{ width: 260, display: 'block', marginBottom: 10 }}
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
              <Typography className={classes.sectionTitle}>Operation Mode</Typography>
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
              <Typography className={classes.sectionTitle}>Override Settings</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 120 }}>Override Time:</Typography>
                <Select
                  className={classes.selectControl}
                  value={data.schedule.overrideTime}
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
              <Typography className={classes.sectionTitle}>Home Assistant Integration</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 120 }}>Device Icon:</Typography>
                <Select
                  className={classes.selectControl}
                  value={data.homeAssistantIcon}
                  onChange={handleChannelStateValueChange('homeAssistantIcon')}
                  size="small"
                >
                  <MenuItem value={"mdi:air-conditioner"}><Icon size={1} path={mdiAirConditioner} />air-conditioner</MenuItem>
                  <MenuItem value={"mdi:camera"}><Icon size={1} path={mdiCamera} />camera</MenuItem>
                  <MenuItem value={"mdi:ceiling-fan-light"}><Icon size={1} path={mdiCeilingFanLight} />ceiling-fan-light</MenuItem>
                  <MenuItem value={"mdi:fan"}><Icon size={1} path={mdiFan} />fan</MenuItem>
                  <MenuItem value={"mdi:fridge"}><Icon size={1} path={mdiFridgeOutline} />fridge</MenuItem>
                  <MenuItem value={"mdi:garage"}><Icon size={1} path={mdiGarage} />garage</MenuItem>
                  <MenuItem value={"mdi:garage-variant"}><Icon size={1} path={mdiGarageVariant} />garage-variant</MenuItem>
                  <MenuItem value={"mdi:lightbulb"}><Icon size={1} path={mdiLightbulbOn} />light</MenuItem>
                  <MenuItem value={"mdi:microwave"}><Icon size={1} path={mdiMicrowave} />microwave</MenuItem>
                  <MenuItem value={"mdi:power"}><Icon size={1} path={mdiPower} />power</MenuItem>
                  <MenuItem value={"mdi:printer"}><Icon size={1} path={mdiPrinter} />printer</MenuItem>
                  <MenuItem value={"mdi:printer-wireless"}><Icon size={1} path={mdiPrinterWireless} />printer-wireless</MenuItem>
                  <MenuItem value={"mdi:speaker"}><Icon size={1} path={mdiSpeaker} />speaker</MenuItem>
                  <MenuItem value={"mdi:speaker-wireless"}><Icon size={1} path={mdiSpeakerMultiple} />speaker-wireless</MenuItem>
                  <MenuItem value={"mdi:television-ambient-light"}><Icon size={1} path={mdiTelevisionAmbientLight} />television-ambient-light</MenuItem>
                  <MenuItem value={"mdi:television"}><Icon size={1} path={mdiTelevision} />television</MenuItem>
                  <MenuItem value={"mdi:toaster"}><Icon size={1} path={mdiToaster} />toaster</MenuItem>
                  <MenuItem value={"mdi:toaster-oven"}><Icon size={1} path={mdiToasterOven} />toaster-oven</MenuItem>
                  <MenuItem value={"mdi:water-pump"}><Icon size={1} path={mdiWaterPump} />water pump</MenuItem>
                </Select>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 120 }}>Topic Type:</Typography>
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
                <Typography className={classes.sectionTitle}>Cycle Settings</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Run Every (minutes)"
                      type="number"
                      value={Math.round(data.schedule.runEvery)}
                      onChange={(e) => setData({
                        ...data,
                        schedule: {
                          ...data.schedule,
                          runEvery: parseInt(e.target.value) || 0
                        }
                      })}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Off After (minutes)"
                      type="number"
                      value={Math.round(data.schedule.offAfter)}
                      onChange={(e) => setData({
                        ...data,
                        schedule: {
                          ...data.schedule,
                          offAfter: parseInt(e.target.value) || 0
                        }
                      })}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            <Divider />

            {/* Time Settings */}
            <Box className={classes.formSection}>
              <Typography className={classes.sectionTitle}>Operating Hours</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={formatTimeFromSeconds(data.schedule.startTimeHour)}
                    onChange={(e) => handleTimeChange('startTimeHour', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Time"
                    type="time"
                    value={formatTimeFromSeconds(data.schedule.endTimeHour)}
                    onChange={(e) => handleTimeChange('endTimeHour', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Hot Time Hour Slider for Randomize Mode */}
            {!data.enableTimeSpan && data.randomize && (
              <Box className={classes.formSection}>
                <Typography className={classes.sectionTitle}>Randomization</Typography>
                <Box className={classes.sliderContainer}>
                  <Typography gutterBottom>Hot Time Hour: {data.schedule.hotTimeHour}</Typography>
                  <Slider
                    value={data.schedule.hotTimeHour}
                    onChange={handleSliderChange}
                    aria-labelledby="hot-time-hour-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={23}
                  />
                </Box>
              </Box>
            )}

            <Divider />
          </>
        )}

        {/* Remote Configuration */}
        <Box className={classes.formSection}>
          <Typography className={classes.sectionTitle}>Remote Configuration</Typography>
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
                label="Master IP Address"
                name="masterIPAddress"
                value={data.masterIPAddress}
                onChange={updateFormValue}
                fullWidth
                margin="normal"
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