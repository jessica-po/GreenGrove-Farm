import { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Box,
  Alert,
  TextField,
  MenuItem,
  Stack,
  Chip,
} from '@mui/material';
import { supportService } from '../services/supabaseService';
import { useUser } from '../hooks/useUser';
import PropTypes from 'prop-types';

/**
 * SupportTickets component for displaying support tickets
 * @param {Object} props - Component props
 * @param {boolean} props.isAdmin - Whether the user is an admin
 */
export default function SupportTickets({ isAdmin = false }) {
  const { selectedUserId } = useUser();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  // Define table columns based on user role
  const columns = [
    ...(isAdmin ? [{ id: 'userName', label: 'User', minWidth: 170 }] : []),
    { id: 'ticket_id', label: 'Ticket ID', minWidth: 100 },
    { id: 'subject', label: 'Subject', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'priority', label: 'Priority', minWidth: 100 },
    {
      id: 'created_at',
      label: 'Created',
      minWidth: 170,
      format: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ];

  // Define filter options
  const statusOptions = ['All', 'Open', 'In Progress', 'Closed', 'Resolved'];
  const priorityOptions = ['All', 'Low', 'Medium', 'High'];

  // Add priority color mapping
  const priorityColors = {
    'High': {
      color: 'warning',
      backgroundColor: '#d32f2f'
    },
    'Medium': {
      color: 'info',
      backgroundColor: '#ff9800' 
    },
    'Low': {
      color: 'success',
      backgroundColor: '#9e9e9e' 
    }
  };

  // Add status color mapping
  const statusColors = {
    'Open': {
      color: 'info',
      backgroundColor: '#2196f3' 
    },
    'In Progress': {
      color: 'warning',
      backgroundColor: '#ff9800'
    },
    'Closed': {
      color: 'success',
      backgroundColor: '#4caf50' 
    }
  
  };

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filters.status === '' || filters.status === 'All' 
      ? true 
      : ticket.status === filters.status;
    
    const matchesPriority = filters.priority === '' || filters.priority === 'All'
      ? true
      : ticket.priority === filters.priority;
    
    const matchesSearch = filters.search === ''
      ? true
      : (ticket.subject?.toLowerCase().includes(filters.search.toLowerCase()) ||
         ticket.ticket_id?.toString().includes(filters.search) ||
         (isAdmin && ticket.userName?.toLowerCase().includes(filters.search.toLowerCase())));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  /**
   * fetchTickets function to fetch tickets from SupabaseService
   */
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supportService.fetchTickets(selectedUserId, isAdmin);

      if (fetchError) throw fetchError;

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      setError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, isAdmin]);

  useEffect(() => {
    if (selectedUserId) {
      fetchTickets();
    }
  }, [selectedUserId, fetchTickets]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Reset to first page when filters change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); 
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Add Filter Controls */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            sx={{ minWidth: 120 }}
            size="small"
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            sx={{ minWidth: 120 }}
            size="small"
          >
            {priorityOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search tickets..."
            size="small"
            sx={{ minWidth: 200 }}
          />
        </Stack>
      </Box>

      <TableContainer>
        <Table stickyHeader aria-label="support tickets table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={ticket.ticket_id}>
                  {columns.map((column) => {
                    const value = ticket[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'priority' ? (
                          <Chip
                            label={value}
                            color={priorityColors[value]?.color}
                            sx={{
                              backgroundColor: priorityColors[value]?.backgroundColor,
                              fontWeight: 'medium'
                            }}
                            size="small"
                          />
                        ) : column.id === 'status' ? (
                          <Chip
                            label={value}
                            color={statusColors[value]?.color}
                            sx={{
                              backgroundColor: statusColors[value]?.backgroundColor,
                              fontWeight: 'medium'
                            }}
                            size="small"
                          />
                        ) : column.format && typeof value === 'string' ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

SupportTickets.propTypes = {
  isAdmin: PropTypes.bool
};
