import { FC } from 'react';

import { List } from '@mui/material';
//import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';

import { PROJECT_PATH } from '../api/env';
import LayoutMenuItem from '../components/layout/LayoutMenuItem';
import { RemoteUtils } from './automation/utils/remoteUtils';

import {
  ONE,
  TWO,
  THREE,
  FOUR,
} from '../project/automation/constants';

const ProjectMenu: FC = () =>{
  const {
    channelOne,
    channelTwo,
    channelThree,
    channelFour,
    isProxy,
  } = RemoteUtils.getDeviceHost();

  let channel = '';

  if(channelOne){
    channel = `/${ONE}`;
  }else if(channelTwo){
    channel = `/${TWO}`;
  }else if(channelThree){
    channel = `/${THREE}`;
  }else if(channelFour){
    channel = `/${FOUR}`;
  }
  return(
    <List>
      <LayoutMenuItem icon={AccessAlarmIcon} label="Automation" to={`/${PROJECT_PATH}/a${channel}`} />
      {isProxy ? null: <LayoutMenuItem icon={BlurCircularIcon} label="Status" to={`/${PROJECT_PATH}/status`} />}
    </List>
  );
};

export default ProjectMenu;
