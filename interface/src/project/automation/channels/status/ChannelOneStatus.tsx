import React, { FC } from 'react';
import OptimizedChannelStatus from './OptimizedChannelStatus';

interface ChannelOneStatusProps {
  refreshTrigger?: number;
}

const ChannelOneStatus: FC<ChannelOneStatusProps> = ({ refreshTrigger }) => {
  // Use optimized component with auto-refresh instead of manual trigger
  return (
    <OptimizedChannelStatus 
      channelId="One" 
      defaultAutoRefresh={true}
      defaultInterval={5000} // 5 seconds for production
    />
  );
};

export default ChannelOneStatus;