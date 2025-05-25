'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';

export function FirstBlogNotification() {
  const [hasShown, setHasShown] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  const t = useTranslations('easterEggs.notifications');
  const tKonami = useTranslations('easterEggs.konamiCode.unlocked');

  useEffect(() => {
    const checkBlogCompletion = () => {
      const hasShownBefore = localStorage.getItem('first-blog-notification-shown') === 'true';

      if (hasShownBefore) {
        setHasShown(true);
        return;
      }

      const blogState = localStorage.getItem('blog-reading-state');

      if (blogState) {
        try {
          const state = JSON.parse(blogState) as {
            hasReadFirstBlog?: boolean;
            completedBlogs?: string[];
          };

          // Check if user has completed any blog (either hasReadFirstBlog flag or completedBlogs array)
          const hasCompletedAnyBlog =
            state.hasReadFirstBlog === true ||
            (state.completedBlogs && state.completedBlogs.length > 0);

          if (hasCompletedAnyBlog && !hasShown) {
            setHasShown(true);
            localStorage.setItem('first-blog-notification-shown', 'true');

            // Show persistent notification with game unlock
            window.dispatchEvent(
              new CustomEvent('easterEggDiscovered', {
                detail: {
                  title: t('blogReward.title'),
                  message: `${t('firstBlogComplete.message')} ${t('blogReward.message')}`,
                  icon: '🎉',
                  persistent: true,
                  actions: [
                    {
                      label: tKonami('playGame'),
                      onClick: () => {
                        setShowSnakeGame(true);
                      },
                    },
                  ],
                },
              })
            );

            // Unlock the snake game
            localStorage.setItem('konami-unlocked', 'true');
          }
        } catch (error) {
          console.warn('Failed to parse blog reading state:', error);
        }
      }
    };

    // Check immediately
    checkBlogCompletion();

    // Set up interval to check periodically
    const interval = setInterval(checkBlogCompletion, 2000);

    return () => clearInterval(interval);
  }, [hasShown, t, tKonami]);

  return (
    <>
      {/* Snake Game Modal */}
      <PortfolioSnakeGame isOpen={showSnakeGame} onClose={() => setShowSnakeGame(false)} />
    </>
  );
}
