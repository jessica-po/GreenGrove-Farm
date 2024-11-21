import { Typography, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import PersonalProfile from "./PersonalProfile";
import PersonalPreferences from "./PersonalPreferences";
import ActivityLog from "./ActivityLog";
import PurchaseHistory from "./PurchaseHistory";
import RewardsComponent from './RewardsComponent';

export default function AccountManagement() {
    return (
        <Box sx={{ 
            width: '100%', 
            maxWidth: '1200px',
        }}>
            <Typography variant="h4" gutterBottom>
                Account Management
            </Typography>

            <Grid 
                container 
                spacing={3}
                sx={{ width: '100%', margin: 0 }}
            >
                {/* Profile and Preferences */}
                <Grid xs={12} md={6} sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <PersonalProfile />
                    </Box>
                </Grid>
                <Grid xs={12} md={6} sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <PersonalPreferences />
                    </Box>
                </Grid>

                {/* Full width components */}
                <Grid xs={12} sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <RewardsComponent />
                    </Box>
                </Grid>
                <Grid xs={12} sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <ActivityLog />
                    </Box>
                </Grid>
                <Grid xs={12} sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <PurchaseHistory />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}