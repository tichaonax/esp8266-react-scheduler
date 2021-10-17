import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../../api';
import { restController, RestControllerProps } from '../../../components';

import { ChannelState} from '../redux/types/channel';
import ChannelSectionContent from '../channels/ChannelSectionContent';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelTwoState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelTwoStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (<ChannelSectionContent {...this.props}/>)
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelTwoStateRestController);
