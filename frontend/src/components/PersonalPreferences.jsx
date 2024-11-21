import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Box,
  Button,
  Snackbar,
  Alert,
  Divider,
  FormControl,
  RadioGroup,
  Radio,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { profileService } from '../services/supabaseService';
import { useUser } from '../hooks/useUser';

export default function PersonalPreferences() {
  const { selectedUserId } = useUser();
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    marketingEmails: false,
    eventReminders: false,
    newsletterSubscription: false,
    theme: 'light',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const fetchUserPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await profileService.fetchProfile(selectedUserId);
      
      if (error) throw error;

      const notificationType = data.preferences?.notifications || 'none';
      
      setPreferences({
        emailNotifications: notificationType === 'email',
        smsNotifications: notificationType === 'sms',
        pushNotifications: notificationType === 'push',
        marketingEmails: data.preferences?.marketing_emails || false,
        eventReminders: data.preferences?.event_reminders || false,
        newsletterSubscription: data.preferences?.newsletter || false,
        theme: data.preferences?.theme || 'light',
      });
    } catch (error) {
      console.error('Error loading preferences:', error.message);
      setSnackbar({ severity: 'error', message: 'Failed to load preferences' });
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPreferences();
    }
  }, [selectedUserId, fetchUserPreferences]);

  const handleChange = (preference) => (event) => {
    const newValue = event.target.checked;
    
    if (['emailNotifications', 'smsNotifications', 'pushNotifications'].includes(preference)) {
      setPreferences(prev => ({
        ...prev,
        emailNotifications: preference === 'emailNotifications' ? newValue : false,
        smsNotifications: preference === 'smsNotifications' ? newValue : false,
        pushNotifications: preference === 'pushNotifications' ? newValue : false,
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [preference]: newValue
      }));
    }
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const notificationType = preferences.emailNotifications ? 'email' :
                              preferences.smsNotifications ? 'sms' :
                              preferences.pushNotifications ? 'push' : 'none';

      const updatedPreferences = {
        notifications: notificationType,
        theme: preferences.theme,
        marketing_emails: preferences.marketingEmails,
        event_reminders: preferences.eventReminders,
        newsletter: preferences.newsletterSubscription,
      };

      const { error } = await profileService.updatePreferences(selectedUserId, updatedPreferences);
      
      if (error) throw error;

      setSnackbar({ severity: 'success', message: 'Preferences updated successfully!' });
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating preferences:', error.message);
      setSnackbar({ severity: 'error', message: 'Failed to update preferences' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (event) => {
    setPreferences(prev => ({
      ...prev,
      theme: event.target.value
    }));
    setHasChanges(true);
  };

  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6">Contact Preferences</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose how you would like to receive updates and notifications from us.
        </Typography>

        <FormGroup>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Notification Methods
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.smsNotifications}
                  onChange={handleChange('smsNotifications')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="SMS Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={handleChange('pushNotifications')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="Push Notifications"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Communication Preferences
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.marketingEmails}
                  onChange={handleChange('marketingEmails')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="Marketing Communications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.eventReminders}
                  onChange={handleChange('eventReminders')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="Event Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.newsletterSubscription}
                  onChange={handleChange('newsletterSubscription')}
                  color="success"
                  disabled={isLoading}
                />
              }
              label="Newsletter Subscription"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Theme Preferences
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="theme-options"
                value={preferences.theme}
                onChange={handleThemeChange}
              >
                <FormControlLabel
                  value="light"
                  control={<Radio color="success" disabled={isLoading} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LightModeIcon sx={{ mr: 1 }} />
                      Light Mode
                    </Box>
                  }
                />
                <FormControlLabel
                  value="dark"
                  control={<Radio color="success" disabled={isLoading} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DarkModeIcon sx={{ mr: 1 }} />
                      Dark Mode
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </FormGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            Save Preferences
          </Button>
        </Box>
      </CardContent>

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