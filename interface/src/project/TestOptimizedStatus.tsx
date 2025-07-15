import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import { useLayoutTitle } from '../components';
import OptimizedChannelStatus from './automation/channels/status/OptimizedChannelStatus';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(3),
  },
  gridItem: {
    display: 'flex',
  },
}));

const TestOptimizedStatus: React.FC = () => {
  const classes = useStyles();
  useLayoutTitle("Optimized Status Test");

  return (
    <Box className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Optimized Channel Status Test
      </Typography>
      
      <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
        Testing single channel with auto-refresh (no flashing, real data)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4} className={classes.gridItem}>
          <OptimizedChannelStatus 
            channelId="One" 
            defaultAutoRefresh={true}
            defaultInterval={3000}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestOptimizedStatus;