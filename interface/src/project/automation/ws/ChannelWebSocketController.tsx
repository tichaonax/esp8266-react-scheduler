import React from 'react';
import { SectionContent } from '../../../components';
import { CHANNEL_ONE, CHANNEL_TWO, CHANNEL_THREE, CHANNEL_FOUR } from '../../../api';

import ChannelOneWebSocketController from './ChannelOneWebSocketController';
import ChannelTwoWebSocketController from './ChannelTwoWebSocketController';
import ChannelThreeWebSocketController from './ChannelThreeWebSocketController';
import ChannelFourWebSocketController from './ChannelFourWebSocketController';
import { Divider, Paper, makeStyles, Theme, createStyles } from '@material-ui/core';

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
    width: "300px",
    margin: theme.spacing(1),
  },
}));

const ChannelWebSocketController = () => {
    const classes = useStyles();
    return (
      <SectionContent title='' titleGutter>
        <div className={classes.flexContainer}>
          <div className={classes.flexChild}>
            {(CHANNEL_ONE === 'true') && 
            <Paper>
              <div className={classes.muiListItemGutters}><Divider/><ChannelOneWebSocketController/> </div>
            </Paper>}
          </div>
          <div className={classes.flexChild}>
            {(CHANNEL_TWO === 'true') &&
            <Paper>
              <div className={classes.muiListItemGutters}><Divider/><ChannelTwoWebSocketController/></div>
            </Paper>}
          </div>
          <div className={classes.flexChild}>
            {(CHANNEL_THREE === 'true') &&
            <Paper>
              <div className={classes.muiListItemGutters}><Divider/><ChannelThreeWebSocketController/></div>
            </Paper>}
          </div>
          <div className={classes.flexChild}>
            {(CHANNEL_FOUR === 'true') &&
            <Paper>
              <div className={classes.muiListItemGutters}><Divider/><ChannelFourWebSocketController/></div>
            </Paper>}
          </div>
         </div>
      </SectionContent>
    )
  }

export default ChannelWebSocketController;