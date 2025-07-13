import React, { FC } from 'react';
import ChannelStatusDisplay from './ChannelStatusDisplay';

interface ChannelFourStatusProps {
  refreshTrigger?: number;
}

const ChannelFourStatus: FC<ChannelFourStatusProps> = ({ refreshTrigger }) => {
  return <ChannelStatusDisplay channelId="Four" refreshTrigger={refreshTrigger} />;
};

export default ChannelFourStatus;