import React, { FC } from 'react';
import ChannelOneStateWebSocketForm from '../ws/ChannelOneStateWebSocketForm';

interface ChannelOneStatusProps {
  refreshTrigger?: number;
}

const ChannelOneStatus: FC<ChannelOneStatusProps> = ({ refreshTrigger }) => {
  // Use WebSocket component for real-time updates
  return <ChannelOneStateWebSocketForm />;
};

export default ChannelOneStatus;