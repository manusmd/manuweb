'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gamepad2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';
import confetti from 'canvas-confetti';

interface FirstBlogNotificationProps {
  onDismiss?: () => void;
}

export function FirstBlogNotification({ onDismiss }: FirstBlogNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  useEffect(() => {
    // Check if notification has already been shown
    const hasShownBefore = localStorage.getItem('first-blog-notification-shown');
    if (hasShownBefore) {
      setHasShown(true);
      return;
    }

    const handleFirstBlogCompleted = (event: CustomEvent) => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('first-blog-notification-shown', 'true');
        
        // Trigger celebration confetti
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#06d6a0', '#ffd60a'],
          });
        }, 500);
      }
    };

    window.addEventListener('firstBlogCompleted', handleFirstBlogCompleted as EventListener);

    return () => {
      window.removeEventListener('firstBlogCompleted', handleFirstBlogCompleted as EventListener);
    };
  }, [hasShown]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handlePlayGame = () => {
    setShowSnakeGame(true);
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-md border border-primary/20 rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-background/20"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    First blog completed
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-sm text-foreground mb-3">
                  You've just finished reading your first blog post! As a reward, I've unlocked a special mini-game for you.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/30 rounded-lg p-3 border border-border/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Reward:</strong> Portfolio Snake Game - collect tech stack icons!
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePlayGame}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white"
                  size="sm"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Game!
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  size="sm"
                  className="border-border/50 hover:bg-background/50"
                >
                  Later
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Modal */}
      <PortfolioSnakeGame 
        isOpen={showSnakeGame} 
        onClose={() => setShowSnakeGame(false)} 
      />
    </>
  );
} 