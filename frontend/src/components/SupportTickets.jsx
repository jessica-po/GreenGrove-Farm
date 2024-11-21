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
} from '@mui/material';
import { supportService } from '../services/supabaseService';
import { useUser } from '../contexts/UserContext';

const columns = [
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

export default function SupportTickets() {
  const { selectedUserId } = useUser();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supportService.fetchTickets(selectedUserId);

      if (fetchError) throw fetchError;

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
      setError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

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
      <TableContainer sx={{ maxHeight: 440 }}>
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
            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={ticket.ticket_id}>
                  {columns.map((column) => {
                    const value = ticket[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'string'
                          ? column.format(value)
                          : value}
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
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
