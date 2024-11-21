import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useUser } from '../hooks/useUser';
import { rewardsService } from '../services/supabaseService';
import { RewardsSkeleton } from './LoadingSkeleton';

/**
 * Rewards component for displaying user rewards data
 * @returns {JSX.Element} - Rendered Rewards component
 * Improves user experience by displaying rewards data in a visually appealing way
 */

export default function RewardsComponent() {
  const { selectedUserId } = useUser();
  const [rewardsData, setRewardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rewards data for the selected user
  const fetchRewardsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await rewardsService.fetchRewards(selectedUserId);

      if (fetchError) throw fetchError;

      setRewardsData(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setError('Failed to load rewards data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchRewardsData();
    }
  }, [selectedUserId, fetchRewardsData]);

  if (isLoading) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <RewardsSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ 
        flexGrow: 1,
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Sustainability Rewards</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 3,
              mb: 3
            }}
          >
            {/* Available Points Card */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  
                  <Typography variant="h6" color="text.secondary">
                    Available Points
                  </Typography>
                </Box>
                <Typography variant="h3" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  {rewardsData?.totalPoints || 0}
                </Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'primary.light',
                opacity: 0.1
              }} />
            </Paper>

            {/* Total Earned Card */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #d0e68c 0%, #b6de3d 100%)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 
                  <Typography variant="h6" color="success.dark">
                    Total Earned
                  </Typography>
                </Box>
                <Typography variant="h3" color="success.dark" sx={{ fontWeight: 'bold' }}>
                  {rewardsData?.totalPointsEarned || 0}
                </Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'success.dark',
                opacity: 0.1
              }} />
            </Paper>

            {/* Total Redeemed Card */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  
                  <Typography variant="h6" color="warning.dark">
                    Total Redeemed
                  </Typography>
                </Box>
                <Typography variant="h3" color="warning.dark" sx={{ fontWeight: 'bold' }}>
                  {rewardsData?.totalPointsRedeemed || 0}
                </Typography>
              </Box>
              <Box sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'warning.dark',
                opacity: 0.1
              }} />
            </Paper>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress to next tier
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rewardsData?.totalPoints}/1000 points
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(rewardsData?.totalPoints / 1000) * 100} 
              color="success"
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>Reward History</Typography>
        
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rewardsData?.history.map((entry) => (
                <TableRow key={entry.reward_id}>
                  <TableCell>
                    {format(
                      new Date(entry.earned_date || entry.redeemed_date),
                      'MMM dd, yyyy'
                    )}
                  </TableCell>
                  <TableCell>{entry.reward_description}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 'bold',
                      color: entry.points_earned ? 'success.main' : 'warning.main'
                    }}
                  >
                    {entry.points_earned ? `+${entry.points_earned}` : `-${entry.points_redeemed}`}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={entry.points_earned ? 'Earned' : 'Redeemed'}
                      color={entry.points_earned ? 'success' : 'warning'}
                      sx={{
                        minWidth: '100px',
                        height: '32px',
                        '& .MuiChip-label': {
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          px: 2
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(!rewardsData?.history || rewardsData.history.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No rewards history available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}