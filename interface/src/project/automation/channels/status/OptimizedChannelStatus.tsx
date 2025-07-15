import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Typography, Box, Switch, Button, IconButton } from '@mui/material';
import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { FormLoader, SectionContent } from '../../../../components';
import { updateValue } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';

const useStyles = makeStyles((theme: Theme) => createStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    minHeight: 40, // Fixed height to prevent jumping
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  scheduleButtonOne: {
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    color: '#2196F3', // Blue for Water Pump
    '&:hover': {
      opacity: 1,
      color: '#1976D2',
    },
  },
  scheduleButtonTwo: {
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    color: '#4CAF50', // Green for Fridge
    '&:hover': {
      opacity: 1,
      color: '#388E3C',
    },
  },
  scheduleButtonThree: {
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    color: '#FF9800', // Orange for Bedroom Light
    '&:hover': {
      opacity: 1,
      color: '#F57C00',
    },
  },
  scheduleButtonFour: {
    opacity: 0.7,
    transition: 'opacity 0.2s ease',
    color: '#9C27B0', // Purple for Outside Lights
    '&:hover': {
      opacity: 1,
      color: '#7B1FA2',
    },
  },
  statusSwitch: {
    transition: 'all 0.3s ease',
  },
  statusSwitchUpdating: {
    animation: '$pulse 1.5s ease-in-out infinite',
    transform: 'scale(1.05)', // Subtle scaling for refresh indicator
    '& .MuiSwitch-track': {
      border: '2px solid #2196F3 !important', // Blue border to indicate refresh
      boxShadow: '0 0 8px rgba(33, 150, 243, 0.4) !important',
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 0 6px rgba(33, 150, 243, 0.6) !important',
    },
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.7,
    },
    '100%': {
      opacity: 1,
    },
  },
  infoRow: {
    marginBottom: theme.spacing(1),
    minHeight: 24, // Fixed height to prevent jumping
  },
  errorContainer: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing(1),
  },
  controlPinText: {
    color: theme.palette.info.main,
    fontWeight: 'bold',
  },
  nextRunText: {
    color: theme.palette.warning.main,
    fontWeight: 'bold',
  },
  lastChangeText: {
    color: theme.palette.secondary.main,
  },
  ipTimeText: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  timeValueText: {
    color: theme.palette.success.main,
    fontWeight: 'bold',
  },
  channelTitleOne: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Blue gradient for Water Pump
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleTwo: {
    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', // Green gradient for Fridge
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleThree: {
    background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)', // Orange gradient for Bedroom Light
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
  channelTitleFour: {
    background: 'linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)', // Purple-Pink gradient for Outside Lights
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 'bold',
  },
}));

interface OptimizedChannelStatusProps {
  channelId: string;
  defaultAutoRefresh?: boolean;
  defaultInterval?: number;
}

