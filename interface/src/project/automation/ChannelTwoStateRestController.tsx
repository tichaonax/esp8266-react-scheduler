import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelTwoState";

type ChannelOneStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelOneStateRestController extends Component<ChannelOneStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (<ChannelSectionContent {...this.props}/>)
  }

}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelOneStateRestController);
