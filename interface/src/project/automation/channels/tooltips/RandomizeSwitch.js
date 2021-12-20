import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const RandomizeSwitch = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Randomize Switch Function</Typography>
              <em>{"When the feature is "}</em> <b>{'active'}</b> {' '}
              {"the 'ON' and 'OFF' time periods are randomized with in the 'Run Every' and 'Off After' bounds"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Randomize Switch</Button>
        </HtmlTooltip>
    );
  };

