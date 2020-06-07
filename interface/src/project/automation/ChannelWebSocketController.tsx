import React, { Component } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Typography, Box, Switch } from '@material-ui/core';
import { WEB_SOCKET_ROOT } from '../../api';
import { WebSocketControllerProps, WebSocketFormLoader, WebSocketFormProps, webSocketController } from '../../components';
import { SectionContent, BlockFormControlLabel } from '../../components';

import { ChannelState, Schedule } from './types';

export const LIGHT_SETTINGS_WEBSOCKET_URL = WEB_SOCKET_ROOT + "channelOneState";

type ChannelWebSocketControllerProps = WebSocketControllerProps<ChannelState>;

class ChannelWebSocketController extends Component<ChannelWebSocketControllerProps> {

  render() {
    return (
      <SectionContent title='WebSocket Controller' titleGutter>
        <WebSocketFormLoader
          {...this.props}
          render={props => (
            <ChannelStateWebSocketControllerForm {...props} />
          )}
        />
      </SectionContent>
    )
  }

}

export default webSocketController(LIGHT_SETTINGS_WEBSOCKET_URL, 100, ChannelWebSocketController);

type ChannelStateWebSocketControllerFormProps = WebSocketFormProps<ChannelState>;

function ChannelStateWebSocketControllerForm(props: ChannelStateWebSocketControllerFormProps) {
  const { data, saveData, setData } = props;

  /*const changeLedOn = (event: React.ChangeEvent<HTMLInputElement>) => {
    //const ch
    //setData({ controlOn: event.target.checked }, saveData);
  } */

  const handleControlValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //const { data, setData } = props;
    //setData({ ...data, schedule: {...data.schedule, [name]: extractEventValue(event) } });
    setData({ ...data, controlOn: event.target.checked }, saveData);

   /*  switch (name) {
      case 'startTimeHour':
        //const startTime = extractDateValue(event, name);
        setData({ ...data, schedule: {...data.schedule,  startTimeHour: startTime.timeHour, startTimeMinute: startTime.timeMinute } });
        break;
        case 'endTimeHour':
          const endTime = extractDateValue(event, name);
          setData({ ...data, schedule: {...data.schedule, endTimeHour: endTime.timeHour, endTimeMinute: endTime.timeMinute } });
        break;
      default:
        setData({ ...data, schedule: {...data.schedule, [name]: extractEventValue(event) } });
        break;
    } */
  }


  return (
    <ValidatorForm onSubmit={saveData}>
      <Box bgcolor="primary.main" color="primary.contrastText" p={2} mt={2} mb={2}>
        <Typography variant="body1">
          The switch below controls the LED via the WebSocket. It will automatically update whenever the LED state changes.
        </Typography>
      </Box>
      <BlockFormControlLabel
        control={
          <Switch
            checked={data.controlOn}
            onChange={handleControlValueChange}
            color="primary"
          />
        }
        label="LED State?"
      />
    </ValidatorForm>
  );
}
