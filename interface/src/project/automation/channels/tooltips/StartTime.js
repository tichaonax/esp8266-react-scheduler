import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
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
  };

