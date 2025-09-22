'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

export function useNavigationLoading() {
  const pathname = usePathname();
  const { stopLoading } = useLoading();

  // Stop loading when pathname changes (page loaded)
  useEffect(() => {
    stopLoading();
  }, [pathname, stopLoading]);
}

// Custom navigation hook with loading
export function useNavigateWithLoading() {
  const { startLoading } = useLoading();

  const navigateWithLoading = (url: string) => {
    startLoading();
    window.location.href = url;
  };

  return { navigateWithLoading };
}
