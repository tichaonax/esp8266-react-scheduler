import React, { FC, useCallback, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Switch, 
  Button, 
  IconButton,
  Card,
  CardContent,
  Avatar,
  Grid,
  useTheme,
  Fade
} from '@mui/material';
import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import RouterIcon from '@mui/icons-material/Router';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { FormLoader } from '../../../../components';
import { updateValue } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';

const useStyles = makeStyles((theme: Theme) => createStyles({
  statusContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  statusCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.3)'
      : '0 20px 40px rgba(0,0,0,0.2)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)',
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 25px 50px rgba(0,0,0,0.4)'
        : '0 25px 50px rgba(0,0,0,0.25)',
    },
  },
  headerSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(21, 101, 192, 0.8) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
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
  channelTitle: {
    color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  statusChip: {
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(1),
  },
  infoSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : '1px solid rgba(76, 175, 80, 0.3)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  infoIcon: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(2),
  },
  infoText: {
    color: theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32',
    fontWeight: 500,
  },
  errorSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    textAlign: 'center',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(244, 67, 54, 0.2)'
      : '1px solid rgba(244, 67, 54, 0.3)',
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
  const theme = useTheme();
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
      
      const response = await Api.createUpdateChannelApi(channelId, minimalPayload as ChannelState);
      setData(response.data);
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
        <CardContent>
          <Box className={classes.errorSection}>
            <Typography variant="h6" gutterBottom sx={{ color: '#f44336', fontWeight: 600 }}>
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
              variant="contained"
              size="small"
              onClick={handleRetry}
              disabled={saving}
              sx={{
                mt: 2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #ff5722 30%, #d84315 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                color: 'white',
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #d84315 30%, #bf360c 90%)'
                    : 'linear-gradient(45deg, #1976D2 30%, #1565C0 90%)',
                },
              }}
            >
              {saving ? 'Loading...' : 'Retry'}
            </Button>
          </Box>
        </CardContent>
      );
    }

    // Loading state (only on initial load)
    if (!data && loading) {
      return <FormLoader onRetry={handleRetry} errorMessage={undefined} />;
    }

    // No data state
    if (!data) {
      return (
        <CardContent>
          <Box className={classes.errorSection}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff9800', fontWeight: 600 }}>
              Channel {channelId}
            </Typography>
            <Typography color="text.secondary">
              No data available
            </Typography>
            <Button 
              variant="contained"
              size="small"
              onClick={handleRetry}
              disabled={saving}
              sx={{
                mt: 2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
                  : 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
                color: 'white',
              }}
            >
              Load Data
            </Button>
          </Box>
        </CardContent>
      );
    }

    // No schedule configured
    if (!data.schedule) {
      return (
        <CardContent>
          <Box className={classes.errorSection}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff9800', fontWeight: 600 }}>
              Channel {channelId}
            </Typography>
            <Typography color="text.secondary">
              Channel not configured
            </Typography>
          </Box>
        </CardContent>
      );
    }

    // Main content with data
    return (
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Box className={classes.headerSection}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" className={classes.channelTitle}>
              <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                <PowerSettingsNewIcon fontSize="small" />
              </Avatar>
              {data.name} Status
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                className={getButtonClass()}
                onClick={handleScheduleClick}
                title="Open Schedule Settings"
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
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
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : 'rgba(255,255,255,0.8)' }}>
            Control Pin: {data.controlPin}
          </Typography>
        </Box>
        
        {/* Information Section */}
        <Box className={classes.infoSection}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#FF9800' }} className={classes.infoIcon}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Next Run
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#ffcc80' : '#ff8f00', fontWeight: 600 }}>
                    {data.nextRunTime || 'Not set'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#9C27B0' }} className={classes.infoIcon}>
                  <HistoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Last Change
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#ce93d8' : '#8e24aa', fontWeight: 600 }}>
                    {data.lastStartedChangeTime || 'Not set'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#4CAF50' }} className={classes.infoIcon}>
                  <RouterIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    IP Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32', fontWeight: 600 }}>
                    {data.IPAddress}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#2196F3' }} className={classes.infoIcon}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Local Time
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2', fontWeight: 600 }}>
                    {data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    );
  };

  return (
    <Fade in timeout={600}>
      <Card className={classes.statusCard}>
        {renderContent()}
      </Card>
    </Fade>
  );
};

export default OptimizedChannelStatus;