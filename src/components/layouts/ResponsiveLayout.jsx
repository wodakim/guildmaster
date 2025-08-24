import React, { useState, useEffect } from 'react';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';

/**
 * ResponsiveLayout component - Conditionally renders mobile or desktop layout
 * based on screen width
 */
const ResponsiveLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState('guild');
  
  useEffect(() => {
    // Function to check if we're on a mobile device
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Filter children to only show the active page
  const activePageContent = React.Children.toArray(children).find(
    child => child.props.pageId === activePage
  );
  
  // Use appropriate layout based on screen size
  return isMobile ? (
    <MobileLayout activePage={activePage} setActivePage={setActivePage}>
      {activePageContent || children}
    </MobileLayout>
  ) : (
    <DesktopLayout activePage={activePage} setActivePage={setActivePage}>
      {activePageContent || children}
    </DesktopLayout>
  );
};

export default ResponsiveLayout;