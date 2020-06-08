import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelTwoState";

type ChannelTwoStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelTwoStateRestController extends Component<ChannelTwoStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div>
      <SectionContent title='Switch Status' titleGutter>
        <ChannelTwoWebSocketController/> 
      </SectionContent>
      <ChannelSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelTwoStateRestController);
