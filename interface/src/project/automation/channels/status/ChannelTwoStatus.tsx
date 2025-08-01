import React, { FC } from 'react';
import ChannelTwoStateWebSocketForm from '../ws/ChannelTwoStateWebSocketForm';

interface ChannelTwoStatusProps {
  refreshTrigger?: number;
}

const ChannelTwoStatus: FC<ChannelTwoStatusProps> = ({ refreshTrigger }) => {
  return <ChannelTwoStateWebSocketForm />;
};

export default ChannelTwoStatus;