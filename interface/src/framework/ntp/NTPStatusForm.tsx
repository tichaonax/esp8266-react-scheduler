import React, { FC, useContext, useState } from "react";
import { useSnackbar } from "notistack";

import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Theme, useTheme,
  Card, CardContent, Typography, Fade
} from "@mui/material";
import { makeStyles, createStyles } from '@mui/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import DnsIcon from '@mui/icons-material/Dns';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PublicIcon from '@mui/icons-material/Public';

import * as NTPApi from "../../api/ntp";
import { NTPStatus, NTPSyncStatus } from "../../types";
import { FormLoader } from "../../components";
import { extractErrorMessage, formatDateTime, formatDuration, formatLocalDateTime, useRest } from "../../utils";
import { AuthenticatedContext } from "../../contexts/authentication";

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
  statusCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(52, 73, 94, 0.8) 0%, rgba(44, 62, 80, 0.8) 100%)',
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : 'none',
  },
  actionCard: {
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

export const isNtpActive = ({ status }: NTPStatus) => status === NTPSyncStatus.NTP_ACTIVE;

export const ntpStatusHighlight = ({ status }: NTPStatus, theme: Theme) => {
  switch (status) {
    case NTPSyncStatus.NTP_INACTIVE:
      return theme.palette.info.main;
    case NTPSyncStatus.NTP_ACTIVE:
      return theme.palette.success.main;
    default:
      return theme.palette.error.main;
  }
};

export const ntpStatus = ({ status }: NTPStatus) => {
  switch (status) {
    case NTPSyncStatus.NTP_INACTIVE:
      return "Inactive";
    case NTPSyncStatus.NTP_ACTIVE:
      return "Active";
    default:
      return "Unknown";
  }
};

const NTPStatusForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { loadData, data, errorMessage } = useRest<NTPStatus>({ read: NTPApi.readNTPStatus });
  const [localTime, setLocalTime] = useState<string>('');
  const [settingTime, setSettingTime] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { me } = useContext(AuthenticatedContext);

  const updateLocalTime = (event: React.ChangeEvent<HTMLInputElement>) => setLocalTime(event.target.value);

  const openSetTime = () => {
    setLocalTime(formatLocalDateTime(new Date()));
    setSettingTime(true);
  };

  const configureTime = async () => {
    setProcessing(true);
    try {
      await NTPApi.updateTime({
        local_time: formatLocalDateTime(new Date(localTime))
      });
      enqueueSnackbar("Time set successfully", { variant: 'success' });
      setSettingTime(false);
      loadData();
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Problem updating time'), { variant: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const renderSetTimeDialog = () => {
    return (
      <Dialog
        open={settingTime}
        onClose={() => setSettingTime(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)'
            : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          pb: 2
        }}>
          <AccessTimeIcon sx={{ mr: 1, fontSize: 'inherit', color: theme.palette.mode === 'dark' ? '#4caf50' : '#2c3e50' }} />
          Manual Time Configuration
        </DialogTitle>
        <DialogContent dividers sx={{ 
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          py: 3
        }}>
          <Typography variant="body2" sx={{ 
            mb: 3, 
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            fontWeight: 500
          }}>
            Set the device's local time manually. This will override NTP synchronization temporarily.
          </Typography>
          <TextField
            label="Local Date & Time"
            type="datetime-local"
            value={localTime}
            onChange={updateLocalTime}
            disabled={processing}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(76, 175, 80, 0.3)'
                    : 'rgba(44, 62, 80, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(76, 175, 80, 0.5)'
                    : 'rgba(44, 62, 80, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? '#4caf50'
                    : '#2c3e50',
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'dark'
                  ? 'rgba(76, 175, 80, 0.8)'
                  : 'rgba(44, 62, 80, 0.8)',
                fontWeight: 500,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setSettingTime(false)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            startIcon={<AccessTimeIcon />}
            variant="contained"
            onClick={configureTime}
            disabled={processing}
            autoFocus
            sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)'
                : 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
              borderRadius: 2,
              px: 3,
              py: 1,
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
            {processing ? 'Setting Time...' : 'Set Device Time'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    return (
      <Fade in timeout={600}>
        <Box className={classes.ntpContainer}>
          <Box className={classes.ntpCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <ScheduleIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                NTP Time Status
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Network time synchronization and device clock information
              </Typography>
            </Box>

            {/* Status Information */}
            <Card className={classes.statusCard}>
              <CardContent>
                <List sx={{ padding: 0 }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: ntpStatusHighlight(data, theme) }}>
                        <UpdateIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="NTP Status" 
                      secondary={ntpStatus(data)}
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
                  {isNtpActive(data) && (
                    <>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#9C27B0' }}>
                            <DnsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary="NTP Server" 
                          secondary={data.server}
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
                    </>
                  )}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#4CAF50' }}>
                        <AccessTimeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Local Time" 
                      secondary={formatDateTime(data.local_time)}
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
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#2196F3' }}>
                        <PublicIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="UTC Time" 
                      secondary={formatDateTime(data.utc_time)}
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
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#FF9800' }}>
                        <AvTimerIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Device Uptime" 
                      secondary={formatDuration(data.uptime)}
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
                </List>
              </CardContent>
            </Card>

            {/* Action Section */}
            <Box className={classes.actionCard}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white' }}>
                <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                  <AccessTimeIcon fontSize="small" />
                </Avatar>
                Time Management
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button 
                  startIcon={<RefreshIcon />} 
                  variant="contained" 
                  onClick={loadData}
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #4caf50 30%, #388e3c 90%)'
                      : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'white',
                    textTransform: 'none',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 16px rgba(76, 175, 80, 0.3)'
                      : '0 8px 16px rgba(52, 73, 94, 0.3)',
                    '&:hover': {
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)'
                        : 'linear-gradient(45deg, #2c3e50 30%, #1a252f 90%)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 12px 20px rgba(76, 175, 80, 0.4)'
                        : '0 12px 20px rgba(52, 73, 94, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Refresh Status
                </Button>
                {
                  me.admin && (
                    <Button 
                      onClick={openSetTime} 
                      variant="contained" 
                      startIcon={<AccessTimeIcon />}
                      sx={{
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)'
                          : 'linear-gradient(45deg, #34495e 30%, #2c3e50 90%)',
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'white',
                        textTransform: 'none',
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
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      Manual Set Time
                    </Button>
                  )
                }
              </Box>
            </Box>
            {renderSetTimeDialog()}
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();

};

export default NTPStatusForm;
