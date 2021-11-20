import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../../components';
import ChannelThreeStateRestController from '../rest/ChannelThreeStateRestController';
import ChannelThreeWebSocketController from '../ws/ChannelThreeWebSocketController';
import ChannelThreeMqttSettingsController from '../mqtt/ChannelThreeMqttSettingsController';

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
      <TabPanel style={{marginLeft: -23, marginRight: -23, marginTop: -35}}>
        <ChannelThreeStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23, marginTop: -35}}>
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