'use client';

import { useLoading } from '../contexts/LoadingContext';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function NavigationHandler() {
  const { stopLoading } = useLoading();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  
  // Stop loading when pathname changes (page arrived)
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      // Stop loading when new page arrives
      stopLoading();
    }
  }, [pathname, stopLoading]);
  
  return null;
}
