import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelStateSectionContent from './ChannelStateSectionContent';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelThreeState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelThreeStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div>
      <SectionContent title='Switch Status' titleGutter>
        <ChannelThreeWebSocketController/> 
      </SectionContent>
      <ChannelStateSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelThreeStateRestController);
