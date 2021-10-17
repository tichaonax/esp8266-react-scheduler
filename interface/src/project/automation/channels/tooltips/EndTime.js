import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

export const EndTime = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Schedule End Time</Typography>
              {"When 'End Time' is less than 'Start Time' schedule spans into following day"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>End Time</Button>
        </HtmlTooltip>
    );
  }
