import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const RemoteConfigEnabled = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Remote Config Enabled</Typography>
              <em>{"Remote device configuration"}</em> <b>{'enabled'}</b> {' '}
              {"when checked"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Enable Remote Device Configuration</Button>
        </HtmlTooltip>
    );
  };
