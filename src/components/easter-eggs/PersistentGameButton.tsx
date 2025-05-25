'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';

export function PersistentGameButton() {
  const [isGameUnlocked, setIsGameUnlocked] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

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
      {/* Floating Game Button */}
      <AnimatePresence>
        {!isGameOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setIsGameOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-3 group"
              size="sm"
              title="Play Snake Game"
            >
              <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Modal */}
      <PortfolioSnakeGame 
        isOpen={isGameOpen} 
        onClose={() => setIsGameOpen(false)} 
      />
    </>
  );
} 