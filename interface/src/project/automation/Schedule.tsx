
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Tab } from '@mui/material';

import { RouterTabs, useRouterTab, useLayoutTitle } from '../../components';

import ChannelOne from './channels/ChannelOne';
import ChannelTwo from './channels/ChannelTwo';
import ChannelThree from './channels/ChannelThree';
import ChannelFour from './channels/ChannelFour';
import { RemoteUtils } from './utils/remoteUtils';

const Schedule: FC = () => {
  useLayoutTitle("Schedule");
  const { routerTab } = useRouterTab();
  const {
    channelOne: isChannelOne,
    channelTwo: isChannelTwo,
    channelThree: isChannelThree,
    channelFour: isChannelFour
  } = RemoteUtils.getDeviceHost();

  return (
    <>
      <RouterTabs value={routerTab}>
        { isChannelOne  && <Tab value="channelOne" label="Channel One" /> }
        { isChannelTwo && <Tab value="channelTwo" label="Channel Two" /> }
        { isChannelThree && <Tab value="channelThree" label="Channel Three" /> }
        { isChannelFour && <Tab value="channelFour" label="Channel Four" /> }
      </RouterTabs>
      <Routes>
    <   Route path="channelOne" element={<ChannelOne />} />
        <Route path="channelTwo" element={<ChannelTwo />} />
        <Route path="channelThree" element={<ChannelThree />} />
        <Route path="channelFour" element={<ChannelFour />} />
        <Route path="/*" element={<Navigate replace to="channelOne" />} />
      </Routes>
    </>
  );
};

export default Schedule;
