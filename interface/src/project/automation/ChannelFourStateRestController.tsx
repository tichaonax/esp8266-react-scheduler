import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, RestFormLoader, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelFourState";

type ChannelFourStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelFourStateRestController extends Component<ChannelFourStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (<ChannelSectionContent {...this.props}/>)
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelFourStateRestController);
