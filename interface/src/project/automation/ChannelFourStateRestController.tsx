import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelFourState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelFourStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (<ChannelSectionContent {...this.props}/>)
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelFourStateRestController);
