import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';
import { Schedule } from './../../types';

export const TimeSpanEnabled = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Enable Timespan Schedule</Typography>
              <em>{"Switch is "}</em> <b>{'ON'}</b> {' '}
              {"from 'Start-Time' to 'End-Time'. When checked 'Randomize Switch' is disabled"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Enable Timespan</Button>
        </HtmlTooltip>
    );
  }
