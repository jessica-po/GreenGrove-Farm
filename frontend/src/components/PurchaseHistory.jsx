import { useState, useEffect, useCallback } from 'react';
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
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PropTypes from 'prop-types';
import { historyService } from '../services/supabaseService';
import { useUser } from '../hooks/useUser';


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

const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

const getStatusColor = (type) => {
  const colorMap = {
    'purchase': 'success',
    'workshop': 'info',
    'event': 'primary',
    'course': 'secondary',
  };
  return colorMap[type.toLowerCase()] || 'default';
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function PurchaseHistory({ sx = {} }) {
  const { selectedUserId } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await historyService.fetchHistory(selectedUserId);

      if (fetchError) throw fetchError;

      setHistoryData(data || []);
    } catch (error) {
      console.error('Error fetching history:', error.message);
      setError('Failed to load history data');
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchHistoryData();
    }
  }, [selectedUserId, fetchHistoryData]);

  // Filter data based on type
  const purchases = historyData.filter(item => 
    item.activity_type.toLowerCase() === 'purchase' && item.purchase_cost > 0
  );

  const activities = historyData.filter(item => 
    item.activity_type.toLowerCase() !== 'purchase'
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...sx 
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        p: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingBagIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6">Purchase & Interaction History</Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : (
          <>
            <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="success"
                textColor="inherit"
                variant="fullWidth"
              >
                <Tab label={`Purchases (${purchases.length})`} />
                <Tab label={`Activities (${activities.length})`} />
              </Tabs>
            </Paper>

            <TabPanel value={tabValue} index={0}>
              <TableContainer>
                <Table aria-label="purchases table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.history_id}>
                        <TableCell>{purchase.activity_description}</TableCell>
                        <TableCell align="right">
                          {formatPrice(purchase.purchase_cost)}
                        </TableCell>
                        <TableCell align="right">
                          {formatDate(purchase.activity_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <TableContainer>
                <Table aria-label="activities table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Activity</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.history_id}>
                        <TableCell>{activity.activity_description}</TableCell>
                        <TableCell>
                          <Chip
                            label={activity.activity_type}
                            color={getStatusColor(activity.activity_type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatDate(activity.activity_date)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </>
        )}
      </CardContent>
    </Card>
  );
}

PurchaseHistory.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
};