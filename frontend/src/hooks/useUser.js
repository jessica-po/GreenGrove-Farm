import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

/**
 * useUser hook to access user-related data and functions
 * @returns {Object} - User context
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}