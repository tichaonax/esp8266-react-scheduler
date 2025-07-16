import React, { FC } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  useTheme, 
  Fade,
  Divider
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';

import * as SystemApi from "../../api/system";
import { SingleUpload, useFileUpload } from '../../components';

const useStyles = makeStyles((theme: any) => createStyles({
  uploadContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  uploadCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.3)'
      : '0 20px 40px rgba(0,0,0,0.1)',
    padding: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : 'none',
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
  warningSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 152, 0, 0.3)'
      : '1px solid rgba(255, 152, 0, 0.2)',
  },
  uploadSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.3)'
      : '1px solid rgba(33, 150, 243, 0.2)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  infoIcon: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(2),
  },
  infoText: {
    color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
    fontWeight: 500,
  },
}));

const UploadFirmwareForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [uploadFile, cancelUpload, uploading, uploadProgress] = useFileUpload({ upload: SystemApi.uploadFirmware });

  return (
    <Fade in timeout={600}>
      <Box className={classes.uploadContainer}>
        <Box className={classes.uploadCard}>
          {/* Header Section */}
          <Box className={classes.headerSection}>
            <Typography variant="h4" className={classes.headerTitle}>
              <SystemUpdateIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
              Firmware Upload
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(102, 126, 234, 0.8)' }}>
              Update your device firmware safely and securely
            </Typography>
          </Box>

          {/* Warning Section */}
          <Box className={classes.warningSection}>
            <Box className={classes.infoItem}>
              <Avatar sx={{ bgcolor: '#ff9800' }} className={classes.infoIcon}>
                <WarningIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" className={classes.infoText}>
                  Important Warning
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.8)' : 'rgba(245, 124, 0, 0.8)' }}>
                  Upload a new firmware (.bin) file below to replace the existing firmware. This process will restart your device.
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.3)' }} />
            
            <Box className={classes.infoItem}>
              <Avatar sx={{ bgcolor: '#f44336' }} className={classes.infoIcon}>
                <SecurityIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" className={classes.infoText}>
                  Security Notice
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.8)' : 'rgba(245, 124, 0, 0.8)' }}>
                  Only upload firmware files from trusted sources. Incorrect firmware can damage your device.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Upload Section */}
          <Box className={classes.uploadSection}>
            <Box className={classes.infoItem} sx={{ mb: 3 }}>
              <Avatar sx={{ bgcolor: '#2196F3' }} className={classes.infoIcon}>
                <CloudUploadIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#64b5f6' : '#1976d2', fontWeight: 600 }}>
                  Select Firmware File
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(100, 181, 246, 0.8)' : 'rgba(25, 118, 210, 0.8)' }}>
                  Choose a .bin file to upload to your device
                </Typography>
              </Box>
            </Box>
            
            <SingleUpload
              accept="application/octet-stream"
              onDrop={uploadFile}
              onCancel={cancelUpload}
              uploading={uploading}
              progress={uploadProgress}
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );

};

export default UploadFirmwareForm;
