import React, { Component } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Switch } from '@material-ui/core';
import { WEB_SOCKET_ROOT } from '../../api';
import { WebSocketControllerProps, WebSocketFormLoader, WebSocketFormProps, webSocketController } from '../../components';
import { BlockFormControlLabel } from '../../components';

import { ChannelState } from './types';

export const SWITCH_SETTINGS_WEBSOCKET_URL = WEB_SOCKET_ROOT + "channelTwoState";

type ChannelWebSocketControllerProps = WebSocketControllerProps<ChannelState>;

class ChannelTwoWebSocketController extends Component<ChannelWebSocketControllerProps> {

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

export default webSocketController(SWITCH_SETTINGS_WEBSOCKET_URL, 100, ChannelTwoWebSocketController);

type ChannelStateWebSocketControllerFormProps = WebSocketFormProps<ChannelState>;

function ChannelStateWebSocketControllerForm(props: ChannelStateWebSocketControllerFormProps) {
  const { data, saveData, setData } = props;

  const handleControlValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, controlOn: event.target.checked }, saveData);
  }

  return (
    <ValidatorForm onSubmit={saveData}>
      <BlockFormControlLabel
        control={
          <Switch
            checked={data.controlOn}
            onChange={handleControlValueChange}
            color="primary"
          />
        }
        label={data.name}
      />
    </ValidatorForm>
  );
}