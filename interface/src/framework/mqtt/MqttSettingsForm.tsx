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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  mqttCard: {
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
  sectionCard: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    '& .MuiTypography-root': {
      color: 'white',
    },
    '& .MuiFormControlLabel-root': {
      color: 'white',
    },
  },
  connectionSection: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: 'white',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.7)',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.8)',
      },
      '& .MuiOutlinedInput-input': {
        color: 'white',
      },
    },
  },
  authSection: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: 'white',
    '& .MuiTextField-root': {
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.7)',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.8)',
      },
      '& .MuiOutlinedInput-input': {
        color: 'white',
      },
    },
  },
  advancedSection: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  }
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
