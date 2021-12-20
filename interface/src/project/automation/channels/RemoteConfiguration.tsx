import { FC } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { RemoteUtils } from '../utils/remoteUtils';

const useStyles = makeStyles({
    alert: {
      color: "#fc0303"
    },
    ip: {
      color: "#2205fa"
    }
  });

const RemoteConfiguration: FC = () => {
  const classes = useStyles();
  return (
    <>
    {RemoteUtils.isRemoteIpDevice() &&
    <Typography variant="body1" color="secondary"className={classes.alert} >
       Device:
       <span className={classes.ip}>{RemoteUtils.getRemoteDeviceIp()}</span>
    </Typography>}
    </>
  );
};

export default RemoteConfiguration;
