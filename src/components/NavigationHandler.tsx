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
      
      // Stop loading after a reasonable delay
      const timer = setTimeout(() => {
        stopLoading();
      }, 1000); // 1 second should be enough for most pages
      
      return () => clearTimeout(timer);
    }
  }, [pathname, startLoading, stopLoading]);
  
  return null;
}
