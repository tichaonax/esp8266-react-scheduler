import React, { FC } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  Grid
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import RouterIcon from '@mui/icons-material/Router';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MemoryIcon from '@mui/icons-material/Memory';
import { FormLoader } from '../../../../components';
import { useRest } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';

interface ChannelStatusDisplayProps {
  channelId: string;
  refreshTrigger?: number;
}

const useStyles = makeStyles((theme: any) => createStyles({
  statusCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.3)'
      : '0 20px 40px rgba(0,0,0,0.1)',
    height: '100%',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 25px 50px rgba(0,0,0,0.4)'
        : '0 25px 50px rgba(0,0,0,0.15)',
    },
  },
  headerSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(21, 101, 192, 0.15) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(21, 101, 192, 0.8) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(33, 150, 243, 0.2)'
      : 'none',
  },
  channelTitle: {
    color: theme.palette.mode === 'dark' ? '#64b5f6' : 'white',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  statusChip: {
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(1),
  },
  infoSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(76, 175, 80, 0.2)'
      : '1px solid rgba(76, 175, 80, 0.3)',
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
    color: theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32',
    fontWeight: 500,
  },
  errorSection: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    textAlign: 'center',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(244, 67, 54, 0.2)'
      : '1px solid rgba(244, 67, 54, 0.3)',
  },
  retryButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: theme.spacing(1),
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #ff5722 30%, #d84315 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
    color: 'white',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
  },
}));

const ChannelStatusDisplay: FC<ChannelStatusDisplayProps> = ({ channelId, refreshTrigger }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { loadData, data, errorMessage } = useRest<ChannelState>({ 
    read: () => Api.createReadChannelApi(channelId) 
  });

  // Refresh data when trigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadData();
    }
  }, [refreshTrigger, loadData]);

  const content = () => {
    if (!data) {
      // Show authentication message instead of infinite loading
      if (errorMessage) {
        return (
          <CardContent>
            <Box className={classes.errorSection}>
              <Typography variant="h6" gutterBottom sx={{ color: '#f44336', fontWeight: 600 }}>
                Channel {channelId}
              </Typography>
              <Typography color="error" variant="body2" gutterBottom>
                Authentication required
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Please log in to view channel status
              </Typography>
              <button 
                onClick={loadData}
                className={classes.retryButton}
              >
                Retry Connection
              </button>
            </Box>
          </CardContent>
        );
      }
      return <FormLoader onRetry={loadData} errorMessage={errorMessage} />;
    }

    if (!data.schedule) {
      return (
        <CardContent>
          <Box className={classes.errorSection}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ff9800', fontWeight: 600 }}>
              Channel {channelId}
            </Typography>
            <Typography color="text.secondary">
              Channel not configured
            </Typography>
          </Box>
        </CardContent>
      );
    }

    return (
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Box className={classes.headerSection}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" className={classes.channelTitle}>
              <Avatar sx={{ bgcolor: '#2196F3', mr: 2, width: 32, height: 32 }}>
                <PowerSettingsNewIcon fontSize="small" />
              </Avatar>
              {data.name}
            </Typography>
            <Chip 
              label={data.controlOn ? 'ON' : 'OFF'} 
              color={data.controlOn ? 'success' : 'default'}
              variant="filled"
              className={classes.statusChip}
              sx={{
                background: data.controlOn 
                  ? 'linear-gradient(45deg, #4CAF50 30%, #388E3C 90%)'
                  : 'linear-gradient(45deg, #757575 30%, #424242 90%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : 'rgba(255,255,255,0.8)' }}>
            Control Pin: {data.controlPin}
          </Typography>
        </Box>
        
        {/* Information Section */}
        <Box className={classes.infoSection}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#FF9800' }} className={classes.infoIcon}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Next Run
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#a5d6a7' : '#388e3c' }}>
                    {data.nextRunTime.substr(0, data.nextRunTime.lastIndexOf(' '))}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#9C27B0' }} className={classes.infoIcon}>
                  <HistoryIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Last Change
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#a5d6a7' : '#388e3c' }}>
                    {data.lastStartedChangeTime.substr(0, data.lastStartedChangeTime.lastIndexOf(' '))}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#4CAF50' }} className={classes.infoIcon}>
                  <RouterIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    IP Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#a5d6a7' : '#388e3c' }}>
                    {data.IPAddress}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box className={classes.infoItem}>
                <Avatar sx={{ bgcolor: '#2196F3' }} className={classes.infoIcon}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className={classes.infoText}>
                    Local Time
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#a5d6a7' : '#388e3c' }}>
                    {data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    );
  };

  return (
    <Fade in timeout={600}>
      <Card className={classes.statusCard}>
        {content()}
      </Card>
    </Fade>
  );
};

export default ChannelStatusDisplay;