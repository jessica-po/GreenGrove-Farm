import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';

/**
 * UserProvider component for managing user-related data and functions
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function UserProvider({ children }) {
    const [selectedUserId, setSelectedUserId] = useState(3);
    const [userRole, setUserRole] = useState(null);
  
    const updateUser = (userId, role) => {
        setSelectedUserId(userId);
        setUserRole(role);
    };

    return (
      <UserContext.Provider value={{ 
        selectedUserId, 
        userRole,
        updateUser 
      }}>
        {children}
      </UserContext.Provider>
    );
}
  
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};