const OptimizedChannelStatus: FC<OptimizedChannelStatusProps> = ({ 
  channelId, 
  defaultAutoRefresh = false,
  defaultInterval = 30000 
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [data, setData] = React.useState<ChannelState | null>(null);
  const [loading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Data fetching function - prevent flashing by not clearing data
  const fetchChannelData = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    try {
      const response = await Api.createReadChannelApi(channelId);
      setData(response.data); // Only update data, don't clear it first
      setErrorMessage(null); // Clear error only on success
    } catch (err: any) {
      console.error(`Failed to fetch channel ${channelId} data:`, err);
      // Only set error if we don't have existing data
      setErrorMessage(err?.response?.status === 401 ? 'Authentication required' : 'Failed to load data');
    } finally {
      // Keep animation visible for a brief moment so user can see it
      setTimeout(() => {
        setRefreshing(false);
      }, 800); // Show animation for 800ms minimum
    }
  }, [channelId]);

  // Auto-refresh effect
  useEffect(() => {
    // Initial load
    fetchChannelData();

    if (defaultAutoRefresh && defaultInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchChannelData();
      }, defaultInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [channelId, defaultAutoRefresh, defaultInterval, fetchChannelData]);

  // Update function for the toggle - send only essential fields that backend expects
  const updateData = useCallback(async (updater: (prevState: Readonly<ChannelState>) => ChannelState) => {
    if (!data || saving) return;
    
    setSaving(true);
    try {
      const updatedData = updater(data);
      
      // Create minimal payload for toggle - only send what we're changing and what backend needs
      const minimalPayload = {
        controlPin: updatedData.controlPin,
        homeAssistantTopicType: updatedData.homeAssistantTopicType,
        homeAssistantIcon: updatedData.homeAssistantIcon,
        controlOn: updatedData.controlOn, // This is what we're actually changing
        name: updatedData.name,
        enabled: updatedData.enabled,
        enableTimeSpan: updatedData.enableTimeSpan,
        randomize: updatedData.randomize,
        enableMinimumRunTime: updatedData.enableMinimumRunTime,
        enableRemoteConfiguration: updatedData.enableRemoteConfiguration,
        masterIPAddress: updatedData.masterIPAddress,
        enableDateRange: updatedData.enableDateRange,
        activeOutsideDateRange: updatedData.activeOutsideDateRange,
        activeDateRange: updatedData.activeDateRange,
        schedule: {
          runEvery: updatedData.schedule.runEvery,
          offAfter: updatedData.schedule.offAfter,
          startTimeHour: updatedData.schedule.startTimeHour,
          startTimeMinute: updatedData.schedule.startTimeMinute,
          hotTimeHour: updatedData.schedule.hotTimeHour,
          overrideTime: updatedData.schedule.overrideTime,
          endTimeHour: updatedData.schedule.endTimeHour,
          endTimeMinute: updatedData.schedule.endTimeMinute,
          weekDays: updatedData.schedule.weekDays
          // Removed problematic fields that may be read-only:
          // - isOverride (might be backend controlled)
          // - isOverrideActive (might be backend controlled)
        }
        // Removed read-only fields:
        // - nextRunTime (backend generated)
        // - lastStartedChangeTime (backend generated)
        // - localDateTime (backend generated)
        // - IPAddress (backend generated)
        // - buildVersion (backend generated)
        // - uniqueId (backend generated)
      };
      
      console.log('Sending minimal payload:', JSON.stringify(minimalPayload, null, 2));
      const response = await Api.createUpdateChannelApi(channelId, minimalPayload as ChannelState);
      setData(response.data);
      console.log('Update successful:', response.data);
    } catch (err: any) {
      console.error(`Failed to update channel ${channelId}:`, err);
      console.error('Error details:', err.response?.data);
      setErrorMessage('Failed to update channel');
    } finally {
      setSaving(false);
    }
  }, [data, saving, channelId]);

  // Use the exact same pattern as working WebSocket form
  const updateFormValue = updateValue(updateData);
  
  // Handle switch toggle
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFormValue(event);
  };

  // Get the appropriate title class based on channel ID
  // const getTitleClass = () => {
  //   switch (channelId) {
  //     case 'One': return classes.channelTitleOne;
  //     case 'Two': return classes.channelTitleTwo;
  //     case 'Three': return classes.channelTitleThree;
  //     case 'Four': return classes.channelTitleFour;
  //     default: return classes.channelTitleOne;
  //   }
  // };

  // Get the appropriate button class based on channel ID
  const getButtonClass = () => {
    switch (channelId) {
      case 'One': return classes.scheduleButtonOne;
      case 'Two': return classes.scheduleButtonTwo;
      case 'Three': return classes.scheduleButtonThree;
      case 'Four': return classes.scheduleButtonFour;
      default: return classes.scheduleButtonOne;
    }
  };

  // Get the schedule page route based on channel ID
  const getScheduleRoute = () => {
    switch (channelId) {
      case 'One': return '/p/a/1';
      case 'Two': return '/p/a/2';
      case 'Three': return '/p/a/3';
      case 'Four': return '/p/a/4';
      default: return '/p/a/1';
    }
  };

  // Navigate to schedule page
  const handleScheduleClick = () => {
    navigate(getScheduleRoute());
  };

  // Manual retry function
  const handleRetry = useCallback(() => {
    fetchChannelData();
  }, [fetchChannelData]);

  const renderContent = () => {
    // Error state
    if (errorMessage) {
      return (
        <div className={classes.errorContainer}>
          <Typography variant="h6" gutterBottom>
            Channel {channelId}
          </Typography>
          <Typography color="error" variant="body2" gutterBottom>
            {errorMessage}
          </Typography>
          {errorMessage === 'Authentication required' ? (
            <Typography variant="caption" color="text.secondary">
              Please log in to view channel status
            </Typography>
          ) : null}
          <Button 
            className={classes.retryButton}
            variant="outlined"
            size="small"
            onClick={handleRetry}
            disabled={saving}
          >
            {saving ? 'Loading...' : 'Retry'}
          </Button>
        </div>
      );
    }

    // Loading state (only on initial load)
    if (!data && loading) {
      return <FormLoader onRetry={handleRetry} errorMessage={undefined} />;
    }

    // No data state
    if (!data) {
      return (
        <div className={classes.errorContainer}>
          <Typography variant="h6" gutterBottom>
            Channel {channelId}
          </Typography>
          <Typography color="text.secondary">
            No data available
          </Typography>
          <Button 
            className={classes.retryButton}
            variant="outlined"
            size="small"
            onClick={handleRetry}
            disabled={saving}
          >
            Load Data
          </Button>
        </div>
      );
    }

    // No schedule configured
    if (!data.schedule) {
      return (
        <div className={classes.errorContainer}>
          <Typography variant="h6" gutterBottom>
            Channel {channelId}
          </Typography>
          <Typography color="text.secondary">
            Channel not configured
          </Typography>
        </div>
      );
    }

    // Main content with data
    return (
      <>
        <Box className={classes.header}>
          <Box className={classes.titleSection}>
            <IconButton 
              size="small" 
              className={getButtonClass()}
              onClick={handleScheduleClick}
              title="Open Schedule Settings"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
          <Switch 
            className={`${classes.statusSwitch} ${refreshing ? classes.statusSwitchUpdating : ''}`}
            name="controlOn"
            checked={data.controlOn}
            color="success"
            size="medium"
            disabled={saving}
            onChange={handleToggle}
          />
        </Box>
        
        <Typography variant="body2" className={classes.infoRow}>
          Control Pin: <span className={classes.controlPinText}>{data.controlPin}</span>
        </Typography>
        
        <Typography variant="body2" className={classes.infoRow}>
          Next Run: <span className={classes.nextRunText}>{data.nextRunTime || 'Not set'}</span>
        </Typography>
        
        <Typography variant="body2" className={classes.infoRow}>
          Last Change: <span className={classes.lastChangeText}>{data.lastStartedChangeTime || 'Not set'}</span>
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          IP: <span className={classes.controlPinText}>{data.IPAddress}</span> | Time: <span className={classes.timeValueText}>{data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}</span>
        </Typography>
      </>
    );
  };

  return (
    <SectionContent title={`${data?.name || 'Channel'} Status`} titleGutter>
      {renderContent()}
    </SectionContent>
  );
};

export default OptimizedChannelStatus;