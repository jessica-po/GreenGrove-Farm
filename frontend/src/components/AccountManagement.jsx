import { Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import StatCard from "./StatCard";
import SupportTickets from "./SupportTickets";
import PersonalProfile from "./PersonalProfile";

const data = [
    {
      title: 'Points Accumulated',
      value: '14k',
      interval: 'Last 30 days',
      trend: 'up',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: 'Events Attended',
      value: '325',
      interval: 'Last 30 days',
      trend: 'down',
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
      ],
    },
    {
      title: 'Pending Support Tickets',
      value: '2',
      interval: 'Last 30 days',
      trend: 'neutral',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
];

export default function AccountManagement() {
    return (
        <>
            <Typography variant="h4">Account Management</Typography>

            <Typography variant="body1">
                This is the account management page.
            </Typography>

            <Typography variant="h5">Profile Details</Typography>
            <PersonalProfile />
            
            <Grid
                container
                spacing={2}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                {data.map((card, index) => (
                    <Grid xs={12} sm={6} lg={3} key={index}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>
            
            <Typography variant="h5">Activity History</Typography>

            <Typography variant="body1">
                View Support Ticket Status Details
            </Typography>

            <SupportTickets />

        </>
    );
}