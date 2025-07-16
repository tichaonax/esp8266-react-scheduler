import React, { FC, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';

import { 
  Button, 
  Checkbox, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Fade, 
  useTheme, 
  useMediaQuery, 
  Divider, 
  Switch 
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import RouterIcon from '@mui/icons-material/Router';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import TuneIcon from '@mui/icons-material/Tune';

import * as MqttApi from "../../api/mqtt";
import { MqttSettings } from '../../types';
import { BlockFormControlLabel, ButtonRow, FormLoader, SectionContent, ValidatedPasswordField, ValidatedTextField } from '../../components';
import { MQTT_SETTINGS_VALIDATOR, validate } from '../../validators';
import { numberValue, updateValue, useRest } from '../../utils';

const useStyles = makeStyles((theme: any) => createStyles({
  mqttContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  mqttCard: {
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
      ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
      : 'linear-gradient(45deg, #ecf0f1 30%, #bdc3c7 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  sectionCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(44, 62, 80, 0.8) 100%)',
    color: theme.palette.mode === 'dark' ? '#ff9800' : 'white',
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 152, 0, 0.2)'
      : 'none',
    '& .MuiTypography-root': {
      color: theme.palette.mode === 'dark' ? '#ff9800' : 'white',
    },
    '& .MuiFormControlLabel-root': {
      color: theme.palette.mode === 'dark' ? '#ff9800' : 'white',
    },
  },
  connectionSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.7) 0%, rgba(44, 62, 80, 0.7) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.1)',
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
            ? 'rgba(100, 181, 246, 0.7)'
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
    },
  },
  authSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.6) 0%, rgba(44, 62, 80, 0.6) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: theme.palette.mode === 'dark' ? '#ce93d8' : 'white',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(156, 39, 176, 0.2)'
      : 'none',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.1)',
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
            ? 'rgba(206, 147, 216, 0.7)'
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
    },
  },
  advancedSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.5) 0%, rgba(44, 62, 80, 0.5) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: theme.palette.mode === 'dark' ? '#81c784' : 'white',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.1)',
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
            ? 'rgba(129, 199, 132, 0.7)'
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
    },
  },
}));

const MqttSettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<MqttSettings>({ read: MqttApi.readMqttSettings, update: MqttApi.updateMqttSettings });

  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(MQTT_SETTINGS_VALIDATOR, data);
        saveData();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.mqttContainer}>
          <Box className={classes.mqttCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <SettingsIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                MQTT Configuration
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure MQTT messaging for your IoT device
              </Typography>
            </Box>

            {/* Enable MQTT Section */}
            <Card className={classes.sectionCard} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <RouterIcon sx={{ mr: 1 }} />
                  MQTT Service
                </Typography>
                <BlockFormControlLabel
                  control={
                    <Switch
                      name="enabled"
                      checked={data.enabled}
                      onChange={updateFormValue}
                      color="secondary"
                    />
                  }
                  label="Enable MQTT Communication"
                />
              </CardContent>
            </Card>

            {/* Connection Settings */}
            <Box className={classes.connectionSection}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <RouterIcon sx={{ mr: 1 }} />
                Connection Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <ValidatedTextField
                    fieldErrors={fieldErrors}
                    name="host"
                    label="MQTT Broker Host"
                    fullWidth
                    variant="outlined"
                    value={data.host}
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ValidatedTextField
                    fieldErrors={fieldErrors}
                    name="port"
                    label="Port"
                    fullWidth
                    variant="outlined"
                    value={numberValue(data.port)}
                    type="number"
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ValidatedTextField
                    name="client_id"
                    label="Client ID (leave empty for auto-generated)"
                    fullWidth
                    variant="outlined"
                    value={data.client_id}
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Authentication */}
            <Box className={classes.authSection}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                Authentication
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ValidatedTextField
                    name="username"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    value={data.username}
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ValidatedPasswordField
                    name="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    value={data.password}
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Advanced Settings */}
            <Box className={classes.advancedSection}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TuneIcon sx={{ mr: 1 }} />
                Advanced Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <ValidatedTextField
                    fieldErrors={fieldErrors}
                    name="keep_alive"
                    label="Keep Alive Interval (seconds)"
                    fullWidth
                    variant="outlined"
                    value={numberValue(data.keep_alive)}
                    type="number"
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ValidatedTextField
                    fieldErrors={fieldErrors}
                    name="max_topic_length"
                    label="Max Topic Length"
                    fullWidth
                    variant="outlined"
                    value={numberValue(data.max_topic_length)}
                    type="number"
                    onChange={updateFormValue}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <BlockFormControlLabel
                    control={
                      <Checkbox
                        name="clean_session"
                        checked={data.clean_session}
                        onChange={updateFormValue}
                        color="primary"
                      />
                    }
                    label="Clean Session (start fresh on each connection)"
                  />
                </Grid>
              </Grid>
            </Box>

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
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
                    : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                  color: 'white',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(255, 152, 0, 0.3)'
                    : '0 8px 16px rgba(52, 73, 94, 0.3)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)'
                      : 'linear-gradient(45deg, #2c3e50 30%, #1a252f 90%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 20px rgba(255, 152, 0, 0.4)'
                      : '0 12px 20px rgba(52, 73, 94, 0.4)',
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
                {saving ? 'Saving Configuration...' : 'Save MQTT Settings'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();
};

export default MqttSettingsForm;
