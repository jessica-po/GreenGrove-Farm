import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Tab state management hook
 * @param {number} activeTab - The index of the currently active tab
 * @param {function} setActiveTab - The function to set the active tab
 * @param {Array} tabs - The array of tabs
 * @returns {void}
 */
export function useTabState(activeTab, setActiveTab, tabs) {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Handle initial URL tab loading
  // Skip if not initial mount
  useEffect(() => {
    if (!isInitialMount.current) {
      return;
    }

    isInitialMount.current = false;
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      const tabIndex = tabs.findIndex(tab => tab.id === tabFromUrl);
      if (tabIndex !== -1 && tabIndex !== activeTab) {
        setActiveTab(tabIndex);
      }
    }
  }, [searchParams, activeTab, setActiveTab, tabs]); 

  // Update URL when tab changes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const currentTab = tabs[activeTab]?.id;
      if (currentTab) {
        const currentTabInUrl = searchParams.get('tab');
        if (currentTabInUrl !== currentTab) {
          setSearchParams({ tab: currentTab }, { replace: true });
        }
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeTab, tabs, setSearchParams, searchParams]);
}