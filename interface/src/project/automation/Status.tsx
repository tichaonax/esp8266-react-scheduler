import { FC } from 'react';

import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";

import { useLayoutTitle } from '../../components';

import ChannelOneStateWebSocketForm from './channels/ws/ChannelOneStateWebSocketForm';
import ChannelTwoStateWebSocketForm from './channels/ws/ChannelTwoStateWebSocketForm';
import ChannelThreeStateWebSocketForm from './channels/ws/ChannelThreeStateWebSocketForm';
import ChannelFourStateWebSocketForm from './channels/ws/ChannelFourStateWebSocketForm';
import { RemoteUtils } from './utils/remoteUtils';

const useStyles = makeStyles((theme: Theme) => createStyles({
  flexContainer: {
    display: "flex",
    flexWrap: "wrap",
  },

  flexChild: {
    flex: "1",
    margin: theme.spacing(1),
  },

  muiListItemGutters: {
    width: "100%",
    margin: theme.spacing(1),
  },
}));

const Status: FC = () => {
  const classes = useStyles();
  const {
    channelOne,
    channelTwo,
    channelThree,
    channelFour,
  } = RemoteUtils.getDeviceHost();

  useLayoutTitle("Status");
  return (
    <>
      <div className={classes.flexContainer}>
        { channelOne ?
          <div className={classes.flexChild}>
            <div>
              <div className={classes.muiListItemGutters}><ChannelOneStateWebSocketForm/> </div>
            </div>
          </div> : null}
        { channelTwo ?
          <div className={classes.flexChild}>
            <div>
              <div className={classes.muiListItemGutters}><ChannelTwoStateWebSocketForm/></div>
            </div>
          </div> : null}
        { channelThree ?
          <div className={classes.flexChild}>
            <div>
              <div className={classes.muiListItemGutters}><ChannelThreeStateWebSocketForm/></div>
            </div>
          </div> : null}
        { channelFour ?
          <div className={classes.flexChild}>
            <div>
              <div className={classes.muiListItemGutters}><ChannelFourStateWebSocketForm/></div>
            </div>
          </div> : null}
      </div>
    </>
  );
};

export default Status;
