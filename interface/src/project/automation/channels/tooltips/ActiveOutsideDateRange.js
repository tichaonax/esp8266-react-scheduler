import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const ActiveOutsideDateRange = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Outside Date Range</Typography>
              <em>{"Device active outside selected date range when "}</em> <b>{'checked'}</b> {' '}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Active Outside Date Range</Button>
        </HtmlTooltip>
    );
  };
