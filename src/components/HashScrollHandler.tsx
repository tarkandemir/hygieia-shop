'use client';

import { useEffect } from 'react';

export default function HashScrollHandler() {
  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    if (hash) {
      // Remove the # from the hash
      const targetId = hash.substring(1);
      
      // Wait for the page to fully load
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}

