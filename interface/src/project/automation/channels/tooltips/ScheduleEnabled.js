import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const ScheduleEnabled = ({buildVersion}) => {
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
            <Button style={{textTransform: 'none'}}>Enable Schedule (build:{buildVersion ? buildVersion : '-.-.-'})</Button>
        </HtmlTooltip>
    );
  };

