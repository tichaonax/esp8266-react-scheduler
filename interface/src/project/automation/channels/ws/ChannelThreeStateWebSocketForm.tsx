import { FC } from 'react';

import ChannelStateWebSocketForm from './ChannelStateWebSocketForm';

export const SWITCH_SETTINGS_WEBSOCKET_URL = "channelThreeState";

const ChannelThreeStateWebSocketForm: FC = () => {
  const channelStateWebSocketFormProps  = {
    websocketEndPoint: SWITCH_SETTINGS_WEBSOCKET_URL
   };
    return (<ChannelStateWebSocketForm  {...channelStateWebSocketFormProps}/>);
};

export default ChannelThreeStateWebSocketForm;
