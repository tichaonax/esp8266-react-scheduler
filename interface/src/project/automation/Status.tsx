import React, { FC } from 'react';

import { 
  Box, 
  Grid, 
  Fade, 
  useTheme, 
  useMediaQuery,
  Typography,
  Chip,
  Paper
} from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WifiIcon from '@mui/icons-material/Wifi';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';

import { useLayoutTitle } from '../../components';

import ChannelOneStateWebSocketForm from './channels/ws/ChannelOneStateWebSocketForm';
import ChannelTwoStateWebSocketForm from './channels/ws/ChannelTwoStateWebSocketForm';
import ChannelThreeStateWebSocketForm from './channels/ws/ChannelThreeStateWebSocketForm';
import ChannelFourStateWebSocketForm from './channels/ws/ChannelFourStateWebSocketForm';
import { RemoteUtils } from './utils/remoteUtils';

const useStyles = makeStyles((theme: any) => createStyles({
  statusContainer: {
    padding: theme.spacing(2),
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: 'calc(100vh - 64px)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
      zIndex: 0,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  headerSection: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(3),
    },
  },
  headerCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: theme.spacing(3),
    padding: theme.spacing(4),
    maxWidth: 600,
    margin: '0 auto',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      : '0 8px 32px 0 rgba(102, 126, 234, 0.37)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(2),
    },
  },
  headerTitle: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 70%, #e1f5fe 100%)'
      : 'linear-gradient(45deg, #ffffff 30%, #f8f9ff 70%, #e3f2fd 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.8rem',
    },
  },
  headerSubtitle: {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    fontSize: '1.1rem',
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.95rem',
    },
  },
  statusChips: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
  },
  statusChip: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(76, 175, 80, 0.2)'
      : 'rgba(255, 255, 255, 0.3)',
    color: theme.palette.mode === 'dark' ? '#4caf50' : '#ffffff',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.4)'}`,
    fontWeight: 600,
    '& .MuiChip-icon': {
      color: 'inherit',
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
  dashboardIcon: {
    fontSize: 'inherit',
    marginRight: theme.spacing(2),
    verticalAlign: 'middle',
    filter: theme.palette.mode === 'dark' 
      ? 'drop-shadow(0 0 10px rgba(79, 195, 247, 0.5))'
      : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
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
        <Box className={classes.contentWrapper}>
          {/* Header Section */}
          <Box className={classes.headerSection}>
            <Paper className={classes.headerCard} elevation={0}>
              <Typography variant="h2" className={classes.headerTitle}>
                <DashboardIcon className={classes.dashboardIcon} />
                Device Status Dashboard
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Real-time WebSocket monitoring of {channels.length} active channel{channels.length !== 1 ? 's' : ''}
              </Typography>
              
              {/* Status Indicators */}
              <Box className={classes.statusChips}>
                <Chip 
                  icon={<WifiIcon />} 
                  label="Connected" 
                  className={classes.statusChip}
                  size="small"
                />
                <Chip 
                  icon={<SpeedIcon />} 
                  label="Real-time" 
                  className={classes.statusChip}
                  size="small"
                />
                <Chip 
                  icon={<DevicesIcon />} 
                  label={`${channels.length} Active`}
                  className={classes.statusChip}
                  size="small"
                />
              </Box>
            </Paper>
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
