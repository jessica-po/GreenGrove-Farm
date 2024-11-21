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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { format } from 'date-fns';
import { useUser } from '../hooks/useUser';
import { rewardsService } from '../services/supabaseService';
import { RewardsSkeleton } from './LoadingSkeleton';

export default function RewardsComponent() {
  const { selectedUserId } = useUser();
  const [rewardsData, setRewardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <EmojiEventsIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6">Sustainability Rewards</Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Available Points: {rewardsData?.totalPoints || 0}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={`Earned: ${rewardsData?.totalPointsEarned || 0}`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`Redeemed: ${rewardsData?.totalPointsRedeemed || 0}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(rewardsData?.totalPoints / 1000) * 100} 
            color="success"
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Progress to next tier: {rewardsData?.totalPoints}/1000 points
          </Typography>
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
                <TableCell>Type</TableCell>
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
                  <TableCell align="right">
                    {entry.points_earned ? `+${entry.points_earned}` : `-${entry.points_redeemed}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.points_earned ? 'Earned' : 'Redeemed'}
                      color={entry.points_earned ? 'success' : 'primary'}
                      size="small"
                    />
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