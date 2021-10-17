import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../../components';
import ChannelTwoStateRestController from '../rest/ChannelTwoStateRestController';
import ChannelTwoWebSocketController from '../ws/ChannelTwoWebSocketController';
import ChannelTwoMqttSettingsController from '../mqtt/ChannelTwoMqttSettingsController';

const ChannelTwo = () => {
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
        <ChannelTwoStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23, marginTop: -35}}>
        <ChannelTwoMqttSettingsController/>
      </TabPanel>
      <TabPanel>
        <ChannelTwoWebSocketController/>
      </TabPanel>
    </Tabs>
    </SectionContent>
  );
}

export default ChannelTwo;