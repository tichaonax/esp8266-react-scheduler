import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, SectionContent } from '../../components';

import { ChannelState } from './types';
import ChannelStateSectionContent from './ChannelStateSectionContent';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';

export const CONTROL_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelTwoState";

type ChannelStateRestControllerProps = RestControllerProps<ChannelState>;

class ChannelTwoStateRestController extends Component<ChannelStateRestControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
    <div style={{ marginTop: -20 , marginLeft: -23, marginRight: -23, marginBottom: -23}}>
      <SectionContent title='' titleGutter>
        <ChannelTwoWebSocketController/> 
      </SectionContent>
      <ChannelStateSectionContent {...this.props}/> 
    </div>
    )
  }
}

export default restController(CONTROL_SETTINGS_ENDPOINT, ChannelTwoStateRestController);
