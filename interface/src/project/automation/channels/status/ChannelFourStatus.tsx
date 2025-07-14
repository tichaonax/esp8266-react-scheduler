import React, { FC } from 'react';
import OptimizedChannelStatus from './OptimizedChannelStatus';

interface ChannelFourStatusProps {
  refreshTrigger?: number;
}

const ChannelFourStatus: FC<ChannelFourStatusProps> = ({ refreshTrigger }) => {
  return (
    <OptimizedChannelStatus 
      channelId="Four" 
      defaultAutoRefresh={true}
      defaultInterval={5000}
    />
  );
};

export default ChannelFourStatus;