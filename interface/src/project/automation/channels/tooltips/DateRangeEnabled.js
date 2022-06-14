import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const DateRangeEnabled = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Date Range Enabled</Typography>
              <em>{"Date Range Enabled"}</em> <b>{'enabled'}</b> {' '}
              {"when checked"}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Enable Date Range</Button>
        </HtmlTooltip>
    );
  };
