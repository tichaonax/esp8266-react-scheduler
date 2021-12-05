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
              {"GPIO pin to control the relay, to change temporarily disable schedule and click save to take effect"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Control GPIO Pin</Button>
        </HtmlTooltip>
    );
  }
