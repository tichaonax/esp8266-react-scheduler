import React, { Component } from 'react';
import { WEB_SOCKET_ROOT } from '../../../api';
import { WebSocketControllerProps, WebSocketFormLoader, webSocketController } from '../../../components';

import { SystemState } from '../redux/types/system';
import SystemStateWebSocketControllerForm from './SystemStateWebSocketControllerForm';

export const SYSTEM_STATE_WEBSOCKET_URL = WEB_SOCKET_ROOT + "systemState";

type SystemStateWebSocketControllerProps = WebSocketControllerProps<SystemState>;

class SystemStateWebSocketController extends Component<SystemStateWebSocketControllerProps> {

  render() {
    return (
        <WebSocketFormLoader
          {...this.props}
          render={props => (
            <SystemStateWebSocketControllerForm {...props} />
          )}
        />
    )
  }
}

export default webSocketController(SYSTEM_STATE_WEBSOCKET_URL, 100, SystemStateWebSocketController);