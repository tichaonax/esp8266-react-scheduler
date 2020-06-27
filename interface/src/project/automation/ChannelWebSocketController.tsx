import React, { Component } from 'react';
import { SectionContent } from '../../components';
import ChannelOneWebSocketController from './ChannelOneWebSocketController';
/*import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';
import ChannelFourWebSocketController from './ChannelFourWebSocketController'; */
class ChannelWebSocketController extends Component {

  render() {
    return (
      <SectionContent title='Switch status' titleGutter>
        <ChannelOneWebSocketController/>
  {/*      <ChannelTwoWebSocketController/>
          <ChannelThreeWebSocketController/>
        <ChannelFourWebSocketController/> */}
      </SectionContent>
    )
  }
}

export default ChannelWebSocketController;
