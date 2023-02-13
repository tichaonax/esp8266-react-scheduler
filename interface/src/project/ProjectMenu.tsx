import { FC } from 'react';

import { List } from '@mui/material';
//import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';

import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';

import { PROJECT_PATH } from '../api/env';
import LayoutMenuItem from '../components/layout/LayoutMenuItem';

const ProjectMenu: FC = () => (
  <List>
{/*     <LayoutMenuItem icon={SettingsRemoteIcon} label="Demo Project" to={`/${PROJECT_PATH}/demo`} /> */}
    <LayoutMenuItem icon={AccessAlarmIcon} label="Automation" to={`/${PROJECT_PATH}/a`} />
    <LayoutMenuItem icon={BlurCircularIcon} label="Status" to={`/${PROJECT_PATH}/status`} />
  </List>
);

export default ProjectMenu;
