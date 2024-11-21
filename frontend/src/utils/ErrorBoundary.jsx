import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * ErrorBoundary component to catch and handle errors in the application
 * 
 * The difference between this and ErrorFallback is that ErrorBoundary is a class component
 * and ErrorFallback is a functional component.
 * ErrorBoundary is used in the component tree to catch errors and display a fallback UI.
 * ErrorFallback is used to display the fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * getDerivedStateFromError function to update state when an error occurs
   * @param {Error} error - The error that occurred
   * @returns {Object} - The new state
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * componentDidCatch function to catch errors and log them
   * @param {Error} error - The error that occurred
   * @param {Object} errorInfo - Information about the error
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console for now
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * handleRetry function to reset error state and call onRetry callback
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  /**
   * render function to display fallback UI when an error occurs
   * @returns {ReactNode} - The fallback UI
   */
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography variant="h6" color="error">
            {this.props.fallbackMessage || 'Something went wrong'}
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            variant="contained"
            onClick={this.handleRetry}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onRetry: PropTypes.func,
  fallbackMessage: PropTypes.string
};

