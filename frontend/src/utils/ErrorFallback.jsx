import { Alert, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';

/**
 * ErrorFallback component for displaying an error message and a retry button
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that occurred
 * @param {Function} props.resetError - Function to reset the error
 */
export default function ErrorFallback({ error, resetError }) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert 
        severity="error"
        action={
          resetError && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={resetError}
            >
              Retry
            </Button>
          )
        }
      >
        {error?.message || 'Something went wrong. Please try again.'}
      </Alert>
    </Box>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func,
};