import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Theme, Paper, Typography, Button, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Box, Grid } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import { useLayoutTitle } from '../components';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(3),
    maxWidth: 800,
  },
  controlsSection: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  dataSection: {
    padding: theme.spacing(3),
  },
  summarySection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.success.light,
  },
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
  dataGrid: {
    fontSize: '16px',
  },
  statusText: {
    color: theme.palette.primary.main,
  },
  valueText: {
    color: theme.palette.success.main,
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
  counterText: {
    color: theme.palette.error.main,
  },
}));

interface TestData {
  timestamp: string;
  randomValue: number;
  counter: number;
}

const TestAutoRefresh: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<TestData>({
    timestamp: new Date().toLocaleTimeString(),
    randomValue: Math.floor(Math.random() * 100),
    counter: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useLayoutTitle("Auto-Refresh Test");

  // Simulate API call - replace with real endpoint
  const fetchData = useCallback(async (): Promise<TestData> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      timestamp: new Date().toLocaleTimeString(),
      randomValue: Math.floor(Math.random() * 100),
      counter: data.counter + 1
    };
  }, [data.counter]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const newData = await fetchData();
      setData(newData); // Only update data, no component remounting
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshEnabled && refreshInterval > 0) {
      intervalRef.current = setInterval(async () => {
        if (!isRefreshing) {
          try {
            const newData = await fetchData();
            setData(newData); // Smooth update without flashing
          } catch (error) {
            console.error('Auto-refresh failed:', error);
          }
        }
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefreshEnabled, refreshInterval, isRefreshing, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Box className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Auto-Refresh Test Page
      </Typography>
      
      {/* Controls */}
      <Paper className={classes.controlsSection}>
        <Typography variant="h5" gutterBottom>
          Auto-Refresh Controls
        </Typography>
        
        <Box className={classes.buttonContainer}>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            sx={{ marginRight: 2 }}
          >
            {isRefreshing ? 'Refreshing...' : '↻ Manual Refresh'}
          </Button>
          
          <Typography component="span">
            Status: {isRefreshing ? 'Updating...' : 'Idle'}
          </Typography>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
              />
            }
            label="Enable Auto-Refresh"
          />
        </Box>

        {autoRefreshEnabled && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Interval</InputLabel>
            <Select
              value={refreshInterval}
              label="Interval"
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
            >
              <MenuItem value={2000}>2 seconds</MenuItem>
              <MenuItem value={5000}>5 seconds</MenuItem>
              <MenuItem value={10000}>10 seconds</MenuItem>
              <MenuItem value={30000}>30 seconds</MenuItem>
            </Select>
          </FormControl>
        )}
      </Paper>

      {/* Data Display */}
      <Paper className={classes.dataSection}>
        <Typography variant="h5" gutterBottom>
          Live Data (Updates Without Page Refresh)
        </Typography>
        
        <Grid container spacing={2} className={classes.dataGrid}>
          <Grid item xs={4}>
            <Typography variant="body1" component="strong">Last Updated:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className={classes.statusText}>
              {data.timestamp}
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="body1" component="strong">Random Value:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className={classes.valueText}>
              {data.randomValue}
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="body1" component="strong">Refresh Counter:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className={classes.counterText}>
              {data.counter}
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="body1" component="strong">Auto-Refresh:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              {autoRefreshEnabled ? `Enabled (${refreshInterval/1000}s)` : 'Disabled'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={classes.summarySection}>
        <Typography variant="h6" gutterBottom>
          <span role="img" aria-label="checkmark">✅</span> This Implementation:
        </Typography>
        <Typography component="ul" sx={{ margin: 0, paddingLeft: 3 }}>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>No component remounting</strong> - Only data state updates</li>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>No flashing</strong> - Smooth value transitions</li>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>No ERR_INSUFFICIENT_RESOURCES</strong> - Single API call per refresh</li>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>Proper cleanup</strong> - Intervals cleared on unmount</li>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>User controlled</strong> - Manual enable/disable and intervals</li>
          <li><span role="img" aria-label="checkmark">✅</span> <strong>ESP friendly</strong> - Conservative by default</li>
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestAutoRefresh;