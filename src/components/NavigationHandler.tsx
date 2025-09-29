'use client';

import { useNavigationLoading } from '../hooks/useNavigationLoading';
import { useLoading } from '../contexts/LoadingContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationHandler() {
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();
  
  // Handle route changes
  useEffect(() => {
    // Start loading on route change
    startLoading();
    
    // Stop loading after a short delay to show the loading state
    const timer = setTimeout(() => {
      stopLoading();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, startLoading, stopLoading]);
  
  useNavigationLoading();
  return null;
}
