
import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import MessageIcon from '@mui/icons-material/Message';
import { ThemeProvider } from '@mui/material/styles';
import type {} from '@mui/lab/themeAugmentation';
import { MuiThemeOverride } from './themeOverrides';

import { useLayoutTitle } from '../../../components';

import ChannelTwoStateRestForm from './rest/ChannelTwoStateRestForm';
import ChannelTwoMqttSettingsForm from './mqtt/ChannelTwoMqttSettingsForm';
import ChannelTwoStateWebSocketForm from './ws/ChannelTwoStateWebSocketForm';

const ChannelTwo: FC = () => {
  useLayoutTitle("Automation");

  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      <ThemeProvider theme={MuiThemeOverride}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="Channel">
                <Tab icon={<AccessAlarmIcon/>} label="Schedule" value="1" />
                <Tab icon={<BlurCircularIcon/>} label="Status" value="2" />
                <Tab icon={<MessageIcon/>} label="Mqtt" value="3" disabled={false} />
              </TabList>
            </Box>
            <TabPanel value="1"> <ChannelTwoStateRestForm/></TabPanel>
            <TabPanel value="2"><ChannelTwoStateWebSocketForm/></TabPanel>
            <TabPanel value="3"><ChannelTwoMqttSettingsForm/></TabPanel>
          </TabContext>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default ChannelTwo;
