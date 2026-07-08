'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';

interface MouseEasterEggsProps {
  showEasterEggDiscovery: (title: string, message: string, icon: string) => void;
}

export function MouseEasterEggs({ showEasterEggDiscovery }: MouseEasterEggsProps) {
  const t = useTranslations('easterEggs.notifications');

  // Easter Egg: Triple click anywhere to show hearts
  useEffect(() => {
    let clickTimer: NodeJS.Timeout;
    let currentClickCount = 0;

    const handleTripleClick = () => {
      currentClickCount++;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (currentClickCount >= 3) {
          // Dispatch custom event to trigger hearts animation
          window.dispatchEvent(new CustomEvent('showHearts'));

          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#dc143c'],
          });
          showEasterEggDiscovery(t('heartsDiscovered.title'), t('heartsDiscovered.message'), '💕');
        }
        currentClickCount = 0;
      }, 500);
    };

    document.addEventListener('click', handleTripleClick);
    return () => {
      document.removeEventListener('click', handleTripleClick);
      clearTimeout(clickTimer);
    };
  }, [showEasterEggDiscovery, t]);

  return null;
}
