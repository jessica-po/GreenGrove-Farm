import { Typography, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import PersonalProfile from "./PersonalProfile";
import PersonalPreferences from "./PersonalPreferences";
import ActivityLog from "./ActivityLog";
import PurchaseHistory from "./PurchaseHistory";

export default function AccountManagement() {
    return (
        <Box sx={{ width: '75vw' }}>
            <Typography variant="h4" gutterBottom>
                Account Management
            </Typography>

            <Grid container spacing={3} columns={12}>
                {/* Profile and Preferences row */}
                <Grid xs={12} md={6} lg={12}>
                    <PersonalProfile />
                </Grid>
                <Grid xs={12} md={6} lg={12}>
                    <PersonalPreferences />
                </Grid>

                {/* Activity Log row */}
                <Grid xs={12} md={12} lg={12}>
                    <ActivityLog />
                </Grid>

                {/* Purchase History row */}
                <Grid xs={12} md={12} lg={12}>
                    <PurchaseHistory />
                </Grid>
            </Grid>
        </Box>
    );
}