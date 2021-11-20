import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { HtmlTooltip } from './HtmlTooltip';

export const ScheduleEnabled = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Schedule Enabled</Typography>
              <em>{"Schedule"}</em> <b>{'active'}</b> {' '}
              {"when checked"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Enable Schedule</Button>
        </HtmlTooltip>
    );
  }
