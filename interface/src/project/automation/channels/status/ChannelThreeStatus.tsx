import React, { FC } from 'react';
import OptimizedChannelStatus from './OptimizedChannelStatus';

interface ChannelThreeStatusProps {
  refreshTrigger?: number;
}

const ChannelThreeStatus: FC<ChannelThreeStatusProps> = ({ refreshTrigger }) => {
  return (
    <OptimizedChannelStatus 
      channelId="Three" 
      defaultAutoRefresh={true}
      defaultInterval={5000}
    />
  );
};

export default ChannelThreeStatus;