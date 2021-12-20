import { FC } from 'react';
import { useNavigate  } from "react-router-dom";
import { useLocation } from 'react-router';
import { ListItem, ListItemText, Switch, Typography } from '@mui/material';

import { BlockFormControlLabel, FormLoader, SectionContent } from '../../../../components';
import { updateValue, useWs } from '../../../../utils';

import { ChannelState} from '../../redux/types/channel';
import { RemoteUtils } from '../../utils/remoteUtils';
import { ChannelStateWebSocketFormProps } from './ws';
import { REMOTE_WEB_SOCKET_ROOT } from '../../api/remote';
import { WEB_SOCKET_ROOT } from '../../../../api/endpoints';
import RemoteConfiguration from '../RemoteConfiguration';

const ChannelStateWebSocketForm: FC<ChannelStateWebSocketFormProps> = ({websocketEndPoint}) => {
  const { connected, updateData, data } = useWs<ChannelState>(
    (RemoteUtils.isRemoteIpDevice() ? REMOTE_WEB_SOCKET_ROOT : WEB_SOCKET_ROOT)
    + websocketEndPoint);
  const updateFormValue = updateValue(updateData);
  const pathname = useLocation().pathname;
  const showLink = pathname.includes('/status');
  const navigate  = useNavigate ();
  const onClick = () => navigate(RemoteUtils.getNavigationLink('auto', data?.restChannelEndPoint));

  const content = () => {
    if (!connected || !data) {
      return (<FormLoader message="Connecting to WebSocket…" />);
    }
    return (
      <>
        <RemoteConfiguration/>
        <Typography variant="subtitle1">{data.name}</Typography>
        <Typography variant="body2">{`Channel control pin ${data.controlPin}`}</Typography>
        <ListItem>
        <BlockFormControlLabel
            control={
              <Switch
                name="controlOn"
                checked={data.controlOn}
                onChange={updateFormValue}
                color="primary"
              />
            }
            label="Switch Status"
        />
        <ListItemText
          primary={`Scheduled ${data.nextRunTime.substr(0, data.nextRunTime.lastIndexOf(' '))}`}
          secondary={`Last status at ${data.lastStartedChangeTime.substr(0, data.lastStartedChangeTime.lastIndexOf(' '))}`}
        />
        </ListItem>
        {showLink && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Typography variant="body1"><a onClick={onClick} href="#">Schedule</a></Typography>)}
        <Typography variant="overline">
          {`IP: ${data.IPAddress} Time: ${data.localDateTime.substr(0,data.localDateTime.lastIndexOf(':'))}`}
        </Typography>
      </>
    );
  };

  return (
    <SectionContent title='Switch Status' titleGutter>
      {content()}
    </SectionContent>
  );
};

export default ChannelStateWebSocketForm;
