import React, { Component } from 'react';
import { WEB_SOCKET_ROOT } from '../../api';
import { WebSocketControllerProps, WebSocketFormLoader, webSocketController } from '../../components';

import { ChannelState} from '../automation/redux/types/channel';
import ChannelStateWebSocketControllerForm from './ChannelStateWebSocketControllerForm';

export const SWITCH_SETTINGS_WEBSOCKET_URL = WEB_SOCKET_ROOT + "ch-1State";

type ChannelWebSocketControllerProps = WebSocketControllerProps<ChannelState>;

class ChannelOneWebSocketController extends Component<ChannelWebSocketControllerProps> {

  render() {
    return (
        <WebSocketFormLoader
          {...this.props}
          render={props => (
            <ChannelStateWebSocketControllerForm {...props} />
          )}
        />
    )
  }
}

export default webSocketController(SWITCH_SETTINGS_WEBSOCKET_URL, 100, ChannelOneWebSocketController);