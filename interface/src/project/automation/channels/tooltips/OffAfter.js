/* eslint-disable max-len */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { HtmlTooltip } from './HtmlTooltip';

export const OffAfter = () => {
    return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography align="center" style={{color:"#00ff00"}}>Off After Duration</Typography>
              {"duration switch will turn OFF after activation with 'Run Every'. When 'Randomize Switch' is enabled the duration varies within that time period."}
            </React.Fragment>
          }
        >
            <Button style={{textTransform: 'none'}}>Off After</Button>
        </HtmlTooltip>
    );
  };

