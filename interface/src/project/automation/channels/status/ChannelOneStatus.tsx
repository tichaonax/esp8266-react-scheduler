import React, { FC } from 'react';
import ChannelStatusDisplay from './ChannelStatusDisplay';

interface ChannelOneStatusProps {
  refreshTrigger?: number;
}

const ChannelOneStatus: FC<ChannelOneStatusProps> = ({ refreshTrigger }) => {
  return <ChannelStatusDisplay channelId="One" refreshTrigger={refreshTrigger} />;
};

export default ChannelOneStatus;