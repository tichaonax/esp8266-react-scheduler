import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

export const HotTime = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Schedule Hot Time Duration</Typography>
              <em>{"When Randomize feature"}</em> <b>{'active'}</b> {' '}
              {"this is the minimum time switch will remain ON/OFF after user activated"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Hot Time</Button>
        </HtmlTooltip>
    );
  }
