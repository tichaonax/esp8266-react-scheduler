import React, { FC, useContext } from 'react';

import { Avatar, Badge, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';

import { WiFiEncryptionType, WiFiNetwork, WiFiNetworkList } from '../../types';

import { WiFiConnectionContext } from './WiFiConnectionContext';
import { MessageBox } from '../../components';

interface WiFiNetworkSelectorProps {
  networkList: WiFiNetworkList;
}

export const isNetworkOpen = ({ encryption_type }: WiFiNetwork) => encryption_type === WiFiEncryptionType.WIFI_AUTH_OPEN;

export const networkSecurityMode = ({ encryption_type }: WiFiNetwork) => {
  switch (encryption_type) {
    case WiFiEncryptionType.WIFI_AUTH_WEP:
    case WiFiEncryptionType.WIFI_AUTH_WEP_PSK:
      return "WEP";
    case WiFiEncryptionType.WIFI_AUTH_WEP2_PSK:
      return "WEP2";
    case WiFiEncryptionType.WIFI_AUTH_WPA_WPA2_PSK:
      return "WPA/WEP2";
    case WiFiEncryptionType.WIFI_AUTH_WPA2_ENTERPRISE:
      return "WEP2 Enterprise";
    case WiFiEncryptionType.WIFI_AUTH_OPEN:
      return "None";
    default:
      return "Unknown";
  }
};

// Get WiFi signal strength icon based on RSSI
const getSignalIcon = (rssi: number) => {
  if (rssi >= -50) return SignalWifi4BarIcon; // Excellent signal (4 bars)
  if (rssi >= -60) return SignalWifi3BarIcon; // Good signal (3 bars)
  if (rssi >= -70) return SignalWifi2BarIcon; // Fair signal (2 bars)
  if (rssi >= -80) return SignalWifi1BarIcon; // Poor signal (1 bar)
  return SignalWifiOffIcon; // Very poor signal (no signal)
};

// Get WiFi signal strength color based on RSSI
const getSignalColor = (rssi: number) => {
  if (rssi >= -50) return '#4CAF50'; // Green - Excellent
  if (rssi >= -60) return '#8BC34A'; // Light Green - Good
  if (rssi >= -70) return '#FF9800'; // Orange - Fair
  if (rssi >= -80) return '#F44336'; // Red - Poor
  return '#9E9E9E'; // Grey - Very poor
};

// Get security icon based on encryption type
const getSecurityIcon = ({ encryption_type }: WiFiNetwork) => {
  switch (encryption_type) {
    case WiFiEncryptionType.WIFI_AUTH_WEP:
    case WiFiEncryptionType.WIFI_AUTH_WEP_PSK:
      return LockIcon;
    case WiFiEncryptionType.WIFI_AUTH_WEP2_PSK:
      return ShieldIcon;
    case WiFiEncryptionType.WIFI_AUTH_WPA_WPA2_PSK:
      return SecurityIcon;
    case WiFiEncryptionType.WIFI_AUTH_WPA2_ENTERPRISE:
      return SecurityIcon;
    case WiFiEncryptionType.WIFI_AUTH_OPEN:
      return NoEncryptionIcon;
    default:
      return LockIcon;
  }
};

// Get security color based on encryption type
const getSecurityColor = ({ encryption_type }: WiFiNetwork) => {
  switch (encryption_type) {
    case WiFiEncryptionType.WIFI_AUTH_WEP:
    case WiFiEncryptionType.WIFI_AUTH_WEP_PSK:
      return '#FF9800'; // Orange - Less secure
    case WiFiEncryptionType.WIFI_AUTH_WEP2_PSK:
      return '#2196F3'; // Blue - Good security
    case WiFiEncryptionType.WIFI_AUTH_WPA_WPA2_PSK:
      return '#4CAF50'; // Green - Good security
    case WiFiEncryptionType.WIFI_AUTH_WPA2_ENTERPRISE:
      return '#9C27B0'; // Purple - Enterprise security
    case WiFiEncryptionType.WIFI_AUTH_OPEN:
      return '#F44336'; // Red - No security
    default:
      return '#9E9E9E'; // Grey - Unknown
  }
};

const WiFiNetworkSelector: FC<WiFiNetworkSelectorProps> = ({ networkList }) => {
  const wifiConnectionContext = useContext(WiFiConnectionContext);

  const renderNetwork = (network: WiFiNetwork) => {
    const SecurityIcon = getSecurityIcon(network);
    const SignalIcon = getSignalIcon(network.rssi);
    const securityColor = getSecurityColor(network);
    const signalColor = getSignalColor(network.rssi);
    
    return (
      <ListItem key={network.bssid} button onClick={() => wifiConnectionContext.selectNetwork(network)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: securityColor }}>
            <SecurityIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={network.ssid}
          secondary={"Security: " + networkSecurityMode(network) + ", Ch: " + network.channel + ", Signal: " + network.rssi + "dBm"}
        />
        <ListItemIcon>
          <Badge 
            badgeContent={network.rssi + "dBm"} 
            sx={{ 
              '& .MuiBadge-badge': { 
                backgroundColor: signalColor,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem'
              }
            }}
          >
            <SignalIcon sx={{ color: signalColor, fontSize: '1.5rem' }} />
          </Badge>
        </ListItemIcon>
      </ListItem>
    );
  };

  if (networkList.networks.length === 0) {
    return (
      <MessageBox mt={2} mb={1} message="No WiFi networks found" level="info" />
    );
  }

  return (
    <List>
      {networkList.networks.map(renderNetwork)}
    </List>
  );

};

export default WiFiNetworkSelector;
