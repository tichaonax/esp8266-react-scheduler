import React, { FC, useState, useEffect } from 'react';
import Schema, { ValidateFieldsError } from 'async-validator';

import { 
  Button, 
  Checkbox, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Box, 
  Typography, 
  Avatar, 
  Switch,
  useTheme 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { User } from '../../types';
import { BlockFormControlLabel, ValidatedPasswordField, ValidatedTextField } from '../../components';
import { validate } from '../../validators';
import { updateValue } from '../../utils';

interface UserFormProps {
  creating: boolean;
  validator: Schema;

  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;

  onDoneEditing: () => void;
  onCancelEditing: () => void;
}

const UserForm: FC<UserFormProps> = ({ creating, validator, user, setUser, onDoneEditing, onCancelEditing }) => {
  const theme = useTheme();
  const updateFormValue = updateValue(setUser);
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const open = !!user;

  useEffect(() => {
    if (open) {
      setFieldErrors(undefined);
    }
  }, [open]);

  const validateAndDone = async () => {
    if (user) {
      try {
        setFieldErrors(undefined);
        await validate(validator, user);
        onDoneEditing();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    }
  };

  return (
    <Dialog 
      onClose={onCancelEditing} 
      aria-labelledby="user-form-dialog-title" 
      open={!!user} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      {
        user &&
        <>
          <DialogTitle 
            id="user-form-dialog-title"
            sx={{
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
              py: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 2 }}>
                {creating ? <PersonIcon /> : <AdminPanelSettingsIcon />}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                {creating ? 'Add New User' : 'Modify User'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            <ValidatedTextField
              fieldErrors={fieldErrors}
              name="username"
              label="Username"
              fullWidth
              variant="outlined"
              value={user.username}
              disabled={!creating}
              onChange={updateFormValue}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <ValidatedPasswordField
              fieldErrors={fieldErrors}
              name="password"
              label="Password"
              fullWidth
              variant="outlined"
              value={user.password}
              onChange={updateFormValue}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(102, 126, 234, 0.2)'
                : 'rgba(102, 126, 234, 0.1)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettingsIcon sx={{ 
                  color: theme.palette.mode === 'dark' ? '#8fa4ea' : '#667eea', 
                  mr: 1 
                }} />
                <Typography variant="body1" fontWeight={600} color={theme.palette.text.primary}>
                  Administrator Privileges
                </Typography>
              </Box>
              <Switch
                name="admin"
                checked={user.admin}
                onChange={updateFormValue}
                color="primary"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={onCancelEditing}
              startIcon={<CancelIcon />}
              sx={{
                backgroundColor: '#f44336',
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  backgroundColor: '#d32f2f',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={validateAndDone}
              startIcon={<SaveIcon />}
              autoFocus
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)'
                  : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                borderRadius: 3,
                px: 3,
                '&:hover': {
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #4c5bd8 30%, #5a3d90 90%)'
                    : 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                }
              }}
            >
              {creating ? 'Create User' : 'Save Changes'}
            </Button>
          </DialogActions>
        </>
      }
    </Dialog>
  );
};

export default UserForm;
