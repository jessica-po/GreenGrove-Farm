import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Chip,
  } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';


// Add PropTypes
ActivityLog.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};

ActivityLog.defaultProps = {
  sx: {},
};

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get chip color based on activity type
const getChipColor = (activityType) => {
  const colorMap = {
    'Feedback Submitted': 'info',
    'Support Ticket Opened': 'warning',
    'Profile Updated': 'success',
    'Password Changed': 'secondary',
    'Login Attempt': 'default',
  };
  return colorMap[activityType] || 'default';
};

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('activity_date', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card sx={{ width: '75vw' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <HistoryIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6">Recent Activity</Typography>
        </Box>

        <TableContainer >
          <Table aria-label="activity log table">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Type</TableCell>
                <TableCell width="60%">Description</TableCell>
                <TableCell width="20%" align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => (
                <TableRow
                  key={activity.activity_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Chip
                      label={activity.activity_type}
                      color={getChipColor(activity.activity_type)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    />
                  </TableCell>
                  <TableCell>{activity.activity_description}</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                    {formatDate(activity.activity_date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}