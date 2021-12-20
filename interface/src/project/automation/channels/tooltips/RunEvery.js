/* eslint-disable max-len */
import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { HtmlTooltip } from './HtmlTooltip';

export const RunEvery = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Run Every Time Period</Typography>
              <em>{"When Enable Timespan"}</em> <b>{'in-active'}</b> {' '}
              {"the switch is activated on every elapse of this period. When 'Randomize Switch' is enabled the ON time is randomly delayed within in the period."}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Run Every</Button>
        </HtmlTooltip>
    );
  };
