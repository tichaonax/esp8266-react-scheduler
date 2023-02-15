import { FC } from 'react';

import { List } from '@mui/material';

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';

import { PROJECT_PATH } from '../api/env';
import LayoutMenuItem from '../components/layout/LayoutMenuItem';
import { RemoteUtils } from './automation/utils/remoteUtils';

const ProjectMenu: FC = () =>{
  const {
    isProxy,
    activeChannel,
    HaCall,
  } = RemoteUtils.getDeviceHost();

  const channel = isProxy | HaCall ? `/${activeChannel}` : '';

  return(
    <List>
      <LayoutMenuItem icon={AccessAlarmIcon} label="Automation" to={`/${PROJECT_PATH}/a${channel}`} />
      {isProxy | HaCall ? null: <LayoutMenuItem icon={BlurCircularIcon} label="Status" to={`/${PROJECT_PATH}/status`} />}
    </List>
  );
};

export default ProjectMenu;
