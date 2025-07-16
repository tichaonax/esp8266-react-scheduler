import React, { FC, useContext, useState } from 'react';
import { ValidateFieldsError } from 'async-validator';

import { 
  Button, Card, CardContent, Box, Typography, 
  Avatar, useTheme, Fade 
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoIcon from '@mui/icons-material/Info';

import * as SecurityApi from "../../api/security";
import { SecuritySettings } from '../../types';
import { FormLoader, ValidatedPasswordField } from '../../components';
import { SECURITY_SETTINGS_VALIDATOR, validate } from '../../validators';
import { updateValue, useRest } from '../../utils';
import { AuthenticatedContext } from '../../contexts/authentication';

const useStyles = makeStyles((theme: any) => createStyles({
  securityContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  securityCard: {
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
      ? 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)'
      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  jwtCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(244, 67, 54, 0.2)'
      : 'none',
  },
  infoCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
    padding: theme.spacing(3),
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

const SecuritySettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<SecuritySettings>({ read: SecurityApi.readSecuritySettings, update: SecurityApi.updateSecuritySettings });

  const authenticatedContext = useContext(AuthenticatedContext);
  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(SECURITY_SETTINGS_VALIDATOR, data);
        await saveData();
        await authenticatedContext.refresh();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.securityContainer}>
          <Box className={classes.securityCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <SecurityIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                Security Settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Configure authentication and security parameters
              </Typography>
            </Box>

            {/* JWT Secret Configuration */}
            <Card className={classes.jwtCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#F44336', mr: 2 }}>
                    <VpnKeyIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#f44336' : 'white', fontWeight: 600 }}>
                    JWT Secret Token
                  </Typography>
                </Box>
                <ValidatedPasswordField
                  fieldErrors={fieldErrors}
                  name="jwt_secret"
                  label="JWT Secret Key"
                  fullWidth
                  variant="outlined"
                  value={data.jwt_secret}
                  onChange={updateFormValue}
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 2,
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Information Section */}
            <Box className={classes.infoCard}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#2196F3', mr: 2, mt: 0.5 }}>
                  <InfoIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white', fontWeight: 600, mb: 1 }}>
                    Important Security Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}>
                    The JWT secret is used to sign authentication tokens. Changing this value will immediately sign out all users and invalidate existing sessions. 
                    Use a strong, unique secret for maximum security.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Section */}
            <Box className={classes.actionCard}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#4CAF50', mr: 2, width: 32, height: 32 }}>
                  <SaveIcon fontSize="small" />
                </Avatar>
                Save Security Settings
              </Typography>
              <Button 
                startIcon={<SaveIcon />} 
                disabled={saving} 
                variant="contained" 
                type="submit" 
                onClick={validateAndSubmit}
                sx={{
                  background: 'linear-gradient(45deg, #F44336 30%, #D32F2F 90%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(244, 67, 54, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #D32F2F 30%, #C62828 90%)',
                    boxShadow: '0 12px 20px rgba(244, 67, 54, 0.4)',
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
                {saving ? 'Saving...' : 'Update Security Settings'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();
};

export default SecuritySettingsForm;
