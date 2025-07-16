import React, { FC, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';

import { 
  Button, MenuItem, Card, CardContent, Box, Typography, 
  Avatar, useTheme, Fade, Switch 
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DnsIcon from '@mui/icons-material/Dns';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';

import * as NTPApi from "../../api/ntp";
import { NTPSettings } from '../../types';
import { BlockFormControlLabel, FormLoader, ValidatedTextField } from '../../components';
import { validate, NTP_SETTINGS_VALIDATOR } from '../../validators';
import { updateValue, useRest } from '../../utils';

import { selectedTimeZone, timeZoneSelectItems, TIME_ZONES } from './TZ';

const useStyles = makeStyles((theme: any) => createStyles({
  ntpContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  ntpCard: {
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
      ? 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)'
      : 'linear-gradient(45deg, #ecf0f1 30%, #bdc3c7 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  enableSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(44, 62, 80, 0.8) 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
  },
  serverSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.7) 0%, rgba(44, 62, 80, 0.7) 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
  timezoneSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.6) 0%, rgba(44, 62, 80, 0.6) 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(156, 39, 176, 0.2)'
      : 'none',
  },
  actionCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.5) 0%, rgba(44, 62, 80, 0.5) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 152, 0, 0.2)'
      : 'none',
  },
}));

const NTPSettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<NTPSettings>({ read: NTPApi.readNTPSettings, update: NTPApi.updateNTPSettings });

  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(NTP_SETTINGS_VALIDATOR, data);
        saveData();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    const changeTimeZone = (event: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        tz_label: event.target.value,
        tz_format: TIME_ZONES[event.target.value]
      });
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.ntpContainer}>
          <Box className={classes.ntpCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <ScheduleIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                NTP Time Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure network time synchronization and timezone settings
              </Typography>
            </Box>

            {/* Enable NTP Section */}
            <Card className={classes.enableSection}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#4CAF50', mr: 2 }}>
                    <SettingsIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#4caf50' : 'white', fontWeight: 600 }}>
                    NTP Synchronization
                  </Typography>
                </Box>
                <BlockFormControlLabel
                  control={
                    <Switch
                      name="enabled"
                      checked={data.enabled}
                      onChange={updateFormValue}
                      color="primary"
                    />
                  }
                  label="Enable automatic time synchronization via NTP"
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#4caf50' : 'white',
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* NTP Server Section */}
            <Card className={classes.serverSection}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#2196F3', mr: 2 }}>
                    <DnsIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white', fontWeight: 600 }}>
                    NTP Server Configuration
                  </Typography>
                </Box>
                <ValidatedTextField
                  fieldErrors={fieldErrors}
                  name="server"
                  label="NTP Server Address"
                  fullWidth
                  variant="outlined"
                  value={data.server}
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

            {/* Timezone Section */}
            <Card className={classes.timezoneSection}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#9C27B0', mr: 2 }}>
                    <PublicIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ce93d8' : 'white', fontWeight: 600 }}>
                    Timezone Configuration
                  </Typography>
                </Box>
                <ValidatedTextField
                  fieldErrors={fieldErrors}
                  name="tz_label"
                  label="Local Timezone"
                  fullWidth
                  variant="outlined"
                  value={selectedTimeZone(data.tz_label, data.tz_format)}
                  onChange={changeTimeZone}
                  margin="normal"
                  select
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
                >
                  <MenuItem disabled>Select your timezone...</MenuItem>
                  {timeZoneSelectItems()}
                </ValidatedTextField>
              </CardContent>
            </Card>

            {/* Action Section */}
            <Box className={classes.actionCard}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white' }}>
                <Avatar sx={{ bgcolor: '#FF9800', mr: 2, width: 32, height: 32 }}>
                  <SaveIcon fontSize="small" />
                </Avatar>
                Save NTP Configuration
              </Typography>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                type="submit" 
                onClick={validateAndSubmit}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)'
                    : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(76, 175, 80, 0.3)'
                    : '0 8px 16px rgba(44, 62, 80, 0.3)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)'
                      : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 20px rgba(76, 175, 80, 0.4)'
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
                {saving ? 'Saving Settings...' : 'Save NTP Settings'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();

};

export default NTPSettingsForm;
