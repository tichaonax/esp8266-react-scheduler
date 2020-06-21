import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../components';
import ChannelThreeStateRestController from './ChannelThreeStateRestController';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';
import ChannelThreeMqttSettingsController from './ChannelThreeMqttSettingsController';

const ChannelThree = () => {
  return(
    <SectionContent title='' titleGutter>
    <Tabs>
      <TabList>
        <Tab>
          <Typography variant="overline">
            Schedule
          </Typography>
        </Tab>
        <Tab>
          <Typography variant="overline">
            Mqtt
          </Typography>
        </Tab>
        <Tab>
          <Typography variant="overline">
            Status
          </Typography>
        </Tab>
      </TabList>
      <TabPanel style={{marginLeft: -23, marginRight: -23}}>
        <ChannelThreeStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23}}>
        <ChannelThreeMqttSettingsController/>
      </TabPanel>
      <TabPanel>
        <ChannelThreeWebSocketController/>
      </TabPanel>
    </Tabs>
    </SectionContent>
  );
}

export default ChannelThree;