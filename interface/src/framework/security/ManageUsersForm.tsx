import React, { FC, useContext, useState } from 'react';

import {
  Button, IconButton, Table, TableBody, TableCell, TableFooter, TableHead, TableRow,
  Box, Typography, Fade, useTheme, Chip, Avatar
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

import * as SecurityApi from "../../api/security";
import { SecuritySettings, User } from '../../types';
import { FormLoader } from '../../components';
import { createUserValidator } from '../../validators';
import { useRest } from '../../utils';
import { AuthenticatedContext } from '../../contexts/authentication';

import UserForm from './UserForm';

function compareUsers(a: User, b: User) {
  if (a.username < b.username) {
    return -1;
  }
  if (a.username > b.username) {
    return 1;
  }
  return 0;
}

const useStyles = makeStyles((theme: any) => createStyles({
  securityContainer: {
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  securityCard: {
    background: theme.palette.mode === 'dark'
      ? 'rgba(18, 18, 18, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.5)'
      : '0 20px 40px rgba(0,0,0,0.1)',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  headerTitle: {
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  modernTable: {
    '& .MuiTableHead-root': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #2c1810 0%, #3d2817 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      '& .MuiTableCell-head': {
        color: 'white',
        fontWeight: 600,
        fontSize: '1rem',
      },
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        '&:nth-of-type(even)': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
        },
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(102, 126, 234, 0.2)'
            : 'rgba(102, 126, 234, 0.1)',
        },
      },
    },
    '& .MuiTableCell-root': {
      borderBottom: theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.06)'
        : '1px solid rgba(0, 0, 0, 0.06)',
      padding: theme.spacing(2),
      color: theme.palette.text.primary,
    },
  },
  userChip: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  adminChip: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)'
      : 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
    color: 'white',
  },
  regularChip: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)'
      : 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)',
    color: 'white',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
  },
  addButton: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)'
      : 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: theme.spacing(3),
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #2e7d32 30%, #1b5e20 90%)'
        : 'linear-gradient(45deg, #45a049 30%, #388e3c 90%)',
    },
  },
  saveButton: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
      : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: theme.spacing(3),
    padding: theme.spacing(1.5, 4),
    fontSize: '1.1rem',
    '&:hover': {
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #4c5bd8 30%, #5a3d90 90%)'
        : 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
    },
  },
}));

const SecuritySettingsForm: FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    loadData, saving, data, setData, saveData, errorMessage
  } = useRest<SecuritySettings>({ read: SecurityApi.readSecuritySettings, update: SecurityApi.updateSecuritySettings });

  const [user, setUser] = useState<User>();
  const [creating, setCreating] = useState<boolean>(false);
  const authenticatedContext = useContext(AuthenticatedContext);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const noAdminConfigured = () => !data.users.find((u) => u.admin);

    const removeUser = (toRemove: User) => {
      const users = data.users.filter((u) => u.username !== toRemove.username);
      setData({ ...data, users });
    };

    const createUser = () => {
      setCreating(true);
      setUser({
        username: "",
        password: "",
        admin: true
      });
    };

    const editUser = (toEdit: User) => {
      setCreating(false);
      setUser({ ...toEdit });
    };

    const cancelEditingUser = () => {
      setUser(undefined);
    };

    const doneEditingUser = () => {
      if (user) {
        const users = [...data.users.filter((u) => u.username !== user.username), user];
        setData({ ...data, users });
        setUser(undefined);
      }
    };

    const onSubmit = async () => {
      await saveData();
      authenticatedContext.refresh();
    };

    return (
      <Fade in timeout={600}>
        <Box className={classes.securityContainer}>
          <Box className={classes.securityCard}>
            {/* Header Section */}
            <Box className={classes.headerSection}>
              <Typography variant="h4" className={classes.headerTitle}>
                <PeopleIcon sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                User Management
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Manage user accounts and administrator privileges
              </Typography>
            </Box>

            {/* Users Table */}
            <Table className={classes.modernTable}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Username
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                      Role
                    </Box>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users.sort(compareUsers).map((u) => (
                  <TableRow key={u.username}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: u.admin ? '#F44336' : '#2196F3', 
                          width: 32, 
                          height: 32, 
                          mr: 2,
                          fontSize: '0.9rem'
                        }}>
                          {u.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" fontWeight={600}>
                          {u.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={u.admin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                        label={u.admin ? 'Administrator' : 'Regular User'}
                        className={`${classes.userChip} ${u.admin ? classes.adminChip : classes.regularChip}`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box className={classes.actionButtons}>
                        <IconButton 
                          size="small" 
                          aria-label="Edit" 
                          onClick={() => editUser(u)}
                          sx={{ 
                            color: '#FF9800',
                            '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          aria-label="Delete" 
                          onClick={() => removeUser(u)}
                          sx={{ 
                            color: '#F44336',
                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="center" padding="normal">
                    <Button 
                      startIcon={<PersonAddIcon />} 
                      variant="contained" 
                      onClick={createUser}
                      className={classes.addButton}
                    >
                      Add User
                    </Button>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            {/* Warning Message */}
            {noAdminConfigured() && (
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                backgroundColor: theme.palette.mode === 'dark' ? '#2e1f1f' : '#FFF3E0',
                borderRadius: 2,
                border: theme.palette.mode === 'dark' ? '1px solid #d32f2f' : '1px solid #FFB74D',
                display: 'flex',
                alignItems: 'center'
              }}>
                <AdminPanelSettingsIcon sx={{ color: '#FF9800', mr: 1 }} />
                <Typography 
                  color={theme.palette.mode === 'dark' ? '#ffab91' : '#E65100'} 
                  fontWeight={600}
                >
                  You must have at least one admin user configured.
                </Typography>
              </Box>
            )}

            {/* Save Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                startIcon={<SaveIcon />}
                disabled={saving || noAdminConfigured()}
                variant="contained"
                type="submit"
                onClick={onSubmit}
                className={classes.saveButton}
              >
                {saving ? 'Saving Users...' : 'Save Changes'}
              </Button>
            </Box>

            <UserForm
              user={user}
              setUser={setUser}
              creating={creating}
              onDoneEditing={doneEditingUser}
              onCancelEditing={cancelEditingUser}
              validator={createUserValidator(data.users, creating)}
            />
          </Box>
        </Box>
      </Fade>
    );
  };

  return content();
};

export default SecuritySettingsForm;
