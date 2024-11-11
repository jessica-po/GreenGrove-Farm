
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import AccountManagement from './components/AccountManagement';
const drawerWidth = 240;

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <div style={{ flex: '0 0 64px', }}> {/* Navigation along the top */}
        <AppBar position="static">
          <NavBar />
        </AppBar>
      </div>
      <div style={{ display: 'flex', flex: '1' }}> {/* Main container for sidebar and content */}
        <div style={{ flex: `0 0 ${drawerWidth}px` }}> {/* Sidebar on the left */}
          <Sidebar />
        </div>
        <div style={{ flex: '1', padding: '16px', overflowY: 'auto' }}> {/* Main content here */}
          {/* Main content goes here */}
          <AccountManagement />
        </div>
      </div>
    </div>
  );
}
