import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import history from '../../history';
import { Switch } from '@material-ui/core';
import { WebSocketFormProps } from '../../components';
import { BlockFormControlLabel } from '../../components';

import { ChannelState } from './types';
import { CHANNEL_ONE_CONTROL_PIN,
        CHANNEL_TWO_CONTROL_PIN,
        CHANNEL_THREE_CONTROL_PIN, 
        CHANNEL_FOUR_CONTROL_PIN } from './constants';
import { useLocation } from 'react-router';

type ChannelStateWebSocketControllerFormProps = WebSocketFormProps<ChannelState>;

const ChannelStateWebSocketControllerForm = (props: ChannelStateWebSocketControllerFormProps) => {
  const { data, saveData, setData } = props;

  const handleControlValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, controlOn: event.target.checked }, saveData);
  }
  const pathname = useLocation().pathname;
  const showLink = pathname.includes("wsStatus")
  
  const getLink = () => {  
    switch (data.controlPin) {
      case CHANNEL_ONE_CONTROL_PIN:
        return ("/project/auto/channelOne");
        break;
      case CHANNEL_TWO_CONTROL_PIN:
        return ("/project/auto/channelTwo");
        break;
      case CHANNEL_THREE_CONTROL_PIN:
        return ("/project/auto/channelThree");
        break;
      case CHANNEL_FOUR_CONTROL_PIN:
        return ("/project/auto/channelFour");
        break;
      default:
        return ("/project/auto/channelOne");
        break;
    }
  }

  const onClick = () => {
    history.push(getLink());
  }
  return (
    <ValidatorForm onSubmit={saveData}>
      {showLink && (<div>
        <a onClick={onClick} href="#">View "{data.name}" schedule</a>
        <div>Next Run : {data.nextRunTime.substr(0, data.nextRunTime.lastIndexOf(' '))}</div>
        </div>)}
      <BlockFormControlLabel
        control={
          <Switch
            checked={data.controlOn}
            onChange={handleControlValueChange}
            color="primary"
          />
        }
        label={data.name + " : last status at " + data.lastStartedChangeTime.substr(0, data.lastStartedChangeTime.lastIndexOf(' '))}
      />
    </ValidatorForm>
  );
}

export default ChannelStateWebSocketControllerForm;
