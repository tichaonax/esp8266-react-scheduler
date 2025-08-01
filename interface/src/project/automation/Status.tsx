import React, { FC } from 'react';

import { 
  Box, 
  Grid, 
  Fade, 
  useTheme, 
  useMediaQuery,
  Typography,
  Divider
} from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import DashboardIcon from '@mui/icons-material/Dashboard';

import { useLayoutTitle } from '../../components';

import ChannelOneStateWebSocketForm from './channels/ws/ChannelOneStateWebSocketForm';
import ChannelTwoStateWebSocketForm from './channels/ws/ChannelTwoStateWebSocketForm';
import ChannelThreeStateWebSocketForm from './channels/ws/ChannelThreeStateWebSocketForm';
import ChannelFourStateWebSocketForm from './channels/ws/ChannelFourStateWebSocketForm';
import { RemoteUtils } from './utils/remoteUtils';

const useStyles = makeStyles((theme: any) => createStyles({
  statusContainer: {
    padding: theme.spacing(3),
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: 'calc(100vh - 64px)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  headerSection: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  headerTitle: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  headerSubtitle: {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.95rem',
    },
  },
  channelGrid: {
    '& .MuiGrid-item': {
      display: 'flex',
      alignItems: 'stretch',
    },
  },
  channelWrapper: {
    width: '100%',
    '& > div': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

const Status: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    channelOne,
    channelTwo,
    channelThree,
    channelFour,
  } = RemoteUtils.getDeviceHost();

  useLayoutTitle("Status");

  const channels = [
    { component: ChannelOneStateWebSocketForm, name: 'Channel 1', enabled: channelOne, color: '#2196F3' },
    { component: ChannelTwoStateWebSocketForm, name: 'Channel 2', enabled: channelTwo, color: '#4CAF50' },
    { component: ChannelThreeStateWebSocketForm, name: 'Channel 3', enabled: channelThree, color: '#FF9800' },
    { component: ChannelFourStateWebSocketForm, name: 'Channel 4', enabled: channelFour, color: '#9C27B0' },
  ].filter(channel => channel.enabled);

  return (
    <Box className={classes.statusContainer}>
      <Fade in timeout={600}>
        <Box>
          {/* Header Section */}
          <Box className={classes.headerSection}>
            <Typography variant="h3" className={classes.headerTitle}>
              <DashboardIcon sx={{ 
                fontSize: 'inherit', 
                mr: 2, 
                verticalAlign: 'middle',
                color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#2196F3'
              }} />
              Device Status Dashboard
            </Typography>
            <Typography className={classes.headerSubtitle}>
              Live WebSocket monitoring of all {channels.length} active channels
            </Typography>
            <Divider sx={{ mt: 2, mb: 1, maxWidth: 400, mx: 'auto' }} />
          </Box>

          {/* Channel Grid */}
          <Grid 
            container 
            spacing={isMobile ? 2 : 3} 
            className={classes.channelGrid}
          >
            {channels.map((channel, index) => {
              const ChannelComponent = channel.component;
              return (
                <Grid 
                  item 
                  xs={12} 
                  md={channels.length === 1 ? 12 : channels.length === 2 ? 6 : 6}
                  lg={channels.length === 1 ? 12 : channels.length === 2 ? 6 : channels.length === 3 ? 4 : 3}
                  key={index}
                >
                  <Fade in timeout={800 + (index * 200)}>
                    <Box className={classes.channelWrapper}>
                      <ChannelComponent />
                    </Box>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Fade>
    </Box>
  );
};

export default Status;
