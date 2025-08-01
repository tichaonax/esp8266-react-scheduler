import React, { FC } from 'react';
import ChannelThreeStateWebSocketForm from '../ws/ChannelThreeStateWebSocketForm';

interface ChannelThreeStatusProps {
  refreshTrigger?: number;
}

const ChannelThreeStatus: FC<ChannelThreeStatusProps> = ({ refreshTrigger }) => {
  return <ChannelThreeStateWebSocketForm />;
};

export default ChannelThreeStatus;