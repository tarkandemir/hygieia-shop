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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-transparent border-t-[#6AF0D2] border-r-[#5BE0C2] rounded-full animate-spin" />
            <div className="text-[#000069] font-semibold text-base">
              Yükleniyor...
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
