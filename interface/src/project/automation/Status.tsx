import React, { FC } from 'react';

import { Theme } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";

import { useLayoutTitle } from '../../components';

import ChannelOneStatus from './channels/status/ChannelOneStatus';
import ChannelTwoStatus from './channels/status/ChannelTwoStatus';
import ChannelThreeStatus from './channels/status/ChannelThreeStatus';
import ChannelFourStatus from './channels/status/ChannelFourStatus';
import { RemoteUtils } from './utils/remoteUtils';

const useStyles = makeStyles((theme: Theme) => createStyles({
  flexContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column", // Stack vertically on mobile
      gap: theme.spacing(0.5),
      padding: theme.spacing(0.5),
    },
  },

  flexChild: {
    flex: "1",
    minWidth: 0, // Allow shrinking below content size
    [theme.breakpoints.down('sm')]: {
      flex: "none", // Don't flex on mobile
      width: "100%", // Full width on mobile
    },
  },

  muiListItemGutters: {
    width: "100%",
    margin: 0, // Remove margin to prevent overflow
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

  const [refreshTrigger] = React.useState(0);

  useLayoutTitle("Status");

  return (
    <div className={classes.flexContainer}>
      { channelOne ?
        <div className={classes.flexChild}>
          <div>
            <div className={classes.muiListItemGutters}>
              <ChannelOneStatus refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div> : null}
      { channelTwo ?
        <div className={classes.flexChild}>
          <div>
            <div className={classes.muiListItemGutters}>
              <ChannelTwoStatus refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div> : null}
      { channelThree ?
        <div className={classes.flexChild}>
          <div>
            <div className={classes.muiListItemGutters}>
              <ChannelThreeStatus refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div> : null}
      { channelFour ?
        <div className={classes.flexChild}>
          <div>
            <div className={classes.muiListItemGutters}>
              <ChannelFourStatus refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div> : null}
    </div>
  );
};

export default Status;
