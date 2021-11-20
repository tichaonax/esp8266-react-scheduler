import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

  export const SwitchType = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Homeassistant Entity Type</Typography>
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>HA Type</Button>
        </HtmlTooltip>
    );
  }