'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Loading component is defined inline

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    // Clear any existing timer
    if (loadingTimer) {
      clearTimeout(loadingTimer);
    }

    setIsLoading(true);
    
    // Auto-stop loading after 10 seconds as failsafe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    
    setLoadingTimer(timer);
  };

  const stopLoading = () => {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      setLoadingTimer(null);
    }
    setIsLoading(false);
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, [loadingTimer]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, startLoading, stopLoading }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9999] flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-3 border-white/30 border-t-[#6AF0D2] rounded-full animate-spin" />
            <div className="text-white font-medium text-sm drop-shadow-lg">
              Yükleniyor...
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
