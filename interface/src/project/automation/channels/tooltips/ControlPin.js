import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

export const ControlPin = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>GPIO Pin</Typography>
              {"GPIO pin to control the relay"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>GPIO Pin</Button>
        </HtmlTooltip>
    );
  }
