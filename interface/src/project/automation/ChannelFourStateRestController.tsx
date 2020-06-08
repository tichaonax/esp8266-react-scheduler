import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';
import ChannelFourWebSocketController from './ChannelFourWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelFourState";

type ChannelFourStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelFourStateRestController extends Component<ChannelFourStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div>
      <SectionContent title='Switch Status' titleGutter>
        <ChannelFourWebSocketController/> 
      </SectionContent>
      <ChannelSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelFourStateRestController);
