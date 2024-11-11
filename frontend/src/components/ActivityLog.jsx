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

// Mock data for activity log
const mockActivities = [
  {
    activity_id: 1,
    activity_type: 'Feedback Submitted',
    activity_description: 'Submitted feedback for Project X',
    activity_date: '2024-03-15T10:30:00',
  },
  {
    activity_id: 2,
    activity_type: 'Support Ticket Opened',
    activity_description: 'Opened ticket #1234 regarding login issues',
    activity_date: '2024-03-14T15:45:00',
  },
  {
    activity_id: 3,
    activity_type: 'Profile Updated',
    activity_description: 'Updated contact information',
    activity_date: '2024-03-13T09:20:00',
  },
  {
    activity_id: 4,
    activity_type: 'Password Changed',
    activity_description: 'Changed account password',
    activity_date: '2024-03-12T16:15:00',
  },
  {
    activity_id: 5,
    activity_type: 'Login Attempt',
    activity_description: 'Successful login from new device',
    activity_date: '2024-03-11T11:30:00',
  },
];

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
              {mockActivities.map((activity) => (
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