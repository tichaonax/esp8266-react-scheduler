import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../components';
import ChannelTwoStateRestController from './ChannelTwoStateRestController';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';
import ChannelTwoMqttSettingsController from './ChannelTwoMqttSettingsController';

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
      <TabPanel style={{marginLeft: -23, marginRight: -23}}>
        <ChannelTwoStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23}}>
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