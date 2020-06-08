import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelSectionContent from './ChannelSectionContent';
import ChannelOneWebSocketController from './ChannelOneWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelOneState";

type ChannelOneStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelOneStateRestController extends Component<ChannelOneStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div>
      <SectionContent title='Switch Status' titleGutter>
        <ChannelOneWebSocketController/> 
      </SectionContent>
      <ChannelSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelOneStateRestController);
