import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const MinimumRunTime = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Schedule Minimum RunTime</Typography>
              <em>{"When Randomize feature"}</em> <b>{'active'}</b> {' '}
              {"this is the minimum time switch will remain ON/OFF after user activated"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Minimum Runtime</Button>
        </HtmlTooltip>
    );
  };

