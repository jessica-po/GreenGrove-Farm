import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import AccountManagement from './components/AccountManagement';

const drawerWidth = 240;

export default function App() {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
    }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />
      
      {/* Main content wrapper */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* AppBar */}
        <AppBar 
          position="fixed" 
        >
          <NavBar />
        </AppBar>

        {/* Main content area with proper spacing from AppBar */}
        <Box component="main" sx={{ 
          flexGrow: 1,
          p: 3,
          mt: '64px', // Height of AppBar
          width: '100%',
          overflow: 'auto'
        }}>
          <AccountManagement />
        </Box>
      </Box>
    </Box>
  );
}
