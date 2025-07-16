import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, IconButton, Switch, Chip } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

interface AutoRefreshWrapperProps {
  children: React.ReactNode;
  onRefresh: () => void;
  defaultInterval?: number;
  defaultEnabled?: boolean;
  showControls?: boolean;
  title?: string;
}

const useStyles = makeStyles((theme: any) => createStyles({
  controlsCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: theme.palette.mode === 'dark' 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 16px rgba(0, 0, 0, 0.3)'
      : '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  controlsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  refreshButton: {
    background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #45a049 30%, #388e3c 90%)',
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
  },
  settingsButton: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #607D8B 30%, #546E7A 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
    color: 'white',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #546E7A 30%, #455A64 90%)'
        : 'linear-gradient(45deg, #1976D2 30%, #1565C0 90%)',
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
  },
  settingsPanel: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  },
  intervalChips: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  intervalChip: {
    cursor: 'pointer',
    fontWeight: 500,
    '&:hover': {
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease-in-out',
  },
}));

/**
 * Wrapper component that adds auto-refresh functionality to any child component
 * Includes manual refresh button and optional settings panel
 */
export const AutoRefreshWrapper: React.FC<AutoRefreshWrapperProps> = ({
  children,
  onRefresh,
  defaultInterval = 60000, // Default to 1 minute
  defaultEnabled = true,
  showControls = true,
  title = "Auto-refresh for ESP32"
}) => {
  const classes = useStyles();
  const [interval, setInterval] = useState(defaultInterval);
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [showSettings, setShowSettings] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Wrap onRefresh to track last refresh time
  const handleRefresh = () => {
    onRefresh();
    setLastRefresh(new Date());
  };

  const { manualRefresh } = useAutoRefresh({
    interval,
    enabled,
    onRefresh: handleRefresh
  });

  // Set initial refresh time
  useEffect(() => {
    if (!lastRefresh) {
      setLastRefresh(new Date());
    }
  }, [lastRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  // ESP-optimized intervals - very conservative for resource-constrained devices
  const intervalOptions = [
    { label: '30 seconds', value: 30000, color: '#F44336' }, // Red - Very frequent
    { label: '1 minute', value: 60000, color: '#FF9800' }, // Orange - Frequent
    { label: '2 minutes', value: 120000, color: '#2196F3' }, // Blue - Regular
    { label: '5 minutes', value: 300000, color: '#4CAF50' }, // Green - Moderate
    { label: '10 minutes', value: 600000, color: '#9C27B0' }, // Purple - Conservative
    { label: 'Manual only', value: 0, color: '#607D8B' } // Grey - Disabled
  ];

  if (!showControls) {
    // Simple wrapper without controls
    return <>{children}</>;
  }

  return (
    <Box>
      {/* Modern auto-refresh controls */}
      <Card className={classes.controlsCard}>
        <Box className={classes.controlsHeader}>
          <Box className={classes.statusInfo}>
            <ScheduleIcon sx={{ color: enabled ? '#4CAF50' : '#9E9E9E' }} />
            <Typography variant="body2" fontWeight={600}>
              {enabled ? `Auto-refresh: ${interval / 1000}s` : 'Manual refresh only'}
            </Typography>
            {lastRefresh && (
              <Typography variant="caption" color="textSecondary">
                Last: {formatTime(lastRefresh)}
              </Typography>
            )}
          </Box>

          <Box className={classes.actionButtons}>
            <IconButton 
              onClick={manualRefresh}
              className={classes.refreshButton}
              size="small"
              title="Refresh now"
            >
              <RefreshIcon />
            </IconButton>
            
            <IconButton 
              onClick={() => setShowSettings(!showSettings)}
              className={classes.settingsButton}
              size="small"
              title="Auto-refresh settings"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Modern settings panel */}
        {showSettings && (
          <Box className={classes.settingsPanel}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                Auto-refresh Settings
              </Typography>
              <Switch
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                color="primary"
              />
            </Box>

            {enabled && (
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                  Refresh Interval:
                </Typography>
                <Box className={classes.intervalChips}>
                  {intervalOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => setInterval(option.value)}
                      className={classes.intervalChip}
                      variant={interval === option.value ? "filled" : "outlined"}
                      size="small"
                      sx={{
                        backgroundColor: interval === option.value ? option.color : 'transparent',
                        borderColor: option.color,
                        color: interval === option.value ? 'white' : option.color,
                        fontWeight: interval === option.value ? 600 : 500,
                        '&:hover': {
                          backgroundColor: option.color,
                          color: 'white',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Card>

      {/* Main content */}
      {children}
    </Box>
  );
};