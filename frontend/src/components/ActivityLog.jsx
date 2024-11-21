import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Stack,
  TablePagination
} from '@mui/material';
import { useUser } from '../hooks/useUser';
import { activityService } from '../services/supabaseService';
import { ActivitySkeleton } from './LoadingSkeleton';
import PropTypes from 'prop-types';

/**
 * ActivityLog component for displaying user activities
 * @param {Object} props - Component props
 * @param {boolean} props.isAdmin - Whether the user is an admin
 * @returns {JSX.Element} - Rendered ActivityLog component
 */
export default function ActivityLog({ isAdmin = false }) {
  const { selectedUserId } = useUser();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    search: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const activityTypes = [
    'All',
    'Login',
    'Logout',
    'Profile Update',
    'Password Change',
    'Password Reset',
    'Security Alert',
    'System Update',
    'User Management',
    'Settings Update',
    'API Access',
    'Security Update',
    'System Access',
    'Account Created',
    'Integration Update'
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      const { data, error } = await activityService.fetchActivities(selectedUserId, isAdmin);
      if (error) {
        console.error('Error fetching activities:', error);
      } else {
        setActivities(data);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, [selectedUserId, isAdmin]);

  const filteredActivities = activities.filter(activity => {
    const matchesType = filters.type === '' || filters.type === 'All'
      ? true
      : activity.activity_type === filters.type;

    const matchesSearch = filters.search === ''
      ? true
      : (activity.activity_description?.toLowerCase().includes(filters.search.toLowerCase()) ||
         (isAdmin && activity.userName?.toLowerCase().includes(filters.search.toLowerCase())));

    return matchesType && matchesSearch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <ActivitySkeleton />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isAdmin ? 'All User Activities' : 'Your Activities'}
      </Typography>

      {/* Filter Controls */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Activity Type"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            sx={{ minWidth: 150 }}
            size="small"
          >
            {activityTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search activities..."
            size="small"
            sx={{ minWidth: 200 }}
          />
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {isAdmin && <TableCell>User</TableCell>}
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((activity) => (
                <TableRow key={activity.activity_id}>
                  {isAdmin && (
                    <TableCell>{activity.userName}</TableCell>
                  )}
                  <TableCell>{activity.activity_type}</TableCell>
                  <TableCell>{activity.activity_description}</TableCell>
                  <TableCell>{activity.activity_date}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredActivities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

ActivityLog.propTypes = {
  isAdmin: PropTypes.bool
};

