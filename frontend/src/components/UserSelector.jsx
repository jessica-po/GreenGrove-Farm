import { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography 
} from '@mui/material';
import { useUser } from '../hooks/useUser';
import { userService } from '../services/supabaseService';

/**
 * UserSelector component for selecting a user from a list--current workaround to switch between user profiles without a login portal
 */
export default function UserSelector() {
  const { selectedUserId, updateUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await userService.fetchNonAdminUsers();
        if (error) throw error;
        setUsers(data);
        // Set first user as default if none selected
        if (!selectedUserId && data.length > 0) {
          updateUser(data[0].user_id, data[0].role);
        }
      } catch (err) {
        setError('Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedUserId, updateUser]);

  const handleUserChange = (event) => {
    const selectedUser = users.find(user => user.user_id === event.target.value);
    updateUser(selectedUser.user_id, selectedUser.role);
  };

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Select User</InputLabel>
        <Select
          value={selectedUserId || ''}
          label="Select User"
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <MenuItem key={user.user_id} value={user.user_id}>
              {user.first_name} {user.last_name} ({user.role})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}