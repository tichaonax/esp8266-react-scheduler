import React, { FC } from "react";

import { 
  Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Theme, useTheme,
  Card, CardContent, Box, Typography, Grid, Fade, useMediaQuery 
} from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReportIcon from '@mui/icons-material/Report';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import CloudIcon from '@mui/icons-material/Cloud';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ErrorIcon from '@mui/icons-material/Error';

import * as MqttApi from "../../api/mqtt";
import { MqttStatus, MqttDisconnectReason } from "../../types";
import { ButtonRow, FormLoader, SectionContent } from "../../components";
import { useRest } from "../../utils";

const useStyles = makeStyles((theme: any) => createStyles({
  mqttContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  mqttCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.3)'
      : '0 20px 40px rgba(0,0,0,0.1)',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  headerTitle: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  statusCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
  },
  actionCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(156, 39, 176, 0.2)'
      : 'none',
  },
}));

export const mqttStatusHighlight = ({ enabled, connected }: MqttStatus, theme: Theme) => {
  if (!enabled) {
    return theme.palette.info.main;
  }
  if (connected) {
    return theme.palette.success.main;
  }
  return theme.palette.error.main;
};

export const mqttStatus = ({ enabled, connected }: MqttStatus) => {
  if (!enabled) {
    return "Not enabled";
  }
  if (connected) {
    return "Connected";
  }
  return "Disconnected";
};

export const disconnectReason = ({ disconnect_reason }: MqttStatus) => {
  switch (disconnect_reason) {
    case MqttDisconnectReason.TCP_DISCONNECTED:
      return "TCP disconnected";
    case MqttDisconnectReason.MQTT_UNACCEPTABLE_PROTOCOL_VERSION:
      return "Unacceptable protocol version";
    case MqttDisconnectReason.MQTT_IDENTIFIER_REJECTED:
      return "Client ID rejected";
    case MqttDisconnectReason.MQTT_SERVER_UNAVAILABLE:
      return "Server unavailable";
    case MqttDisconnectReason.MQTT_MALFORMED_CREDENTIALS:
      return "Malformed credentials";
    case MqttDisconnectReason.MQTT_NOT_AUTHORIZED:
      return "Not authorized";
    case MqttDisconnectReason.ESP8266_NOT_ENOUGH_SPACE:
      return "Device out of memory";
    case MqttDisconnectReason.TLS_BAD_FINGERPRINT:
      return "Server fingerprint invalid";
    default:
      return "Unknown";
  }
};

const MqttStatusForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loadData, data, errorMessage } = useRest<MqttStatus>({ read: MqttApi.readMqttStatus });

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const renderConnectionStatus = () => {
      if (data.connected) {
        return (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#2196F3' }}>
                  <FingerprintIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Client ID" secondary={data.client_id} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        );
      }
      return (
        <>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#F44336' }}>
                <ErrorIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Disconnect Reason" secondary={disconnectReason(data)} />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      );
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.mqttContainer}>
          <Box className={classes.mqttCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <CloudIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                MQTT Status
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Real-time MQTT broker connection monitoring
              </Typography>
            </Box>

            {/* Status Information */}
            <Card className={classes.statusCard}>
              <CardContent>
                <List sx={{ padding: 0 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: mqttStatusHighlight(data, theme) }}>
                        <DeviceHubIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Connection Status" 
                      secondary={mqttStatus(data)}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: theme.palette.mode === 'dark' ? '#4caf50' : 'white',
                          fontWeight: 600
                        },
                        '& .MuiListItemText-secondary': {
                          color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                          fontSize: '1rem'
                        }
                      }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)' }} />
                  {data.enabled && (
                    <>
                      {renderConnectionStatus()}
                    </>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Action Section */}
            <Box className={classes.actionCard}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#9C27B0', mr: 2, width: 32, height: 32 }}>
                  <RefreshIcon fontSize="small" />
                </Avatar>
                Refresh Status
              </Typography>
              <Button 
                startIcon={<RefreshIcon />} 
                variant="contained" 
                onClick={loadData}
                sx={{
                  background: 'linear-gradient(45deg, #9C27B0 30%, #7B1FA2 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(156, 39, 176, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7B1FA2 30%, #6A1B9A 90%)',
                    boxShadow: '0 12px 20px rgba(156, 39, 176, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Refresh MQTT Status
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();

};

export default MqttStatusForm;
