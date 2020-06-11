import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Switch } from '@material-ui/core';
import { WebSocketFormProps } from '../../components';
import { BlockFormControlLabel } from '../../components';

import { ChannelState } from './types';

type ChannelStateWebSocketControllerFormProps = WebSocketFormProps<ChannelState>;

const ChannelStateWebSocketControllerForm = (props: ChannelStateWebSocketControllerFormProps) => {
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
        label={data.name + " : " + data.lastStartedChangeTime}
      />
    </ValidatorForm>
  );
}

export default ChannelStateWebSocketControllerForm;