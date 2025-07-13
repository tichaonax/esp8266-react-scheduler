import React, { FC } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FormLoader } from '../../../../components';
import { useRest } from '../../../../utils';
import { ChannelState } from '../../redux/types/channel';
import * as Api from '../../api/channelApi';

interface ChannelStatusDisplayProps {
  channelId: string;
  refreshTrigger?: number;
}

const ChannelStatusDisplay: FC<ChannelStatusDisplayProps> = ({ channelId, refreshTrigger }) => {
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
      return <FormLoader onRetry={loadData} errorMessage={errorMessage} />;
    }

    if (!data.schedule) {
      return (
        <Typography color="text.secondary">
          Channel {channelId} is not configured
        </Typography>
      );
    }

    return (
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="div">
            {data.name}
          </Typography>
          <Chip 
            label={data.controlOn ? 'ON' : 'OFF'} 
            color={data.controlOn ? 'success' : 'default'}
            variant="filled"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Control Pin: {data.controlPin}
        </Typography>
        
        <Typography variant="body2" gutterBottom>
          Next Run: {data.nextRunTime.substr(0, data.nextRunTime.lastIndexOf(' '))}
        </Typography>
        
        <Typography variant="body2" gutterBottom>
          Last Change: {data.lastStartedChangeTime.substr(0, data.lastStartedChangeTime.lastIndexOf(' '))}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          IP: {data.IPAddress} | Time: {data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}
        </Typography>
      </CardContent>
    );
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      {content()}
    </Card>
  );
};

export default ChannelStatusDisplay;