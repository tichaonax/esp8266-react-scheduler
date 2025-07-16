import React, { FC, useContext, useEffect, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';

import { 
  Avatar, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemSecondaryAction, 
  ListItemText,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Fade,
  useTheme
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import IpIcon from '@mui/icons-material/LocationOn';
import Switch from '@mui/material/Switch';

import * as WiFiApi from "../../api/wifi";
import { WiFiSettings } from '../../types';
import { BlockFormControlLabel, FormLoader, ValidatedPasswordField, ValidatedTextField } from '../../components';
import { validate, createWiFiSettingsValidator } from '../../validators';
import { updateValue, useRest } from '../../utils';

import { isNetworkOpen, networkSecurityMode } from './WiFiNetworkSelector';
import { WiFiConnectionContext } from './WiFiConnectionContext';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => createStyles({
  wifiContainer: {
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  wifiCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.3)'
      : '0 20px 40px rgba(0,0,0,0.2)',
    padding: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)',
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
      ? 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)'
      : 'linear-gradient(45deg, #ecf0f1 30%, #bdc3c7 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  networkCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(44, 62, 80, 0.8) 100%)',
    color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
    '& .MuiListItemText-primary': {
      color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
      fontWeight: 600,
    },
    '& .MuiListItemText-secondary': {
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiAvatar-root': {
      background: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    },
  },
  credentialsSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.7) 0%, rgba(44, 62, 80, 0.7) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(156, 39, 176, 0.2)'
      : 'none',
  },
  basicSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.6) 0%, rgba(44, 62, 80, 0.6) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
  },
  staticIpSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.5) 0%, rgba(44, 62, 80, 0.5) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 152, 0, 0.2)'
      : 'none',
  },
  actionSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.4) 0%, rgba(44, 62, 80, 0.4) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
}));

const WiFiSettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { selectedNetwork, deselectNetwork } = useContext(WiFiConnectionContext);

  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const [initialized, setInitialized] = useState(false);
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<WiFiSettings>({ read: WiFiApi.readWiFiSettings, update: WiFiApi.updateWiFiSettings });

  useEffect(() => {
    if (!initialized && data) {
      if (selectedNetwork) {
        setData({
          ssid: selectedNetwork.ssid,
          password: "",
          hostname: data?.hostname,
          static_ip_config: false,
        });
      }
      setInitialized(true);
    }
  }, [initialized, setInitialized, data, setData, selectedNetwork]);

  const updateFormValue = updateValue(setData);

  useEffect(() => deselectNetwork, [deselectNetwork]);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(createWiFiSettingsValidator(data), data);
        saveData();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.wifiContainer}>
          <Box className={classes.wifiCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <WifiIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                WiFi Configuration
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure your device's network connection
              </Typography>
            </Box>

            {/* Network Selection */}
            {selectedNetwork ? (
              <Card className={classes.networkCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', mr: 2 }}>
                      <WifiIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white', fontWeight: 600 }}>
                      Selected Network
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          {isNetworkOpen(selectedNetwork) ? <LockOpenIcon /> : <LockIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={selectedNetwork.ssid}
                        secondary={"Security: " + networkSecurityMode(selectedNetwork) + ", Ch: " + selectedNetwork.channel}
                      />
                      <ListItemSecondaryAction>
                        <IconButton aria-label="Manual Config" onClick={deselectNetwork}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            ) : (
              <Card className={classes.networkCard}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.2)', mr: 2 }}>
                      <WifiIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white', fontWeight: 600 }}>
                      Network Configuration
                    </Typography>
                  </Box>
                  <ValidatedTextField
                    fieldErrors={fieldErrors}
                    name="ssid"
                    label="Network Name (SSID)"
                    fullWidth
                    variant="outlined"
                    value={data.ssid}
                    onChange={updateFormValue}
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(100, 181, 246, 0.3)'
                            : 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(100, 181, 246, 0.5)'
                            : 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? '#64b5f6'
                            : 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === 'dark'
                          ? 'rgba(100, 181, 246, 0.8)'
                          : 'rgba(255, 255, 255, 0.8)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Network Credentials */}
            {(!selectedNetwork || !isNetworkOpen(selectedNetwork)) && (
              <Card className={classes.credentialsSection}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#9C27B0', mr: 2 }}>
                      <VpnKeyIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ce93d8' : 'white', fontWeight: 600 }}>
                      Network Security
                    </Typography>
                  </Box>
                  <ValidatedPasswordField
                    fieldErrors={fieldErrors}
                    name="password"
                    label="Network Password"
                    fullWidth
                    variant="outlined"
                    value={data.password}
                    onChange={updateFormValue}
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(206, 147, 216, 0.3)'
                            : 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(206, 147, 216, 0.5)'
                            : 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.mode === 'dark'
                            ? '#ce93d8'
                            : 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.mode === 'dark'
                          ? 'rgba(206, 147, 216, 0.8)'
                          : 'rgba(255, 255, 255, 0.8)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: theme.palette.mode === 'dark' ? '#ce93d8' : 'white',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Device Settings */}
            <Card className={classes.basicSection}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                    <DeviceHubIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#81c784' : 'white', fontWeight: 600 }}>
                    Device Configuration
                  </Typography>
                </Box>
                <ValidatedTextField
                  fieldErrors={fieldErrors}
                  name="hostname"
                  label="Device Hostname"
                  fullWidth
                  variant="outlined"
                  value={data.hostname}
                  onChange={updateFormValue}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? 'rgba(129, 199, 132, 0.3)'
                          : 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? 'rgba(129, 199, 132, 0.5)'
                          : 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.mode === 'dark'
                          ? '#81c784'
                          : 'rgba(255, 255, 255, 0.7)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark'
                        ? 'rgba(129, 199, 132, 0.8)'
                        : 'rgba(255, 255, 255, 0.8)',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.palette.mode === 'dark' ? '#81c784' : 'white',
                    },
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <BlockFormControlLabel
                    control={
                      <Switch
                        name="static_ip_config"
                        checked={data.static_ip_config}
                        onChange={updateFormValue}
                        color="primary"
                      />
                    }
                    label="Enable Static IP Configuration"
                    sx={{ 
                      color: theme.palette.mode === 'dark' ? '#81c784' : 'white',
                      '& .MuiFormControlLabel-label': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Static IP Configuration */}
            {data.static_ip_config && (
              <Card className={classes.staticIpSection}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                      <IpIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white', fontWeight: 600 }}>
                      Static IP Configuration
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ValidatedTextField
                        fieldErrors={fieldErrors}
                        name="local_ip"
                        label="Local IP Address"
                        fullWidth
                        variant="outlined"
                        value={data.local_ip}
                        onChange={updateFormValue}
                        margin="normal"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? '#ffb74d'
                                : 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 183, 77, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ValidatedTextField
                        fieldErrors={fieldErrors}
                        name="gateway_ip"
                        label="Gateway IP"
                        fullWidth
                        variant="outlined"
                        value={data.gateway_ip}
                        onChange={updateFormValue}
                        margin="normal"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? '#ffb74d'
                                : 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 183, 77, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ValidatedTextField
                        fieldErrors={fieldErrors}
                        name="subnet_mask"
                        label="Subnet Mask"
                        fullWidth
                        variant="outlined"
                        value={data.subnet_mask}
                        onChange={updateFormValue}
                        margin="normal"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? '#ffb74d'
                                : 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 183, 77, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ValidatedTextField
                        fieldErrors={fieldErrors}
                        name="dns_ip_1"
                        label="Primary DNS"
                        fullWidth
                        variant="outlined"
                        value={data.dns_ip_1}
                        onChange={updateFormValue}
                        margin="normal"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? '#ffb74d'
                                : 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 183, 77, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ValidatedTextField
                        fieldErrors={fieldErrors}
                        name="dns_ip_2"
                        label="Secondary DNS (Optional)"
                        fullWidth
                        variant="outlined"
                        value={data.dns_ip_2}
                        onChange={updateFormValue}
                        margin="normal"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)' 
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 183, 77, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.mode === 'dark'
                                ? '#ffb74d'
                                : 'rgba(255, 255, 255, 0.7)',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: theme.palette.mode === 'dark'
                              ? 'rgba(255, 183, 77, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <Box className={classes.actionSection}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white' }}>
                <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                  <SaveIcon fontSize="small" />
                </Avatar>
                Save WiFi Configuration
              </Typography>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                size="large"
                type="submit" 
                onClick={validateAndSubmit}
                sx={{ 
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)'
                    : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(33, 150, 243, 0.3)'
                    : '0 8px 16px rgba(44, 62, 80, 0.3)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)'
                      : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 20px rgba(33, 150, 243, 0.4)'
                      : '0 12px 20px rgba(44, 62, 80, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)',
                    color: 'white',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {saving ? 'Saving Configuration...' : 'Save WiFi Settings'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();
};

export default WiFiSettingsForm;
