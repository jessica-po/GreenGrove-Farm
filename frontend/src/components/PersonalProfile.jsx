import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';

// Prop type validation
PersonalProfile.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

// Add default props
PersonalProfile.defaultProps = {
  sx: {},
};

// DUMMY user data - replace with actual user data
const initialUserData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  address: '123 Main St, City, Country',
  phone: '+1 234 567 8900',
  dateCreated: new Date('2024-01-01').toLocaleDateString(),
  dateUpdated: new Date().toLocaleDateString(),
};

export default function PersonalProfile() {
  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(userData);
  const [snackbar, setSnackbar] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEdit = () => {
    setTempData(userData);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTempData(userData);
  };

  const handleSave = () => {
    setOpenDialog(true);
  };

  const handleConfirmSave = () => {
    setUserData(tempData);
    setEditMode(false);
    setOpenDialog(false);
    setSnackbar({ severity: 'success', message: 'Profile updated successfully!' });
  };

  const handleChange = (field) => (event) => {
    setTempData({ ...tempData, [field]: event.target.value });
  };

  return (
    <Card sx={{ 
      width: '75vw',
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: 'success.main',
              fontSize: '2rem',
              mr: 2 
            }}
          >
            {`${userData.firstname[0]}${userData.lastname[0]}`}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {userData.firstname} {userData.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {userData.dateCreated}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Grid 
            container 
            spacing={2}
            columns={12}
          >
            <Grid xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={tempData.firstname}
                onChange={handleChange('firstname')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={tempData.lastname}
                onChange={handleChange('lastname')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>

            <Grid xs={6}>
              <TextField
                fullWidth
                label="Email"
                value={tempData.email}
                onChange={handleChange('email')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                fullWidth
                label="Phone"
                value={tempData.phone}
                onChange={handleChange('phone')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={tempData.address}
                onChange={handleChange('address')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          mt: 'auto' 
        }}>
          {!editMode ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          Are you sure you want to save these changes to your profile?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmSave} color="success" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity}
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
