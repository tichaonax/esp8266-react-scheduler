import React from 'react';
import { Typography } from '@material-ui/core';
import { WebSocketFormProps } from '../../components';

import { SystemState } from './redux/types/system';

type SystemStateWebSocketControllerFormProps = WebSocketFormProps<SystemState>;

const SystemStateWebSocketControllerForm = (props: SystemStateWebSocketControllerFormProps) => {
  const { data} = props;

  return (
        <Typography variant="overline">{data.localDateTime.substr(0, data.localDateTime.lastIndexOf(':'))}</Typography>
  );
}

export default SystemStateWebSocketControllerForm;
