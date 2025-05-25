'use client';

import { useState, useEffect } from 'react';

export function useFloatingHearts() {
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    const handleTripleClickHearts = () => {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    };

    // Listen for the hearts event from MouseEasterEggs
    const handleHeartsEvent = () => {
      handleTripleClickHearts();
    };

    window.addEventListener('showHearts', handleHeartsEvent);
    return () => window.removeEventListener('showHearts', handleHeartsEvent);
  }, []);

  return {
    showHearts,
  };
}
