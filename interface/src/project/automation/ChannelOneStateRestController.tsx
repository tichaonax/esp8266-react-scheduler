import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelStateSectionContent from './ChannelStateSectionContent';
import ChannelOneWebSocketController from './ChannelOneWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelOneState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelOneStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div>
      <SectionContent title='Switch Status' titleGutter>
        <ChannelOneWebSocketController/> 
      </SectionContent>
      <ChannelStateSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelOneStateRestController);
