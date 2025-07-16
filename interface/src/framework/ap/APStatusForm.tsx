import React, { FC } from "react";

import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, Theme, useTheme } from "@mui/material";
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import ComputerIcon from '@mui/icons-material/Computer';
import RefreshIcon from '@mui/icons-material/Refresh';
import IpIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';

import * as APApi from "../../api/ap";
import { APNetworkStatus, APStatus } from "../../types";
import { ButtonRow, FormLoader, SectionContent } from "../../components";
import { useRest } from "../../utils";

export const apStatusHighlight = ({ status }: APStatus, theme: Theme) => {
  switch (status) {
    case APNetworkStatus.ACTIVE:
      return theme.palette.success.main;
    case APNetworkStatus.INACTIVE:
      return theme.palette.info.main;
    case APNetworkStatus.LINGERING:
      return theme.palette.warning.main;
    default:
      return theme.palette.warning.main;
  }
};

export const apStatus = ({ status }: APStatus) => {
  switch (status) {
    case APNetworkStatus.ACTIVE:
      return "Active";
    case APNetworkStatus.INACTIVE:
      return "Inactive";
    case APNetworkStatus.LINGERING:
      return "Lingering until idle";
    default:
      return "Unknown";
  }
};

const APStatusForm: FC = () => {
  const { loadData, data, errorMessage } = useRest<APStatus>({ read: APApi.readAPStatus });

  const theme = useTheme();

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    return (
      <>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: apStatusHighlight(data, theme) }}>
                <SettingsInputAntennaIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Status" secondary={apStatus(data)} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#4CAF50' }}>
                <IpIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="IP Address" secondary={data.ip_address} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#FF9800' }}>
                <DeviceHubIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="MAC Address" secondary={data.mac_address} />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#2196F3' }}>
                <GroupIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="AP Clients" secondary={data.station_num} />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
        <ButtonRow pt={1}>
          <Button 
            startIcon={<RefreshIcon />} 
            variant="contained" 
            onClick={loadData}
            sx={{
              background: 'linear-gradient(45deg, #9C27B0 30%, #7B1FA2 90%)',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              color: 'white',
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(156, 39, 176, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7B1FA2 30%, #6A1B9A 90%)',
                boxShadow: '0 12px 20px rgba(156, 39, 176, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Refresh Status
          </Button>
        </ButtonRow>
      </>
    );
  };

  return (
    <SectionContent title='Access Point Status' titleGutter>
      {content()}
    </SectionContent>
  );

};

export default APStatusForm;
