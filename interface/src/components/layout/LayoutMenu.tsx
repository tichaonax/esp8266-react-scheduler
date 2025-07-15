import React, { FC, useContext } from 'react';

import { Divider, List } from '@mui/material';

import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RouterIcon from '@mui/icons-material/Router';
import ComputerIcon from '@mui/icons-material/Computer';
import SecurityIcon from '@mui/icons-material/Security';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';

import { FeaturesContext } from '../../contexts/features';
import ProjectMenu from '../../project/ProjectMenu';
import { AuthenticatedContext } from '../../contexts/authentication';
import LayoutMenuItem from './LayoutMenuItem';

const LayoutMenu: FC = () => {
  const { features } = useContext(FeaturesContext);
  const authenticatedContext = useContext(AuthenticatedContext);

  return (
    <>
      {features.project && (
        <List disablePadding component="nav">
          <ProjectMenu />
          <Divider />
        </List>
      )}
      <List disablePadding component="nav">
        <LayoutMenuItem 
          icon={(props) => <NetworkWifiIcon {...props} sx={{ color: '#2196F3' }} />} 
          label="WiFi Connection" 
          to="/wifi" 
        />
        <LayoutMenuItem 
          icon={(props) => <WifiTetheringIcon {...props} sx={{ color: '#FF9800' }} />} 
          label="Access Point" 
          to="/ap" 
        />
        {features.ntp && (
          <LayoutMenuItem 
            icon={(props) => <ScheduleIcon {...props} sx={{ color: '#4CAF50' }} />} 
            label="Network Time" 
            to="/ntp" 
          />
        )}
        {features.mqtt && (
          <LayoutMenuItem 
            icon={(props) => <RouterIcon {...props} sx={{ color: '#9C27B0' }} />} 
            label="MQTT" 
            to="/mqtt" 
          />
        )}
        {features.security && (
          <LayoutMenuItem 
            icon={(props) => <SecurityIcon {...props} sx={{ color: '#F44336' }} />} 
            label="Security" 
            to="/security" 
            disabled={!authenticatedContext.me.admin} 
          />
        )}
        <LayoutMenuItem 
          icon={(props) => <ComputerIcon {...props} sx={{ color: '#607D8B' }} />} 
          label="System" 
          to="/system" 
        />
      </List>
    </>
  );
};

export default LayoutMenu;
