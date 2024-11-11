import { useState } from 'react';
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
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PropTypes from 'prop-types';

// Mock data for purchases
const mockPurchases = [
  {
    id: 1,
    product_name: 'Eco-friendly Plant Pot',
    price: 24.99,
    date: '2024-03-15T10:30:00',
    status: 'Delivered',
    carbon_offset: '2.5kg',
  },
  {
    id: 2,
    product_name: 'Organic Soil Mix',
    price: 15.99,
    date: '2024-03-10T15:45:00',
    status: 'Processing',
    carbon_offset: '1.2kg',
  },
  {
    id: 3,
    product_name: 'Bamboo Garden Tools Set',
    price: 49.99,
    date: '2024-03-05T09:20:00',
    status: 'Delivered',
    carbon_offset: '3.0kg',
  },
];

// Mock data for sustainability interactions
const mockInteractions = [
  {
    id: 1,
    event_name: 'Community Garden Workshop',
    type: 'Workshop',
    date: '2024-03-18T14:00:00',
    points_earned: 50,
    status: 'Registered',
  },
  {
    id: 2,
    event_name: 'Plant Recycling Drive',
    type: 'Event',
    date: '2024-03-08T10:00:00',
    points_earned: 75,
    status: 'Completed',
  },
  {
    id: 3,
    event_name: 'Sustainable Gardening Course',
    type: 'Course',
    date: '2024-02-28T09:00:00',
    points_earned: 100,
    status: 'Completed',
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

// Helper function to format price
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// Helper function to get status chip color
const getStatusColor = (status) => {
  const colorMap = {
    'Delivered': 'success',
    'Processing': 'warning',
    'Registered': 'info',
    'Completed': 'success',
    'Cancelled': 'error',
  };
  return colorMap[status] || 'default';
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

export default function PurchaseHistory() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card sx={{ 
      width: '75vw',
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingBagIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6">Purchase & Interaction History</Typography>
        </Box>

        <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="success"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Purchases" />
            <Tab label="Sustainability Activities" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0} sx={{ flexGrow: 1 }}>
          <TableContainer>
            <Table aria-label="purchases table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Carbon Offset</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.product_name}</TableCell>
                    <TableCell align="right">{formatPrice(purchase.price)}</TableCell>
                    <TableCell align="right">{purchase.carbon_offset}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={purchase.status}
                        color={getStatusColor(purchase.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{formatDate(purchase.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1} sx={{ flexGrow: 1 }}>
          <TableContainer>
            <Table aria-label="sustainability interactions table">
              <TableHead>
                <TableRow>
                  <TableCell>Activity</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Points Earned</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell>{interaction.event_name}</TableCell>
                    <TableCell>{interaction.type}</TableCell>
                    <TableCell align="right">{interaction.points_earned}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={interaction.status}
                        color={getStatusColor(interaction.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{formatDate(interaction.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
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

PurchaseHistory.defaultProps = {
  sx: {},
};