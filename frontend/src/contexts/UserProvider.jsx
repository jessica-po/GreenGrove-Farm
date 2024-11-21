import { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';

export function UserProvider({ children }) {
    const [selectedUserId, setSelectedUserId] = useState(3);
  
    return (
      <UserContext.Provider value={{ selectedUserId, setSelectedUserId }}>
        {children}
      </UserContext.Provider>
    );
  }
  
  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };