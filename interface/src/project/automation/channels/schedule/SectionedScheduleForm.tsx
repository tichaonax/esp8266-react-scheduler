import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Switch,
  TextField,
  Button,
  Chip,
  Grid,
  FormControlLabel,
  Alert,
  CircularProgress,
  Checkbox,
  Select,
  MenuItem,
  Slider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RepeatIcon from '@mui/icons-material/Repeat';
import HomeIcon from '@mui/icons-material/Home';
import CloudIcon from '@mui/icons-material/Cloud';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DateRangeIcon from '@mui/icons-material/DateRange';
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
import { DateRangePicker } from 'rsuite';
import { DateRange } from "rsuite/DateRangePicker";
import { updateValue, useRest } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';
import { SectionContent } from '../../../../components';
import { useSnackbar } from "notistack";
import 'rsuite/dist/rsuite.min.css';

interface SectionedScheduleFormProps {
  channelId: string;
}

const SectionedScheduleForm: FC<SectionedScheduleFormProps> = ({ channelId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [activeDateRange, setDateRange] = useState<DateRange>([new Date(), new Date()]);
  const [saving, setSaving] = useState(false);

  const read = useCallback(() => Api.createReadChannelApi(channelId), [channelId]);
  
  const { setData, data } = useRest<ChannelState>({
    read,
    update: undefined, // Disable default update to avoid the full payload issue
  });

  const updateFormValue = updateValue(setData);


  // Days of week configuration
  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  // Complete Run Every options - EXACTLY as original implementation
  const runEveryOptions = [
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
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' }
  ];

  // Update selected days when data changes
  useEffect(() => {
    if (data && data.schedule?.weekDays) {
      setSelectedDays(data.schedule.weekDays.filter(day => day >= 0));
    }
  }, [data]);

  // Update active date range when data changes
  useEffect(() => {
    if (data && data.activeDateRange) {
      setDateRange([new Date(data.activeDateRange[0]), new Date(data.activeDateRange[1])]);
    }
  }, [data]);

  // Complete Off After options - EXACTLY as original implementation
  const offAfterOptions = [
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

  // Generate filtered Off After options based on Run Every constraint
  const getOffAfterOptions = () => {
    if (!data?.schedule?.runEvery) return offAfterOptions;
    
    const runEvery = data.schedule.runEvery;
    return offAfterOptions.filter(option => option.value < runEvery);
  };

  // Validate and auto-adjust Off After when Run Every changes
  const validateOffAfter = (newRunEvery: number) => {
    if (!data || !data.schedule) return;
    
    const currentOffAfter = data.schedule.offAfter;
    if (currentOffAfter >= newRunEvery) {
      // Find the largest valid Off After value less than newRunEvery
      const validOptions = offAfterOptions.filter(option => option.value < newRunEvery);
      const maxOffAfter = validOptions.length > 0 ? validOptions[validOptions.length - 1].value : 0.016;
      
      console.log(`Off After ${currentOffAfter} >= Run Every ${newRunEvery}. Auto-adjusting to ${maxOffAfter}`);
      
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          runEvery: newRunEvery,
          offAfter: maxOffAfter
        }
      });
      
      const optionLabel = validOptions.find(opt => opt.value === maxOffAfter)?.label || `${maxOffAfter}`;
      enqueueSnackbar(`Off After auto-adjusted to ${optionLabel} to maintain constraint`, { variant: 'info' });
    } else {
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          runEvery: newRunEvery
        }
      });
    }
  };

  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue];
      
      // Update the data with new weekDays
      if (data && data.schedule) {
        setData({
          ...data,
          schedule: {
            ...data.schedule,
            weekDays: newDays
          }
        });
      }
      return newDays;
    });
  };

  const handleDateRange = (value: DateRange | null) => {
    if (value) {
      setDateRange(value);
      if (data && value[0] && value[1]) {
        setData({
          ...data,
          activeDateRange: [value[0].toISOString(), value[1].toISOString()]
        });
      }
    }
  };

  const handleRunEveryChange = (event: any) => {
    const newRunEvery = parseFloat(event.target.value);
    validateOffAfter(newRunEvery);
  };

  const handleOffAfterChange = (event: any) => {
    const newOffAfter = parseFloat(event.target.value);
    if (data && data.schedule) {
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          offAfter: newOffAfter
        }
      });
    }
  };

  const handleHotTimeChange = (event: any, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    // Constrain to maximum 4 hours as per original implementation
    const constrainedValue = Math.min(value, 4);
    
    if (data && data.schedule) {
      setData({
        ...data,
        schedule: {
          ...data.schedule,
          hotTimeHour: constrainedValue
        }
      });
    }
  };

  const handleSave = async () => {
    if (!data) return;
    
    setSaving(true);
    try {
      // Create minimal payload
      const minimalPayload = {
        enabled: data.enabled,
        name: data.name,
        schedule: {
          runEvery: data.schedule.runEvery,
          offAfter: data.schedule.offAfter,
          startTimeHour: data.schedule.startTimeHour,
          startTimeMinute: data.schedule.startTimeMinute,
          endTimeHour: data.schedule.endTimeHour,
          endTimeMinute: data.schedule.endTimeMinute,
          hotTimeHour: data.schedule.hotTimeHour,
          overrideTime: data.schedule.overrideTime,
          weekDays: data.schedule.weekDays,
        },
        activeDateRange: data.activeDateRange,
        enableDateRange: data.enableDateRange,
        activeOutsideDateRange: data.activeOutsideDateRange,
        enableTimeSpan: data.enableTimeSpan,
        randomize: data.randomize,
        enableMinimumRunTime: data.enableMinimumRunTime,
        controlPin: data.controlPin,
        homeAssistantTopicType: data.homeAssistantTopicType,
        homeAssistantIcon: data.homeAssistantIcon,
        enableRemoteConfiguration: data.enableRemoteConfiguration,
        masterIPAddress: data.masterIPAddress,
      };
      
      const response = await Api.createUpdateChannelApi(channelId, minimalPayload as ChannelState);
      setData(response.data);
      enqueueSnackbar('Schedule saved successfully!', { variant: 'success' });
    } catch (err: any) {
      console.error(`Failed to update channel ${channelId}:`, err);
      enqueueSnackbar('Failed to save schedule', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Channel-specific styling no longer needed - using aesthetic colors for each card

  // Show loading until data is available
  if (!data || !data.schedule) {
    return (
      <SectionContent title="Loading Schedule..." titleGutter>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </SectionContent>
    );
  }

  const { allowedMaxDays } = DateRangePicker;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Basic Settings */}
      <SectionContent title={<><SettingsIcon sx={{ color: '#1976D2', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#1976D2' }}>{data.name} Schedule Configuration</span></>} titleGutter>
        
        <TextField
          label="Channel Name"
          value={data.name}
          onChange={updateFormValue}
          name="name"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2,
          mt: 2
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={data.enabled}
                onChange={(e) => setData({ ...data, enabled: e.target.checked })}
                color="primary"
              />
            }
            label="Schedule Enabled"
            sx={{ flexGrow: 1, margin: 0 }}
          />
          
          <Button
            startIcon={<SaveIcon />}
            disabled={saving}
            variant="contained"
            color="primary"
            onClick={handleSave}
            size={isMobile ? "medium" : "small"}
            sx={{ 
              minWidth: isMobile ? '100%' : 120,
              height: isMobile ? 42 : 36,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: isMobile ? '0.875rem' : '0.75rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D1 90%)',
                boxShadow: '0 3px 15px rgba(33, 150, 243, 0.4)',
              },
              '&:disabled': {
                background: '#ccc',
                boxShadow: 'none',
              }
            }}
          >
            {saving ? (isMobile ? 'Saving...' : 'Save...') : (isMobile ? 'Save Schedule' : 'Save')}
          </Button>
        </Box>
      </SectionContent>



      {/* Home Assistant Integration */}
      <SectionContent title={<><HomeIcon sx={{ color: '#4CAF50', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#4CAF50' }}>Home Assistant MQTT Integration</span></>} titleGutter>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Topic Type</Typography>
            <Select
              value={data.homeAssistantTopicType}
              onChange={(e) => setData({ ...data, homeAssistantTopicType: parseInt(e.target.value as string) })}
              fullWidth
              variant="outlined"
            >
              <MenuItem value={0}>Light</MenuItem>
              <MenuItem value={1}>Switch</MenuItem>
            </Select>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Home Assistant Icon</Typography>
            <Select
              value={data.homeAssistantIcon}
              onChange={(e) => setData({ ...data, homeAssistantIcon: e.target.value })}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="mdi:air-conditioner"><Icon size={1} path={mdiAirConditioner} color="#00BCD4" />air-conditioner</MenuItem>
              <MenuItem value="mdi:camera"><Icon size={1} path={mdiCamera} color="#607D8B" />camera</MenuItem>
              <MenuItem value="mdi:ceiling-fan-light"><Icon size={1} path={mdiCeilingFanLight} color="#FFC107" />ceiling-fan-light</MenuItem>
              <MenuItem value="mdi:fan"><Icon size={1} path={mdiFan} color="#FF9800" />fan</MenuItem>
              <MenuItem value="mdi:fridge"><Icon size={1} path={mdiFridgeOutline} color="#4CAF50" />fridge</MenuItem>
              <MenuItem value="mdi:garage"><Icon size={1} path={mdiGarage} color="#9C27B0" />garage</MenuItem>
              <MenuItem value="mdi:garage-variant"><Icon size={1} path={mdiGarageVariant} color="#673AB7" />garage-variant</MenuItem>
              <MenuItem value="mdi:lightbulb"><Icon size={1} path={mdiLightbulbOn} color="#FFC107" />light</MenuItem>
              <MenuItem value="mdi:microwave"><Icon size={1} path={mdiMicrowave} color="#795548" />microwave</MenuItem>
              <MenuItem value="mdi:power"><Icon size={1} path={mdiPower} color="#F44336" />power</MenuItem>
              <MenuItem value="mdi:printer"><Icon size={1} path={mdiPrinter} color="#9E9E9E" />printer</MenuItem>
              <MenuItem value="mdi:printer-wireless"><Icon size={1} path={mdiPrinterWireless} color="#607D8B" />printer-wireless</MenuItem>
              <MenuItem value="mdi:speaker"><Icon size={1} path={mdiSpeaker} color="#E91E63" />speaker</MenuItem>
              <MenuItem value="mdi:speaker-wireless"><Icon size={1} path={mdiSpeakerMultiple} color="#E91E63" />speaker-wireless</MenuItem>
              <MenuItem value="mdi:television-ambient-light"><Icon size={1} path={mdiTelevisionAmbientLight} color="#3F51B5" />television-ambient-light</MenuItem>
              <MenuItem value="mdi:television"><Icon size={1} path={mdiTelevision} color="#3F51B5" />television</MenuItem>
              <MenuItem value="mdi:toaster"><Icon size={1} path={mdiToaster} color="#FF5722" />toaster</MenuItem>
              <MenuItem value="mdi:toaster-oven"><Icon size={1} path={mdiToasterOven} color="#FF5722" />toaster-oven</MenuItem>
              <MenuItem value="mdi:water-pump"><Icon size={1} path={mdiWaterPump} color="#2196F3" />water pump</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </SectionContent>

      {/* Operation Mode */}
      <SectionContent title={<><ShuffleIcon sx={{ color: '#FF9800', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#FF9800' }}>Operation Mode & Advanced Options</span></>} titleGutter>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={data.enableTimeSpan}
              onChange={(e) => setData({ ...data, enableTimeSpan: e.target.checked })}
              color="primary"
            />
          }
          label="Enable Time Span Mode"
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={data.randomize}
              onChange={(e) => setData({ ...data, randomize: e.target.checked })}
              disabled={data.enableTimeSpan}
              color="primary"
            />
          }
          label="Enable Randomization"
        />
        
        {!data.enableTimeSpan && data.randomize && (
          <FormControlLabel
            control={
              <Checkbox
                checked={data.enableMinimumRunTime}
                onChange={(e) => setData({ ...data, enableMinimumRunTime: e.target.checked })}
                color="primary"
              />
            }
            label="Enable Minimum Run Time"
          />
        )}
      </SectionContent>

      {/* Active Days */}
      <SectionContent title={<><CalendarTodayIcon sx={{ color: '#9C27B0', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#9C27B0' }}>Weekly Schedule - Active Days</span></>} titleGutter>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: isMobile ? 0.5 : 1,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          {daysOfWeek.map((day) => (
            <Chip
              key={day.value}
              label={day.label}
              onClick={() => handleDayToggle(day.value)}
              color={selectedDays.includes(day.value) ? "primary" : "default"}
              variant={selectedDays.includes(day.value) ? "filled" : "outlined"}
              sx={{ 
                fontSize: isMobile ? '0.65rem' : '0.875rem',
                height: isMobile ? '24px' : '32px',
                minWidth: isMobile ? '32px' : '64px',
                '& .MuiChip-label': {
                  padding: isMobile ? '0 4px' : '0 12px'
                }
              }}
            />
          ))}
        </Box>
      </SectionContent>

      {/* Schedule Timing */}
      <SectionContent title={<><RepeatIcon sx={{ color: '#F44336', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#F44336' }}>Schedule Timing & Intervals</span></>} titleGutter>
        
        {!data.enableTimeSpan && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Run Every</Typography>
              <Select
                value={data.schedule.runEvery}
                onChange={handleRunEveryChange}
                fullWidth
                variant="outlined"
                sx={{ minWidth: 200 }}
              >
                {runEveryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Off After</Typography>
              <Select
                value={data.schedule.offAfter}
                onChange={handleOffAfterChange}
                fullWidth
                variant="outlined"
                sx={{ minWidth: 200 }}
              >
                {getOffAfterOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        )}

        {!data.enableTimeSpan && data.schedule.runEvery <= data.schedule.offAfter && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Off After ({data.schedule.offAfter} min) must be less than Run Every ({data.schedule.runEvery} min)
          </Alert>
        )}
        
        {data.enableTimeSpan && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Time Span Mode enabled - device will operate between start and end times only.
          </Alert>
        )}
      </SectionContent>

      {/* Time Range */}
      <SectionContent title={<><AccessTimeIcon sx={{ color: '#00BCD4', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#00BCD4' }}>Daily Time Range Control</span></>} titleGutter>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography gutterBottom>Start Hour</Typography>
            <Select
              value={data.schedule?.startTimeHour ?? 0}
              onChange={(e) => setData({
                ...data,
                schedule: { ...data.schedule, startTimeHour: parseInt(e.target.value as string) }
              })}
              fullWidth
              variant="outlined"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography gutterBottom>Start Minute</Typography>
            <Select
              value={data.schedule?.startTimeMinute ?? 0}
              onChange={(e) => setData({
                ...data,
                schedule: { ...data.schedule, startTimeMinute: parseInt(e.target.value as string) }
              })}
              fullWidth
              variant="outlined"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography gutterBottom>End Hour</Typography>
            <Select
              value={data.schedule?.endTimeHour ?? 23}
              onChange={(e) => setData({
                ...data,
                schedule: { ...data.schedule, endTimeHour: parseInt(e.target.value as string) }
              })}
              fullWidth
              variant="outlined"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Typography gutterBottom>End Minute</Typography>
            <Select
              value={data.schedule?.endTimeMinute ?? 59}
              onChange={(e) => setData({
                ...data,
                schedule: { ...data.schedule, endTimeMinute: parseInt(e.target.value as string) }
              })}
              fullWidth
              variant="outlined"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </SectionContent>

      {/* Hot Time Configuration */}
      {!data.enableTimeSpan && data.randomize && (
        <SectionContent title={<><TimerIcon sx={{ color: '#FF5722', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#FF5722' }}>Hot Time Hours Configuration (Max 4)</span></>} titleGutter>
          
          <Box sx={{ px: 2 }}>
            <Slider
              value={data.schedule?.hotTimeHour ?? 0}
              onChange={handleHotTimeChange}
              min={0}
              max={4}
              step={1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}h`}
            />
          </Box>
        </SectionContent>
      )}

      {/* Date Range */}
      <SectionContent title={<><DateRangeIcon sx={{ color: '#795548', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#795548' }}>Optional Date Range Control</span></>} titleGutter>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={data.enableDateRange}
              onChange={(e) => setData({ ...data, enableDateRange: e.target.checked })}
              color="primary"
            />
          }
          label="Enable Date Range"
        />
        
        {data.enableDateRange && (
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.activeOutsideDateRange}
                  onChange={(e) => setData({ ...data, activeOutsideDateRange: e.target.checked })}
                  color="primary"
                />
              }
              label="Active Outside Date Range"
            />
            <Box sx={{ mt: 2 }}>
              <DateRangePicker
                size="lg"
                appearance="default"
                style={{ width: '100%', maxWidth: 280 }}
                value={activeDateRange}
                onChange={handleDateRange}
                disabledDate={allowedMaxDays?.(365)}
              />
            </Box>
          </Box>
        )}
      </SectionContent>

      {/* Override Time */}
      <SectionContent title={<><TimerIcon sx={{ color: '#E91E63', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#E91E63' }}>Manual Override Time Control</span></>} titleGutter>
        
        <Typography gutterBottom>Override Time</Typography>
        <Select
          value={data.schedule?.overrideTime ?? 960}
          onChange={(e) => setData({
            ...data,
            schedule: { ...data.schedule, overrideTime: parseFloat(e.target.value as string) }
          })}
          fullWidth
          variant="outlined"
          sx={{ maxWidth: 300 }}
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
      </SectionContent>

      {/* Remote Device Configuration */}
      <SectionContent title={<><CloudIcon sx={{ color: '#673AB7', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#673AB7' }}>Remote Device Configuration Setup</span></>} titleGutter>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={data.enableRemoteConfiguration || false}
              onChange={(e) => setData({ ...data, enableRemoteConfiguration: e.target.checked })}
              color="primary"
            />
          }
          label="Enable Remote Device Configuration"
        />
        
        {data.enableRemoteConfiguration && (
          <TextField
            label="Master IP Address"
            value={data.masterIPAddress || ''}
            onChange={(e) => setData({ ...data, masterIPAddress: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="192.168.1.100"
            helperText="IP address of the master device for remote configuration"
          />
        )}
      </SectionContent>

      {/* Control Pin Configuration */}
      <SectionContent title={<><SettingsIcon sx={{ color: '#607D8B', mr: 1, fontSize: isMobile ? '1.1rem' : '1.5rem' }} /><span style={{ color: '#607D8B' }}>Hardware GPIO Pin Configuration</span></>} titleGutter>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Control Pin</Typography>
            <Select
              value={data.controlPin}
              onChange={(e) => setData({ ...data, controlPin: parseInt(e.target.value as string) })}
              disabled={data.enabled}
              fullWidth
              variant="outlined"
            >
              <MenuItem value={0}>GPIO0</MenuItem>
              <MenuItem value={4}>GPO4</MenuItem>
              <MenuItem value={5}>GPIO5</MenuItem>
              <MenuItem value={12}>GPIO12</MenuItem>
              <MenuItem value={13}>GPIO13</MenuItem>
              <MenuItem value={14}>GPIO14</MenuItem>
              <MenuItem value={18}>GPIO18</MenuItem>
              <MenuItem value={19}>GPIO19</MenuItem>
              <MenuItem value={21}>GPIO21</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </SectionContent>

      {/* Save Button */}
      <SectionContent title="" titleGutter={false}>
        <Button
          startIcon={<SaveIcon />}
          disabled={saving}
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth={isMobile}
          sx={{ 
            mt: 2,
            minWidth: 140,
            height: 48,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '1rem',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D1 90%)',
              boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
            }
          }}
        >
          {saving ? 'Saving...' : 'Save Schedule'}
        </Button>
      </SectionContent>
    </Box>
  );
};

export default SectionedScheduleForm;