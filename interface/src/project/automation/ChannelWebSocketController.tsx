import React, { Component } from 'react';
import { SectionContent } from '../../components';
import { CHANNEL_ONE, CHANNEL_TWO, CHANNEL_THREE, CHANNEL_FOUR } from '../../api';

import ChannelOneWebSocketController from './ChannelOneWebSocketController';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';
import ChannelFourWebSocketController from './ChannelFourWebSocketController';
class ChannelWebSocketController extends Component {

  render() {
    return (
      <SectionContent title='Switch status' titleGutter>
         {(CHANNEL_ONE === 'true') && <ChannelOneWebSocketController/>}
         {(CHANNEL_TWO === 'true') && <ChannelTwoWebSocketController/>}
         {(CHANNEL_THREE === 'true') && <ChannelThreeWebSocketController/>}
         {(CHANNEL_FOUR === 'true') && <ChannelFourWebSocketController/>}
      </SectionContent>
    )
  }
}

export default ChannelWebSocketController;
