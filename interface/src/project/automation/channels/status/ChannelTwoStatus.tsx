import React, { FC } from 'react';
import ChannelStatusDisplay from './ChannelStatusDisplay';

interface ChannelTwoStatusProps {
  refreshTrigger?: number;
}

const ChannelTwoStatus: FC<ChannelTwoStatusProps> = ({ refreshTrigger }) => {
  return <ChannelStatusDisplay channelId="Two" refreshTrigger={refreshTrigger} />;
};

export default ChannelTwoStatus;