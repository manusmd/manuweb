'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpotlightPosition {
  x: number;
  y: number;
}

interface UseSpotlightProps {
  size?: number;
  opacity?: number;
  color?: string;
  enabled?: boolean;
}

export function useSpotlight({
  size = 300,
  opacity = 0.3,
  color = 'rgba(59, 130, 246, 0.3)',
  enabled = true,
}: UseSpotlightProps = {}) {
  const [position, setPosition] = useState<SpotlightPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setIsVisible(true);
    },
    [enabled]
  );

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, enabled]);

  const spotlightStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 1,
    background: isVisible
      ? `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color} 0%, transparent 70%)`
      : 'transparent',
    opacity: isVisible ? opacity : 0,
    transition: 'opacity 0.3s ease',
  };

  return {
    spotlightStyle,
    position,
    isVisible,
    setEnabled: (enabled: boolean) => {
      if (!enabled) {
        setIsVisible(false);
      }
    },
  };
}
