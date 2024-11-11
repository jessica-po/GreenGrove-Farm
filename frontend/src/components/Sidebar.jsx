import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import FeedbackIcon from '@mui/icons-material/Feedback'; 
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import SettingsIcon from '@mui/icons-material/Settings'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import logo from '../assets/logo.png';
import { Typography } from '@mui/material';


const drawerWidth = 240;

export default function Sidebar() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
          <img src={logo} alt="logo" style={{ width: '48px', height: 'auto' }} />
          <Typography variant='h5'><span style={{color: '#b6de3d'}}>Green</span><span style={{color: '#fec712'}}>Grove</span></Typography>
        </div>
        {['Dashboard', 'Reports', 'Rewards Program', 'Feedback Submission', 'Resources'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text === 'Dashboard' && <DashboardIcon />}
                {text === 'Reports' && <AssessmentIcon />}
                {text === 'Rewards Program' && <EmojiEventsIcon />}
                {text === 'Feedback Submission' && <FeedbackIcon />}
                {text === 'Resources' && <LibraryBooksIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Profile', 'Settings', 'Logout'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {text === 'Profile' && <AccountCircleIcon />}
                {text === 'Settings' && <SettingsIcon />} 
                {text === 'Logout' && <ExitToAppIcon />} 
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
