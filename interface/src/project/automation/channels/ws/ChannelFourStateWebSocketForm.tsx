import { FC } from 'react';

import ChannelStateWebSocketForm from './ChannelStateWebSocketForm';

export const SWITCH_SETTINGS_WEBSOCKET_URL = "channelFourState";

const ChannelFourStateWebSocketForm: FC = () => {
  const channelStateWebSocketFormProps  = {
    websocketEndPoint: SWITCH_SETTINGS_WEBSOCKET_URL
   };
    return (<ChannelStateWebSocketForm  {...channelStateWebSocketFormProps}/>);
};

export default ChannelFourStateWebSocketForm;
