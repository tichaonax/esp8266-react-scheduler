import React, { FC } from 'react';
import ChannelStatusDisplay from './ChannelStatusDisplay';

interface ChannelThreeStatusProps {
  refreshTrigger?: number;
}

const ChannelThreeStatus: FC<ChannelThreeStatusProps> = ({ refreshTrigger }) => {
  return <ChannelStatusDisplay channelId="Three" refreshTrigger={refreshTrigger} />;
};

export default ChannelThreeStatus;