import React, { FC, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';
import { range } from 'lodash';

import { 
  Button, Checkbox, MenuItem, Card, CardContent, Box, Typography, 
  Grid, Avatar, useTheme, useMediaQuery, Fade 
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import WifiIcon from '@mui/icons-material/Wifi';
import SecurityIcon from '@mui/icons-material/Security';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import IpIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';

import * as APApi from "../../api/ap";
import { APProvisionMode, APSettings } from '../../types';
import { BlockFormControlLabel, ButtonRow, FormLoader, SectionContent, ValidatedPasswordField, ValidatedTextField } from '../../components';
import { createAPSettingsValidator, validate } from '../../validators';
import { numberValue, updateValue, useRest } from '../../utils';

const useStyles = makeStyles((theme: any) => createStyles({
  apContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  apCard: {
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
      ? 'linear-gradient(45deg, #bb86fc 30%, #3700b3 90%)'
      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  settingsCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(187, 134, 252, 0.1) 0%, rgba(55, 0, 179, 0.1) 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(187, 134, 252, 0.2)'
      : 'none',
  },
  networkCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
  actionCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
  },
}));

export const isAPEnabled = ({ provision_mode }: APSettings) => {
  return provision_mode === APProvisionMode.AP_MODE_ALWAYS || provision_mode === APProvisionMode.AP_MODE_DISCONNECTED;
};

const APSettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<APSettings>({ read: APApi.readAPSettings, update: APApi.updateAPSettings });

  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(createAPSettingsValidator(data), data);
        saveData();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.apContainer}>
          <Box className={classes.apCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <SettingsInputAntennaIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                Access Point Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure WiFi hotspot and network settings
              </Typography>
            </Box>

            {/* Main Settings Section */}
            <Card className={classes.settingsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#9C27B0', mr: 2 }}>
                    <WifiIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#bb86fc' : 'white', fontWeight: 600 }}>
                    Access Point Mode
                  </Typography>
                </Box>
                <ValidatedTextField
                  fieldErrors={fieldErrors}
                  name="provision_mode"
                  label="Provide Access Point"
                  value={data.provision_mode}
                  fullWidth
                  select
                  variant="outlined"
                  onChange={updateFormValue}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value={APProvisionMode.AP_MODE_ALWAYS}>Always</MenuItem>
                  <MenuItem value={APProvisionMode.AP_MODE_DISCONNECTED}>When WiFi Disconnected</MenuItem>
                  <MenuItem value={APProvisionMode.AP_NEVER}>Never</MenuItem>
                </ValidatedTextField>
              </CardContent>
            </Card>
            {
              isAPEnabled(data) &&
              <>
                {/* Network Configuration */}
                <Card className={classes.networkCard}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: '#2196F3', mr: 2 }}>
                        <NetworkWifiIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white', fontWeight: 600 }}>
                        Network Configuration
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <ValidatedTextField
                          fieldErrors={fieldErrors}
                          name="ssid"
                          label="Access Point SSID"
                          fullWidth
                          variant="outlined"
                          value={data.ssid}
                          onChange={updateFormValue}
                          margin="normal"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ValidatedPasswordField
                          fieldErrors={fieldErrors}
                          name="password"
                          label="Access Point Password"
                          fullWidth
                          variant="outlined"
                          value={data.password}
                          onChange={updateFormValue}
                          margin="normal"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ValidatedTextField
                          fieldErrors={fieldErrors}
                          name="channel"
                          label="WiFi Channel"
                          value={numberValue(data.channel)}
                          fullWidth
                          select
                          type="number"
                          variant="outlined"
                          onChange={updateFormValue}
                          margin="normal"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        >
                          {
                            range(1, 14).map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)
                          }
                        </ValidatedTextField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <ValidatedTextField
                          fieldErrors={fieldErrors}
                          name="max_clients"
                          label="Max Clients"
                          value={numberValue(data.max_clients)}
                          fullWidth
                          select
                          type="number"
                          variant="outlined"
                          onChange={updateFormValue}
                          margin="normal"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        >
                          {
                            range(1, 9).map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)
                          }
                        </ValidatedTextField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                            <VisibilityIcon />
                          </Avatar>
                          <BlockFormControlLabel
                            control={
                              <Checkbox
                                name="ssid_hidden"
                                checked={data.ssid_hidden}
                                onChange={updateFormValue}
                                sx={{ color: theme.palette.mode === 'dark' ? '#ff9800' : 'white' }}
                              />
                            }
                            label="Hide SSID"
                            sx={{ color: theme.palette.mode === 'dark' ? '#ff9800' : 'white', fontWeight: 600 }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* IP Configuration */}
                <Card className={classes.settingsCard}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                        <IpIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#bb86fc' : 'white', fontWeight: 600 }}>
                        IP Configuration
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
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
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </>
            }
            {/* Action Section */}
            <Box className={classes.actionCard}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#4CAF50', mr: 2, width: 32, height: 32 }}>
                  <SaveIcon fontSize="small" />
                </Avatar>
                Save Configuration
              </Typography>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                type="submit" 
                onClick={validateAndSubmit}
                sx={{
                  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049 30%, #388e3c 90%)',
                    boxShadow: '0 12px 20px rgba(76, 175, 80, 0.4)',
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
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();
};

export default APSettingsForm;
