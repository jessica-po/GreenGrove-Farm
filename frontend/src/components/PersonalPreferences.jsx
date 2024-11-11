import { useState } from 'react';
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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PropTypes from 'prop-types';

// Prop type validation
PersonalPreferences.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

// Add default props
PersonalPreferences.defaultProps = {
  sx: {},
};


// Mock preferences data - replace with actual user preferences
const initialPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  mailNotifications: false,
  marketingEmails: true,
  eventReminders: true,
  newsletterSubscription: true,
};

export default function PersonalPreferences() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const handleChange = (preference) => (event) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: event.target.checked
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    setSnackbar({ severity: 'success', message: 'Preferences updated successfully!' });
    setHasChanges(false);
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
                />
              }
              label="SMS Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.mailNotifications}
                  onChange={handleChange('mailNotifications')}
                  color="success"
                />
              }
              label="Mail Notifications"
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
                />
              }
              label="Newsletter Subscription"
            />
          </Box>
        </FormGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
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