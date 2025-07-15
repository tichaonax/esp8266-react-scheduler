
import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import MessageIcon from '@mui/icons-material/Message';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import type {} from '@mui/lab/themeAugmentation';
import { MuiThemeOverride } from './themeOverrides';

import { useLayoutTitle } from '../../../components';

import ChannelThreeMqttSettingsForm from './mqtt/ChannelThreeMqttSettingsForm';
import OptimizedChannelStatus from './status/OptimizedChannelStatus';
import SectionedScheduleForm from './schedule/SectionedScheduleForm';

const ChannelThree: FC = () => {
  useLayoutTitle("Automation");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
              <TabList 
                onChange={handleChange} 
                aria-label="Channel"
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{
                  '& .MuiTab-root': {
                    minWidth: isMobile ? 'auto' : 120,
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    padding: isMobile ? '8px 4px' : '12px 16px',
                  },
                }}
              >
                <Tab 
                  icon={<AccessAlarmIcon sx={{ color: '#00BCD4' }} />} 
                  label="Schedule" 
                  value="1" 
                />
                <Tab 
                  icon={<BlurCircularIcon sx={{ color: '#8BC34A' }} />} 
                  label="Status" 
                  value="2" 
                />
                <Tab 
                  icon={<MessageIcon sx={{ color: '#E91E63' }} />} 
                  label="Mqtt" 
                  value="3" 
                  disabled={false} 
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <SectionedScheduleForm channelId="Three" />
            </TabPanel>
            <TabPanel value="2">
              <OptimizedChannelStatus 
                channelId="Three" 
                defaultAutoRefresh={true}
                defaultInterval={5000}
              />
            </TabPanel>
            <TabPanel value="3"><ChannelThreeMqttSettingsForm/></TabPanel>
          </TabContext>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default ChannelThree;
