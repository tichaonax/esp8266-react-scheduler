import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../../components';
import ChannelFourStateRestController from '../rest/ChannelFourStateRestController';
import ChannelFourWebSocketController from '../ws/ChannelFourWebSocketController';
import ChannelFourMqttSettingsController from '../mqtt/ChannelFourMqttSettingsController';

const ChannelFour = () => {
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
        <ChannelFourStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23, marginTop: -35}}>
        <ChannelFourMqttSettingsController/>
      </TabPanel>
      <TabPanel>
        <ChannelFourWebSocketController/>
      </TabPanel>
    </Tabs>
    </SectionContent>
  );
}

export default ChannelFour;