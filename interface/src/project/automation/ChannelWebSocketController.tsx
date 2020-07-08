import React, { Component } from 'react';
import { SectionContent } from '../../components';
import { CHANNEL_ONE, CHANNEL_TWO, CHANNEL_THREE, CHANNEL_FOUR } from '../../api';

import ChannelOneWebSocketController from './ChannelOneWebSocketController';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';
import ChannelFourWebSocketController from './ChannelFourWebSocketController';
import { Divider } from '@material-ui/core';
class ChannelWebSocketController extends Component {

  render() {
    return (
      <SectionContent title='Switch status' titleGutter>
         {(CHANNEL_ONE === 'true') && <div><Divider/><ChannelOneWebSocketController/> </div>}
         {(CHANNEL_TWO === 'true') &&  <div><Divider/><ChannelTwoWebSocketController/></div>}
         {(CHANNEL_THREE === 'true') && <div><Divider/><ChannelThreeWebSocketController/></div>}
         {(CHANNEL_FOUR === 'true') && <div><Divider/><ChannelFourWebSocketController/></div>}
      </SectionContent>
    )
  }
}

export default ChannelWebSocketController;
