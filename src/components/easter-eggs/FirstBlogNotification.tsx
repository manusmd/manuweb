'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Play, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';

interface FirstBlogNotificationProps {
  onPlayGame: () => void;
}

export function FirstBlogNotification({ onPlayGame }: FirstBlogNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  const t = useTranslations('easterEggs.notifications');

  useEffect(() => {
    const checkBlogCompletion = () => {
      const hasShownBefore = localStorage.getItem('first-blog-notification-shown') === 'true';

      if (hasShownBefore) {
        setHasShown(true);
        return;
      }

      const blogState = localStorage.getItem('blog-reading-state');
      if (blogState) {
        const state = JSON.parse(blogState) as Record<string, { completed?: boolean }>;
        const hasCompletedAnyBlog = Object.values(state).some(
          progress => progress.completed === true
        );

        if (hasCompletedAnyBlog && !hasShown) {
          setShowNotification(true);
          setHasShown(true);
          localStorage.setItem('first-blog-notification-shown', 'true');

          // Dispatch custom event for other components
          window.dispatchEvent(
            new CustomEvent('easterEggDiscovered', {
              detail: {
                title: t('firstBlogComplete.title'),
                message: t('firstBlogComplete.message'),
                icon: '🎉',
                type: 'temporary',
                duration: 6000,
              },
            })
          );

          // Unlock the snake game
          localStorage.setItem('konami-unlocked', 'true');

          // Show reward notification after a delay
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('easterEggDiscovered', {
                detail: {
                  title: t('blogReward.title'),
                  message: t('blogReward.message'),
                  icon: '🐍',
                  type: 'temporary',
                  duration: 8000,
                },
              })
            );
          }, 2000);
        }
      }
    };

    // Check immediately
    checkBlogCompletion();

    // Set up interval to check periodically
    const interval = setInterval(checkBlogCompletion, 2000);

    return () => clearInterval(interval);
  }, [hasShown, t]);

  const handlePlayGame = () => {
    setShowNotification(false);
    onPlayGame();
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-purple-400/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <h3 className="font-bold text-lg text-foreground">
                    {t('firstBlogComplete.title')}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/70 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-white/90 leading-relaxed">{t('firstBlogComplete.message')}</p>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <p className="text-sm text-white/80 mb-2">
                    <strong>{t('blogReward.title').replace('!', '')}:</strong>{' '}
                    {t('snakeGame.title')} - {t('snakeGame.subtitle').toLowerCase()}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handlePlayGame}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {t('snakeGame.tooltip')}
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="px-6 border-white/30 text-white hover:bg-white/10"
                  >
                    {t('snakeGame.close')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Modal */}
      <PortfolioSnakeGame isOpen={showSnakeGame} onClose={() => setShowSnakeGame(false)} />
    </>
  );
}
