import { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid2';
import { profileService } from '../services/supabaseService';
import { useUser } from '../hooks/useUser';
import { validateEmail, validatePhone } from '../utils/validators';
import ProfileSkeleton from '../components/LoadingSkeleton';

/**
 * PersonalProfile component for displaying and managing user profile information
 * @returns {JSX.Element} - Rendered PersonalProfile component
 */
export default function PersonalProfile() {
  const { selectedUserId } = useUser();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  /**
   * fetchUserProfile function to fetch user profile from SupabaseService
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await profileService.fetchProfile(selectedUserId);
      
      if (error) throw error;
      
      setUserData(data);
      setTempData(data);
    } catch (error) {
      console.error('Error loading profile:', error.message);
      setSnackbar({ severity: 'error', message: 'Failed to load profile data' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserProfile();
    }
  }, [selectedUserId, fetchUserProfile]);

  const handleEdit = () => {
    setTempData(userData);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setTempData(userData);
  };

  /**
   * validateForm function to validate the form data
   * @returns {boolean} - Whether the form data is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!tempData?.firstname?.trim()) newErrors.firstname = 'First name is required';
    if (!tempData?.lastname?.trim()) newErrors.lastname = 'Last name is required';
    
    // Email validation
    if (!validateEmail(tempData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (tempData?.phone && !validatePhone(tempData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setOpenDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await profileService.updateProfile(selectedUserId, tempData);
      
      if (error) throw error;

      setUserData(tempData);
      setEditMode(false);
      setOpenDialog(false);
      setSnackbar({ severity: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setSnackbar({ severity: 'error', message: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setTempData({ ...tempData, [field]: event.target.value });
  };

  if (isLoading) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <ProfileSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6" component="h2">
            User Profile
          </Typography>
        </Box>

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
            {`${userData?.firstname[0]}${userData?.lastname[0]}`}
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom>
              {userData?.firstname} {userData?.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since: {userData?.dateCreated}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'primary.secondary',
                textTransform: 'capitalize',
                fontWeight: 'medium',
                mt: 0.5
              }}
            >
              Role: {userData?.role || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Grid 
            container 
            spacing={2}
            columns={12}
          >
            <Grid xs={6} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={tempData?.firstname}
                onChange={handleChange('firstname')}
                disabled={!editMode}
                error={!!errors.firstname}
                helperText={errors.firstname}
                required
                aria-label="First Name"
                aria-required="true"
              />
            </Grid>
            <Grid xs={6} md={6}>
              <TextField
                fullWidth
                value={tempData?.lastname}
                onChange={handleChange('lastname')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>

            <Grid xs={6} md={6}>
              <TextField
                fullWidth
                value={tempData?.email}
                onChange={handleChange('email')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>
            <Grid xs={6} md={6}>
              <TextField
                fullWidth
                value={tempData?.phone}
                onChange={handleChange('phone')}
                disabled={!editMode}
                variant="outlined"
              />
            </Grid>

            <Grid xs={12} md={12}>
              <TextField
                fullWidth
                value={tempData?.address}
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

      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </Card>
  );
}
