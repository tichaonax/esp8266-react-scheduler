import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

import { SectionContent } from '../../components';
import ChannelOneStateRestController from './ChannelOneStateRestController';
import ChannelOneWebSocketController from './ChannelOneWebSocketController';
import ChannelOneMqttSettingsController from './ChannelOneMqttSettingsController';

const ChannelOne = () => {
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
        <ChannelOneStateRestController/>
      </TabPanel>
      <TabPanel style={{marginLeft: -23, marginRight: -23}}>
        <ChannelOneMqttSettingsController/>
      </TabPanel>
      <TabPanel>
        <ChannelOneWebSocketController/>
      </TabPanel>
    </Tabs>
    </SectionContent>
  );
}

export default ChannelOne;