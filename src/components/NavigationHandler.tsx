'use client';

import { useLoading } from '../contexts/LoadingContext';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function NavigationHandler() {
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  
  // Handle route changes with loading
  useEffect(() => {
    // Only start loading if pathname actually changed
    if (previousPathname.current !== pathname) {
      startLoading();
      previousPathname.current = pathname;
      
      // Stop loading when the page is fully loaded
      const handleLoad = () => {
        stopLoading();
      };
      
      // Listen for page load events
      window.addEventListener('load', handleLoad);
      
      // Also stop loading when DOM is ready
      if (document.readyState === 'complete') {
        // Page is already loaded, stop loading after a short delay
        const timer = setTimeout(() => {
          stopLoading();
        }, 500);
        return () => clearTimeout(timer);
      }
      
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, [pathname, startLoading, stopLoading]);
  
  return null;
}
