'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Gamepad2 } from 'lucide-react';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';

export function PersistentGameButton() {
  const [isGameUnlocked, setIsGameUnlocked] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const t = useTranslations('easterEggs.snakeGame');

  // Check if game is unlocked (user has completed first blog)
  useEffect(() => {
    const checkGameUnlocked = () => {
      const hasReadFirstBlog = localStorage.getItem('first-blog-notification-shown') === 'true';
      setIsGameUnlocked(hasReadFirstBlog);
    };

    // Check initially
    checkGameUnlocked();

    // Listen for storage changes (when user completes first blog)
    const handleStorageChange = () => {
      checkGameUnlocked();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(checkGameUnlocked, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!isGameUnlocked) {
    return null;
  }

  return (
    <>
      {/* Floating Game Button - Positioned above scroll-to-top button */}
      <AnimatePresence>
        {!isGameOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-50"
          >
            <motion.button
              onClick={() => setIsGameOpen(true)}
              className="relative w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Game Icon */}
              <Gamepad2 className="w-5 h-5 text-white absolute inset-0 m-auto group-hover:scale-110 transition-transform" />

              {/* Tooltip */}
              <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🐍</span>
                  <span>{t('tooltip')}</span>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-border"></div>
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-px border-4 border-transparent border-l-background/90"></div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Modal */}
      <PortfolioSnakeGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </>
  );
}
