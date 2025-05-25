'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';

interface MouseEasterEggsProps {
  showEasterEggDiscovery: (title: string, message: string, icon: string) => void;
}

export function MouseEasterEggs({ showEasterEggDiscovery }: MouseEasterEggsProps) {
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showLogoHint, setShowLogoHint] = useState(false);
  
  const t = useTranslations('easterEggs.notifications');
  const tHint = useTranslations('easterEggs.logoHint');

  // Initialize logo click count from localStorage
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('logo-clicks') || '0');
    setLogoClickCount(savedCount);
  }, []);

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
          showEasterEggDiscovery(
            t('heartsDiscovered.title'),
            t('heartsDiscovered.message'),
            '💕'
          );
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

  // Logo click handler
  const handleLogoClick = useCallback(() => {
    const logoClickCount = parseInt(localStorage.getItem('logo-clicks') || '0') + 1;
    localStorage.setItem('logo-clicks', logoClickCount.toString());
    setLogoClickCount(logoClickCount);

    // Show hint after first click
    if (logoClickCount === 1) {
      setShowLogoHint(true);
      setTimeout(() => setShowLogoHint(false), 5000);
    }

    if (logoClickCount % 10 === 0) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 1.0 },
        colors: ['#ffd700', '#ffed4e', '#fbbf24'],
      });
      showEasterEggDiscovery(
        t('logoMaster.title'),
        t('logoMaster.message', { count: logoClickCount }),
        '🏆'
      );
    }
  }, [showEasterEggDiscovery, t]);

  // Attach logo click handler to any element with data-logo attribute
  useEffect(() => {
    const logoElements = document.querySelectorAll('[data-logo]');

    logoElements.forEach(element => {
      element.addEventListener('click', handleLogoClick);
    });

    return () => {
      logoElements.forEach(element => {
        element.removeEventListener('click', handleLogoClick);
      });
    };
  }, [handleLogoClick]);

  return (
    <>
      {/* Logo Click Hint */}
      <AnimatePresence>
        {showLogoHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm border-2 border-yellow-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👆</span>
              <span className="font-bold text-lg">{tHint('title')}</span>
            </div>
            <p className="text-sm opacity-95 font-medium">
              {tHint('message', { current: logoClickCount })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 