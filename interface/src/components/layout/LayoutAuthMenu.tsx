import React, { FC, useContext } from "react";

import { 
  Box, 
  Button, 
  Divider, 
  IconButton, 
  Popover, 
  Typography, 
  Avatar, 
  Fade,
  Chip
} from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";

import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { AuthenticatedContext } from "../../contexts/authentication";


const useStyles = makeStyles((theme: any) => createStyles({
  authMenuButton: {
    padding: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '50%',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 0 20px rgba(79, 195, 247, 0.3)'
        : '0 0 20px rgba(33, 150, 243, 0.3)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
      filter: theme.palette.mode === 'dark'
        ? 'drop-shadow(0 0 8px rgba(79, 195, 247, 0.5))'
        : 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.3))',
    },
  },
  popoverPaper: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      : '0 8px 32px 0 rgba(102, 126, 234, 0.25)',
    minWidth: 280,
    overflow: 'hidden',
  },
  userSection: {
    padding: theme.spacing(3),
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(41, 182, 246, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
  },
  userAvatar: {
    width: 64,
    height: 64,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)'
      : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(79, 195, 247, 0.3)'
      : '0 4px 20px rgba(33, 150, 243, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 6px 30px rgba(79, 195, 247, 0.4)'
        : '0 6px 30px rgba(33, 150, 243, 0.4)',
    },
  },
  userName: {
    fontWeight: 700,
    fontSize: '1.2rem',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #4fc3f7 30%, #29b6f6 90%)'
      : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(0.5),
  },
  userRole: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  roleChip: {
    height: 24,
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  adminChip: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(156, 39, 176, 0.2)'
      : 'rgba(156, 39, 176, 0.1)',
    color: '#9c27b0',
    border: '1px solid rgba(156, 39, 176, 0.3)',
  },
  guestChip: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(76, 175, 80, 0.2)'
      : 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  },
  divider: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
      : 'linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%)',
    height: 1,
    border: 'none',
  },
  signOutSection: {
    padding: theme.spacing(2),
  },
  signOutButton: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
      : 'linear-gradient(135deg, #f44336 0%, #c62828 100%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1.5, 3),
    textTransform: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.2)',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #ef5350 0%, #f44336 100%)'
        : 'linear-gradient(135deg, #ef5350 0%, #d32f2f 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 25px rgba(244, 67, 54, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
}));

const LayoutAuthMenu: FC = () => {
  const classes = useStyles();
  const { me, signOut } = useContext(AuthenticatedContext);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = anchorEl ? 'app-menu-popover' : undefined;

  return (
    <>
      <IconButton
        id="open-auth-menu"
        className={classes.authMenuButton}
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
      >
        <AccountCircleIcon />
      </IconButton>
      <Popover
        id="app-menu-popover"
        sx={{ mt: 1 }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.popoverPaper,
        }}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        {/* User Information Section */}
        <Box className={classes.userSection}>
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <Avatar className={classes.userAvatar}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box flex={1}>
              <Typography className={classes.userName}>
                {me.username}
              </Typography>
              <Box className={classes.userRole}>
                <Chip
                  icon={me.admin ? <AdminPanelSettingsIcon /> : <PersonOutlineIcon />}
                  label={me.admin ? "Admin User" : "Guest User"}
                  className={`${classes.roleChip} ${me.admin ? classes.adminChip : classes.guestChip}`}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider className={classes.divider} />

        {/* Sign Out Section */}
        <Box className={classes.signOutSection}>
          <Button
            variant="contained"
            fullWidth
            className={classes.signOutButton}
            onClick={() => signOut(true)}
            startIcon={<ExitToAppIcon />}
          >
            Sign Out
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default LayoutAuthMenu;
