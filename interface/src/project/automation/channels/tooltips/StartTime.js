import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

export const StartTime = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Schedule Start Time</Typography>
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Start Time</Button>
        </HtmlTooltip>
    );
  }
