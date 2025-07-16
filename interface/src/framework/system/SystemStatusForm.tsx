import React, { FC, useContext, useState } from "react";
import { useSnackbar } from "notistack";

import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  List, ListItem, ListItemAvatar, ListItemText, Typography, Card, CardContent, 
  Grid, Fade, useTheme, LinearProgress
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import DevicesIcon from '@mui/icons-material/Devices';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MemoryIcon from '@mui/icons-material/Memory';
import AppsIcon from '@mui/icons-material/Apps';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import FolderIcon from '@mui/icons-material/Folder';
import RefreshIcon from '@mui/icons-material/Refresh';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

import * as SystemApi from "../../api/system";
import { EspPlatform, SystemStatus } from "../../types";
import { FormLoader } from "../../components";
import { AutoRefreshWrapper } from "../../components/AutoRefreshWrapper";
import { extractErrorMessage, useRest } from "../../utils";
import { AuthenticatedContext } from "../../contexts/authentication";

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}

const useStyles = makeStyles((theme: any) => createStyles({
  systemContainer: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  systemCard: {
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
      ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  infoCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(240, 147, 251, 0.3)'
      : 'none',
    '& .MuiListItemText-primary': {
      color: theme.palette.mode === 'dark' ? '#f093fb' : 'white',
      fontWeight: 600,
    },
    '& .MuiListItemText-secondary': {
      color: theme.palette.mode === 'dark' ? '#81c784' : '#ffeb3b',
      fontWeight: 500,
    },
    '& .MuiAvatar-root': {
      background: theme.palette.mode === 'dark'
        ? 'rgba(240, 147, 251, 0.3)'
        : 'rgba(255, 255, 255, 0.2)',
    },
  },
  actionSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 236, 210, 0.1) 0%, rgba(252, 182, 159, 0.1) 100%)'
      : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 236, 210, 0.2)'
      : 'none',
    '& .MuiTypography-h6': {
      color: theme.palette.mode === 'dark' ? '#ffcc80' : '#5d4037',
    },
  },
}));

const SystemStatusForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    loadData, data, errorMessage
  } = useRest<SystemStatus>({ read: SystemApi.readSystemStatus });

  const { me } = useContext(AuthenticatedContext);
  const [confirmRestart, setConfirmRestart] = useState<boolean>(false);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const restart = async () => {
    setProcessing(true);
    try {
      await SystemApi.restart();
      enqueueSnackbar("Device is restarting", { variant: 'info' });
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Problem restarting device'), { variant: 'error' });
    } finally {
      setConfirmRestart(false);
      setProcessing(false);
    }
  };

  const renderRestartDialog = () => (
    <Dialog
      open={confirmRestart}
      onClose={() => setConfirmRestart(false)}
    >
      <DialogTitle>Confirm Restart</DialogTitle>
      <DialogContent dividers>
        Are you sure you want to restart the device?
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setConfirmRestart(false)} color="secondary">
          Cancel
        </Button>
        <Button
          startIcon={<PowerSettingsNewIcon />}
          variant="contained"
          onClick={restart}
          disabled={processing}
          color="primary"
          autoFocus
        >
          Restart
        </Button>
      </DialogActions>
    </Dialog>
  );

  const factoryReset = async () => {
    setProcessing(true);
    try {
      await SystemApi.factoryReset();
      enqueueSnackbar("Device has been factory reset and will now restart", { variant: 'info' });
    } catch (error: any) {
      enqueueSnackbar(extractErrorMessage(error, 'Problem factory resetting the device'), { variant: 'error' });
    } finally {
      setConfirmFactoryReset(false);
      setProcessing(false);
    }
  };

  const renderFactoryResetDialog = () => (
    <Dialog
      open={confirmFactoryReset}
      onClose={() => setConfirmFactoryReset(false)}
    >
      <DialogTitle>Confirm Factory Reset</DialogTitle>
      <DialogContent dividers>
        Are you sure you want to reset the device to its factory defaults?
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setConfirmFactoryReset(false)} color="secondary">
          Cancel
        </Button>
        <Button
          startIcon={<SettingsBackupRestoreIcon />}
          variant="contained"
          onClick={factoryReset}
          disabled={processing}
          autoFocus
          color="error"
        >
          Factory Reset
        </Button>
      </DialogActions>
    </Dialog>
  );

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const heapUsagePercent = ((data.max_alloc_heap - data.free_heap) / data.max_alloc_heap) * 100;
    const flashUsagePercent = ((data.sketch_size) / (data.sketch_size + data.free_sketch_space)) * 100;
    const fsUsagePercent = (data.fs_used / data.fs_total) * 100;

    return (
      <Fade in timeout={600}>
        <Box className={classes.systemContainer}>
          <Box className={classes.systemCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <DevicesIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                System Status
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(102, 126, 234, 0.8)' }}>
                Real-time system monitoring and device information
              </Typography>
            </Box>

            {/* System Information Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <DevicesIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary="Device Platform" 
                          secondary={data.esp_platform + ' / ' + data.sdk_version} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <ShowChartIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary="CPU Frequency" 
                          secondary={data.cpu_freq_mhz + ' MHz'} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <MemoryIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Heap Memory"
                          secondary={
                            formatNumber(data.free_heap) +
                            ' / ' +
                            formatNumber(data.max_alloc_heap) +
                            ' bytes free' +
                            (data.esp_platform === EspPlatform.ESP8266 ? ` (${data.heap_fragmentation}% fragmentation)` : '')
                          }
                        />
                      </ListItem>
                      <Box sx={{ px: 2, pb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={heapUsagePercent} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(240, 147, 251, 0.2)'
                              : 'rgba(255, 255, 255, 0.3)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(240, 147, 251, 0.8)'
                                : 'rgba(255, 255, 255, 0.8)',
                            }
                          }} 
                        />
                      </Box>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {data.esp_platform === EspPlatform.ESP32 && data.psram_size > 0 && (
                <Grid item xs={12} md={6}>
                  <Card className={classes.infoCard}>
                    <CardContent>
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <AppsIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="PSRAM"
                            secondary={formatNumber(data.psram_size) + ' / ' + formatNumber(data.free_psram) + ' bytes'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <DataUsageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Sketch Space"
                          secondary={formatNumber(data.sketch_size) + ' / ' + formatNumber(data.sketch_size + data.free_sketch_space) + ' bytes'}
                        />
                      </ListItem>
                      <Box sx={{ px: 2, pb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={flashUsagePercent} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(240, 147, 251, 0.2)'
                              : 'rgba(255, 255, 255, 0.3)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(240, 147, 251, 0.8)'
                                : 'rgba(255, 255, 255, 0.8)',
                            }
                          }} 
                        />
                      </Box>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <SdStorageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Flash Chip"
                          secondary={formatNumber(data.flash_chip_size) + ' bytes / ' + (data.flash_chip_speed / 1000000).toFixed(0) + ' MHz'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard}>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="File System"
                          secondary={
                            formatNumber(data.fs_used) +
                            ' / ' +
                            formatNumber(data.fs_total) +
                            ' bytes (' + formatNumber(data.fs_total - data.fs_used) + '\xa0bytes free)'
                          }
                        />
                      </ListItem>
                      <Box sx={{ px: 2, pb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={fsUsagePercent} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: theme.palette.mode === 'dark'
                              ? 'rgba(240, 147, 251, 0.2)'
                              : 'rgba(255, 255, 255, 0.3)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(240, 147, 251, 0.8)'
                                : 'rgba(255, 255, 255, 0.8)',
                            }
                          }} 
                        />
                      </Box>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Section */}
            <Box className={classes.actionSection}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Device Actions
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button 
                  startIcon={<RefreshIcon />} 
                  variant="contained" 
                  color="secondary" 
                  onClick={loadData}
                  sx={{ borderRadius: 3 }}
                >
                  Refresh Status
                </Button>
                {me.admin && (
                  <>
                    <Button 
                      startIcon={<PowerSettingsNewIcon />} 
                      variant="contained" 
                      color="primary" 
                      onClick={() => setConfirmRestart(true)}
                      sx={{ borderRadius: 3 }}
                    >
                      Restart Device
                    </Button>
                    <Button
                      startIcon={<SettingsBackupRestoreIcon />}
                      variant="contained"
                      onClick={() => setConfirmFactoryReset(true)}
                      color="error"
                      sx={{ borderRadius: 3 }}
                    >
                      Factory Reset
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {renderRestartDialog()}
            {renderFactoryResetDialog()}
          </Box>
        </Box>
      </Fade>
    );
  };

  return (
    <AutoRefreshWrapper
      onRefresh={loadData}
      defaultInterval={60000}
      defaultEnabled={true}
      title="System Status Auto-refresh"
    >
      {content()}
    </AutoRefreshWrapper>
  );

};

export default SystemStatusForm;
