import React, { FC } from 'react';
import OptimizedChannelStatus from './OptimizedChannelStatus';

interface ChannelTwoStatusProps {
  refreshTrigger?: number;
}

const ChannelTwoStatus: FC<ChannelTwoStatusProps> = ({ refreshTrigger }) => {
  return (
    <OptimizedChannelStatus 
      channelId="Two" 
      defaultAutoRefresh={true}
      defaultInterval={5000}
    />
  );
};

export default ChannelTwoStatus;