import React, { FC, useContext, useEffect, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';

import { 
  Avatar, 
  Button, 
  Checkbox, 
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
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingsIcon from '@mui/icons-material/Settings';

import * as WiFiApi from "../../api/wifi";
import { WiFiSettings } from '../../types';
import { BlockFormControlLabel, ButtonRow, FormLoader, SectionContent, ValidatedPasswordField, ValidatedTextField } from '../../components';
import { validate, createWiFiSettingsValidator } from '../../validators';
import { updateValue, useRest } from '../../utils';

import { isNetworkOpen, networkSecurityMode } from './WiFiNetworkSelector';
import { WiFiConnectionContext } from './WiFiConnectionContext';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => createStyles({
  wifiContainer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  wifiCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
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
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  networkCard: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    marginBottom: theme.spacing(3),
    '& .MuiListItemText-primary': {
      color: 'white',
      fontWeight: 600,
    },
    '& .MuiListItemText-secondary': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiAvatar-root': {
      background: 'rgba(255, 255, 255, 0.2)',
    },
  },
  formSection: {
    marginBottom: theme.spacing(3),
  },
  staticIpSection: {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
}));

const WiFiSettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

            {/* Network Selection or Manual SSID */}
            <Box className={classes.formSection}>
              {selectedNetwork ? (
                <Card className={classes.networkCard}>
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
                </Card>
              ) : (
                <ValidatedTextField
                  fieldErrors={fieldErrors}
                  name="ssid"
                  label="Network Name (SSID)"
                  fullWidth
                  variant="outlined"
                  value={data.ssid}
                  onChange={updateFormValue}
                  margin="normal"
                />
              )}
            </Box>

            {/* Password Field */}
            {(!selectedNetwork || !isNetworkOpen(selectedNetwork)) && (
              <Box className={classes.formSection}>
                <ValidatedPasswordField
                  fieldErrors={fieldErrors}
                  name="password"
                  label="Network Password"
                  fullWidth
                  variant="outlined"
                  value={data.password}
                  onChange={updateFormValue}
                  margin="normal"
                />
              </Box>
            )}

            {/* Basic Settings */}
            <Box className={classes.formSection}>
              <ValidatedTextField
                fieldErrors={fieldErrors}
                name="hostname"
                label="Device Hostname"
                fullWidth
                variant="outlined"
                value={data.hostname}
                onChange={updateFormValue}
                margin="normal"
              />
              <BlockFormControlLabel
                control={
                  <Checkbox
                    name="static_ip_config"
                    checked={data.static_ip_config}
                    onChange={updateFormValue}
                  />
                }
                label="Enable Static IP Configuration"
              />
            </Box>

            {/* Static IP Configuration */}
            {data.static_ip_config && (
              <Box className={classes.staticIpSection}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <NetworkCheckIcon sx={{ mr: 1 }} />
                  Static IP Configuration
                </Typography>
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
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Save Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                size="large"
                color="primary" 
                type="submit" 
                onClick={validateAndSubmit}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  }
                }}
              >
                {saving ? 'Saving...' : 'Save Configuration'}
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
