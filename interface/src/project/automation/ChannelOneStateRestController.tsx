import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps } from '../../components';

import { ChannelState} from '../automation/redux/types/channel';
import ChannelSectionContent from './ChannelSectionContent';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelOneState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelOneStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (<ChannelSectionContent {...this.props}/>)
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelOneStateRestController);
