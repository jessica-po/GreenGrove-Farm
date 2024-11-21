import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HistoryIcon from '@mui/icons-material/History';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SupportIcon from '@mui/icons-material/Support';
import PropTypes from 'prop-types';
import PersonalProfile from "./PersonalProfile";
import PersonalPreferences from "./PersonalPreferences";
import ActivityLog from "./ActivityLog";
import PurchaseHistory from "./PurchaseHistory";
import RewardsComponent from './RewardsComponent';
import UserSelector from './UserSelector';
import ErrorFallback from '../utils/ErrorFallback';
import ErrorBoundary from '../utils/ErrorBoundary';
import { useTabState } from '../hooks/useTabState';
import { useUser } from '../hooks/useUser';
import { ProfileSkeleton } from './LoadingSkeleton';
import SupportTickets from './SupportTickets';

/**
 * MemoizedTabPanel component for managing content visibility in tabs and optimizing rendering performance
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Tab content
 * @param {number} props.value - Current active tab index
 * @param {number} props.index - This tab's index
 */

const MemoizedTabPanel = memo(function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      sx={{ py: 3, px: 3 }}
    >
      {value === index && children}
    </Box>
  );
});

MemoizedTabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

/**
 * AccountManagement component handles user account features including
 * profile management, rewards, activity tracking, support tickets and purchase history
 */
export default function AccountManagement() {
    const { selectedUserId, userRole } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define tabs based on user role
    const tabs = useMemo(() => {
      const baseTabs = [
        {
          id: 'profile',
          label: "Profile",
          icon: <PersonIcon />,
          content: (
            <ErrorBoundary>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <PersonalProfile />
                <PersonalPreferences />
              </Box>
            </ErrorBoundary>
          )
        },
        {
          id: 'activity',
          label: "Activity",
          icon: <HistoryIcon />,
          content: (
            <ErrorBoundary>
              <ActivityLog isAdmin={userRole?.toLowerCase() === 'admin'} />
            </ErrorBoundary>
          )
        },
        {
          id: 'support',
          label: "Support",
          icon: <SupportIcon />,
          content: (
            <ErrorBoundary>
              <SupportTickets isAdmin={userRole?.toLowerCase() === 'admin'} />
            </ErrorBoundary>
          )
        }
      ];

      // Add customer-specific tabs
      if (userRole?.toLowerCase() !== 'admin') {
        baseTabs.push(
          {
            id: 'rewards',
            label: "Rewards",
            icon: <EmojiEventsIcon />,
            content: (
              <ErrorBoundary>
                <RewardsComponent />
              </ErrorBoundary>
            )
          },
          {
            id: 'purchases',
            label: "Purchases",
            icon: <ShoppingBagIcon />,
            content: (
              <ErrorBoundary>
                <PurchaseHistory />
              </ErrorBoundary>
            )
          }
        );
      }

      return baseTabs;
    }, [userRole]); 

    // Handle tab changes
    const handleTabChange = useCallback((event, newValue) => {
        if (newValue !== activeTab) {
            setActiveTab(newValue);
        }
    }, [activeTab]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e) => {
      if (e.key === 'ArrowLeft') {
        setActiveTab(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveTab(prev => Math.min(tabs.length - 1, prev + 1));
      }
    }, [tabs.length]);

    // Handle tab state
    useTabState(activeTab, setActiveTab, tabs);

    // Set loading state
    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }, []);

    if (error) {
      return <ErrorFallback error={error} resetError={() => setError(null)} />;
    }

    if (!selectedUserId) {
      return (
        <Box sx={{ 
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h6" gutterBottom>
            Please select a user to continue
          </Typography>
          <UserSelector />
        </Box>
      );
    }

    if (isLoading) {
      return (
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1200px',
          margin: '0 auto',
          p: 3 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3 
          }}>
            <Typography variant="h4">
              Account Management
            </Typography>
            <UserSelector />
          </Box>
          <Paper sx={{ width: '100%' }}>
            <ProfileSkeleton />
          </Paper>
        </Box>
      );
    }

    return (
        <Box 
            sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', pb: 4 }}
            role="main"
            aria-label="Account Management Section"
        >
            <Box 
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: 2, pt: 2 }}
                role="banner"
            >
                <Typography variant="h4" component="h1">
                    Account Management
                </Typography>
                <UserSelector />
            </Box>

            <Paper 
                sx={{ width: '100%' }}
                role="region"
                aria-label="Account Management Tabs"
            >
                <Tabs 
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="success"
                    textColor="inherit"
                    aria-label="account management tabs"
                    onKeyDown={handleKeyDown}
                >
                    {tabs.map((tab, index) => (
                        <Tab 
                            key={tab.id}
                            icon={tab.icon}
                            label={tab.label}
                            iconPosition="start"
                            aria-controls={`account-tabpanel-${tab.id}`}
                            aria-selected={activeTab === index}
                            role="tab"
                            tabIndex={activeTab === index ? 0 : -1}
                            id={`account-tab-${tab.id}`}
                        />
                    ))}
                </Tabs>

                {tabs.map((tab, index) => (
                    <MemoizedTabPanel 
                        key={tab.id} 
                        value={activeTab} 
                        index={index}
                        aria-labelledby={`account-tab-${tab.id}`}
                    >
                        {tab.content}
                    </MemoizedTabPanel>
                ))}
            </Paper>
        </Box>
    );
}
