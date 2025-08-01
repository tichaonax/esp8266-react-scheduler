import React, { FC } from 'react';
import { useNavigate  } from "react-router-dom";
import { useLocation } from 'react-router';
import { 
  Switch, 
  Typography, 
  Card,
  CardContent,
  Box,
  Chip,
  Fade
} from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WifiIcon from '@mui/icons-material/Wifi';
import SettingsIcon from '@mui/icons-material/Settings';

import { FormLoader } from '../../../../components';
import { updateValue, useWs } from '../../../../utils';

import { ChannelState} from '../../redux/types/channel';
import { RemoteUtils } from '../../utils/remoteUtils';
import { ChannelStateWebSocketFormProps } from './ws';

const useStyles = makeStyles((theme: any) => createStyles({
  channelCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 12px 40px 0 rgba(0, 0, 0, 0.3)'
        : '0 12px 40px 0 rgba(102, 126, 234, 0.25)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(79, 195, 247, 0.3)' : 'rgba(255, 255, 255, 0.5)'}`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%)',
      borderRadius: '16px 16px 0 0',
    },
  },
  cardContent: {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
  },
  channelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  channelTitle: {
    fontWeight: 700,
    fontSize: '1.3rem',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 90%)'
      : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },
  connectionChip: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(76, 175, 80, 0.2)'
      : 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50',
    border: '1px solid rgba(76, 175, 80, 0.3)',
    fontWeight: 600,
    height: 24,
    '& .MuiChip-icon': {
      color: '#4caf50',
    },
  },
  switchContainer: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
  },
  switchControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  switchLabel: {
    fontWeight: 600,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusSwitch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#4caf50',
      '& + .MuiSwitch-track': {
        backgroundColor: '#4caf50',
      },
    },
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(255, 255, 255, 0.4)',
  },
  infoIcon: {
    fontSize: '1.2rem',
    color: theme.palette.mode === 'dark' ? '#4fc3f7' : '#1976d2',
  },
  infoText: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  scheduleLink: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  scheduleLinkButton: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: 'white',
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(3),
    fontSize: '0.875rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
    },
  },
}));

const ChannelStateWebSocketForm: FC<ChannelStateWebSocketFormProps> = ({websocketEndPoint}) => {
  const classes = useStyles();
  
  const { connected, updateData, data } = useWs<ChannelState>(`${RemoteUtils.getWsBaseAddress()}${websocketEndPoint}`);
  const updateFormValue = updateValue(updateData);
  const pathname = useLocation().pathname;
  const showLink = pathname.includes('/status');
  const navigate  = useNavigate ();
  const onClick = () => navigate(RemoteUtils.getNavigationLink('a', data?.restChannelEndPoint));

  const content = () => {
    if (!connected || !data) {
      return (
        <Card className={classes.channelCard} elevation={0}>
          <CardContent className={classes.cardContent}>
            <FormLoader message="Connecting to WebSocket…" />
          </CardContent>
        </Card>
      );
    }

    if(!data.schedule && RemoteUtils.isRemoteDevice()){
      const networkErrorMessage = `Remote device ${RemoteUtils.getRemoteDeviceUrl()} unreachable`;
      return (
        <Card className={classes.channelCard} elevation={0}>
          <CardContent className={classes.cardContent}>
            <FormLoader errorMessage={networkErrorMessage} />
          </CardContent>
        </Card>
      );
    }

    if(!data.schedule){
      const networkErrorMessage = `Requested ${RemoteUtils.getLastPathItem(window.location.pathname)} is not configured`;
      return (
        <Card className={classes.channelCard} elevation={0}>
          <CardContent className={classes.cardContent}>
            <FormLoader errorMessage={networkErrorMessage} />
          </CardContent>
        </Card>
      );
    }

    return (
      <Fade in timeout={600}>
        <Card className={classes.channelCard} elevation={0}>
          <CardContent className={classes.cardContent}>
            {/* Header */}
            <Box className={classes.channelHeader}>
              <Typography className={classes.channelTitle}>
                <DeviceHubIcon />
                {data.name}
              </Typography>
              <Chip 
                icon={<WifiIcon />}
                label="Connected"
                className={classes.connectionChip}
                size="small"
              />
            </Box>

            {/* Switch Control */}
            <Box className={classes.switchContainer}>
              <Box className={classes.switchControl}>
                <Typography className={classes.switchLabel}>
                  <PowerSettingsNewIcon />
                  Switch Control
                </Typography>
                <Switch
                  name="controlOn"
                  checked={data.controlOn}
                  onChange={updateFormValue}
                  className={classes.statusSwitch}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Control Pin: {data.controlPin}
              </Typography>
            </Box>

            {/* Information Grid */}
            <Box className={classes.infoGrid}>
              <Box className={classes.infoItem}>
                <ScheduleIcon className={classes.infoIcon} />
                <Box>
                  <Typography className={classes.infoText}>Next Run</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.nextRunTime.substr(0, data.nextRunTime.lastIndexOf(' '))}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.infoItem}>
                <AccessTimeIcon className={classes.infoIcon} />
                <Box>
                  <Typography className={classes.infoText}>Last Update</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.lastStartedChangeTime.substr(0, data.lastStartedChangeTime.lastIndexOf(' '))}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.infoItem}>
                <DeviceHubIcon className={classes.infoIcon} />
                <Box>
                  <Typography className={classes.infoText}>Device IP</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.IPAddress}
                  </Typography>
                </Box>
              </Box>
              
              <Box className={classes.infoItem}>
                <AccessTimeIcon className={classes.infoIcon} />
                <Box>
                  <Typography className={classes.infoText}>Local Time</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Schedule Link */}
            {showLink && (
              <Box className={classes.scheduleLink}>
                <button 
                  className={classes.scheduleLinkButton}
                  onClick={onClick}
                >
                  <SettingsIcon fontSize="small" />
                  Configure Schedule
                </button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>
    );
  };

  return content();
};

export default ChannelStateWebSocketForm;
