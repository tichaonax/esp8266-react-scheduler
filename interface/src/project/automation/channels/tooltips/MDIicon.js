import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

  export const MDIIcon = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Homeassistant MDI Icon</Typography>
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>HA Icon</Button>
        </HtmlTooltip>
    );
  }