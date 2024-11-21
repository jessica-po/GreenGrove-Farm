import { Skeleton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

/**
 * ProfileSkeleton component for displaying a loading skeleton of a profile
 * @returns {JSX.Element} - Rendered ProfileSkeleton component
 * Improves user experience by displaying a loading skeleton while waiting for profile data to load instead of a blank screen
 */

export const ProfileSkeleton = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} item>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid xs={12} md={6} item>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid xs={12} md={6} item>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid xs={12} md={6} item>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * RewardsSkeleton component for displaying a loading skeleton of rewards
 * @returns {JSX.Element} - Rendered RewardsSkeleton component
 */

export function RewardsSkeleton() {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" height={100} />
        </Grid>
      </Grid>
      <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
    </Box>
  );
}

/**
 * ActivitySkeleton component for displaying a loading skeleton of activities
 * @returns {JSX.Element} - Rendered ActivitySkeleton component
 */

export function ActivitySkeleton() {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={72} />
        </Box>
      ))}
    </Box>
  );
}

export default ProfileSkeleton;