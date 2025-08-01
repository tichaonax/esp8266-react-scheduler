import React, { FC } from 'react';
import ChannelFourStateWebSocketForm from '../ws/ChannelFourStateWebSocketForm';

interface ChannelFourStatusProps {
  refreshTrigger?: number;
}

const ChannelFourStatus: FC<ChannelFourStatusProps> = ({ refreshTrigger }) => {
  return <ChannelFourStateWebSocketForm />;
};

export default ChannelFourStatus;