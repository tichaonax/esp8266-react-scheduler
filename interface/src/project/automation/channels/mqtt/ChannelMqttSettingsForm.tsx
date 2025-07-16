import React, { FC, useCallback, useState } from "react";
import { ValidateFieldsError } from "async-validator";

import { 
  Button, Card, CardContent, Box, Typography, 
  Avatar, useTheme, Fade, Grid 
} from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LabelIcon from '@mui/icons-material/Label';
import TopicIcon from '@mui/icons-material/Topic';
import CloudIcon from '@mui/icons-material/Cloud';

import { FormLoader, ValidatedTextField } from "../../../../components";
import { validate } from "../../../../validators";
import { useRest, updateValue } from "../../../../utils";

import * as Api from '../../api/channelApi';

import { ChannelMqttSettings } from "../../redux/types/mqtt";
import { CHANNEL_MQTT_SETTINGS_VALIDATOR } from "../validators";
import { ChannelMqttSettingsFormProps } from "./mqtt";
import { RemoteUtils } from "../../utils/remoteUtils";

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
  configSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(44, 62, 80, 0.8) 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 152, 0, 0.2)'
      : 'none',
  },
  actionSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.6) 0%, rgba(44, 62, 80, 0.6) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
}));

const ChannelMqttSettingsForm: FC<ChannelMqttSettingsFormProps> = ({ channelId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();

  const read = useCallback(
    () => Api.createReadChannelBrokerSettingsApi(channelId)
    ,[channelId]
  );

  const update = useCallback(
    (channelMqttSettings: ChannelMqttSettings) => Api.createUpdateChannelBrokerSettingsApi(channelId, channelMqttSettings)
    ,[channelId]
  );

  const {
    loadData, saveData, saving, setData, data, errorMessage
  } = useRest<ChannelMqttSettings>({read, update});

  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    if(!data.unique_id && RemoteUtils.isRemoteDevice()){
      const networkErrorMessage = `Remote device ${RemoteUtils.getRemoteDeviceUrl()} unreachable`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    if(!data.unique_id){
      const networkErrorMessage = `Requested ${RemoteUtils.getLastPathItem(window.location.pathname)} is not configured`;
      return (<FormLoader onRetry={loadData} errorMessage={networkErrorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(CHANNEL_MQTT_SETTINGS_VALIDATOR, data);
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
                <CloudIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                Channel {channelId} MQTT Configuration
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure MQTT messaging settings for this automation channel
              </Typography>
            </Box>

            {/* MQTT Configuration Section */}
            <Card className={classes.configSection}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#FF9800', mr: 2 }}>
                    <DeveloperBoardIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white', fontWeight: 600 }}>
                    MQTT Channel Settings
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                        <FingerprintIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white', fontWeight: 500 }}>
                        Device Identity
                      </Typography>
                    </Box>
                    <ValidatedTextField
                      fieldErrors={fieldErrors}
                      name="unique_id"
                      label="Unique Identifier"
                      fullWidth
                      variant="outlined"
                      value={data.unique_id}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#4CAF50', mr: 2, width: 32, height: 32 }}>
                        <LabelIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white', fontWeight: 500 }}>
                        Display Name
                      </Typography>
                    </Box>
                    <ValidatedTextField
                      fieldErrors={fieldErrors}
                      name="name"
                      label="Channel Name"
                      fullWidth
                      variant="outlined"
                      value={data.name}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#9C27B0', mr: 2, width: 32, height: 32 }}>
                        <TopicIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? '#ffb74d' : 'white', fontWeight: 500 }}>
                        Message Topic
                      </Typography>
                    </Box>
                    <ValidatedTextField
                      fieldErrors={fieldErrors}
                      name="mqtt_path"
                      label="MQTT Topic Path"
                      fullWidth
                      variant="outlined"
                      value={data.mqtt_path}
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

            {/* Action Section */}
            <Box className={classes.actionSection}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white' }}>
                <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                  <SaveIcon fontSize="small" />
                </Avatar>
                Save MQTT Configuration
              </Typography>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                type="submit" 
                onClick={validateAndSubmit}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
                    : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 16px rgba(255, 152, 0, 0.3)'
                    : '0 8px 16px rgba(44, 62, 80, 0.3)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)'
                      : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 12px 20px rgba(255, 152, 0, 0.4)'
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

export default ChannelMqttSettingsForm;
