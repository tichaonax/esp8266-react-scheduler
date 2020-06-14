import React from 'react';
import { Tab, TabList } from 'react-tabs';
import Typography from '@material-ui/core/Typography';
import 'react-tabs/style/react-tabs.css';

export const ChannelTabList = () => {
    return(
      <TabList>
        <Tab>
          <Typography variant="subtitle2">
            Schedule
          </Typography>
        </Tab>
        <Tab>
          <Typography variant="subtitle2">
            Mqtt
          </Typography>
        </Tab>
        <Tab>
          <Typography variant="subtitle2">
            Status
          </Typography>
        </Tab>
      </TabList>
    );
}

export default ChannelTabList;