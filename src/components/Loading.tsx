'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ 
  size = 'md', 
  color = '#000069', 
  text = 'Yükleniyor...', 
  fullScreen = false 
}: LoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner */}
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
          style={{ borderTopColor: color }}
        >
          <div 
            className={`${sizeClasses[size]} border-4 border-transparent rounded-full animate-spin`}
            style={{ borderTopColor: color }}
          />
        </div>
      </div>
      
      {/* Loading Text */}
      {text && (
        <div className={`${textSizeClasses[size]} font-medium`} style={{ color }}>
          {text}{dots}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
}

// Page Loading Spinner for Next.js
export function PageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loading size="lg" text="Sayfa yükleniyor..." />
    </div>
  );
}

// Inline Loading Spinner
export function InlineLoading({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading size="md" text={text} />
    </div>
  );
}

// Button Loading Spinner
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div 
      className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-white/30 border-t-white rounded-full animate-spin`}
    />
  );
}
