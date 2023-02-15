
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Tab } from '@mui/material';

import { RouterTabs, useRouterTab, useLayoutTitle } from '../../components';

import ChannelOne from './channels/ChannelOne';
import ChannelTwo from './channels/ChannelTwo';
import ChannelThree from './channels/ChannelThree';
import ChannelFour from './channels/ChannelFour';
import { RemoteUtils } from './utils/remoteUtils';
import CustomTheme from '../../CustomTheme';
import {
  ONE,
  TWO,
  THREE,
  FOUR,
  CHANNEL_ONE_LABEL,
  CHANNEL_TWO_LABEL,
  CHANNEL_THREE_LABEL,
  CHANNEL_FOUR_LABEL,
 } from './constants';

const Schedule: FC = () => {
  const { routerTab } = useRouterTab();
  const {
    channelOne,
    channelTwo,
    channelThree,
    channelFour,
  } = RemoteUtils.getDeviceHost();

  let defaultChannel: string = "";

  if(channelOne){defaultChannel = ONE;}
  else if(channelTwo){defaultChannel = TWO;}
  else if(channelThree){defaultChannel= THREE;}
  else if(channelFour){defaultChannel = FOUR;}

  useLayoutTitle("Schedule");

  return (
    <CustomTheme>
      <RouterTabs value={routerTab}>
        { channelOne ? <Tab value={`${ONE}`} label={`${CHANNEL_ONE_LABEL}`} /> : null}
        { channelTwo ? <Tab value={`${TWO}`} label={`${CHANNEL_TWO_LABEL}`} /> : null }
        { channelThree ? <Tab value={`${THREE}`} label={`${CHANNEL_THREE_LABEL}`} /> : null }
        { channelFour ? <Tab value={`${FOUR}`} label={`${CHANNEL_FOUR_LABEL}`} /> : null }
      </RouterTabs>
      <Routes>
    <   Route path={`${ONE}`} element={<ChannelOne />} />
        <Route path={`${TWO}`} element={<ChannelTwo />} />
        <Route path={`${THREE}`} element={<ChannelThree />} />
        <Route path={`${FOUR}`} element={<ChannelFour />} />
        <Route path="/*" element={<Navigate replace to={defaultChannel} />} />
      </Routes>
    </CustomTheme>
  );
};

export default Schedule;
