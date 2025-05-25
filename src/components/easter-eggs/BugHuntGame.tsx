'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import confetti from 'canvas-confetti';

interface BugData {
  id: string;
  x: number;
  y: number;
  type: 'common' | 'rare' | 'legendary';
  points: number;
  emoji: string;
  found: boolean;
}

const BUG_TYPES = {
  common: { emoji: '🐛', points: 10 },
  rare: { emoji: '🦗', points: 25 },
  legendary: { emoji: '🕷️', points: 50 },
};

// Helper function to emit notification events
const emitNotification = (
  title: string,
  message: string,
  icon: string,
  persistent = false,
  onClose?: () => void
) => {
  const event = new CustomEvent('easterEggDiscovered', {
    detail: { title, message, icon, persistent, onClose },
  });
  window.dispatchEvent(event);
};

export function BugHuntGame() {
  const [bugs, setBugs] = useState<BugData[]>([]);
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('easterEggs.notifications');
  const tBugHunt = useTranslations('easterEggs.bugHunt');

  // Ensure we're mounted before using portals
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to clear bug hunt localStorage
  const clearBugHuntStorage = useCallback(() => {
    localStorage.removeItem('bug-hunt-bugs');
    localStorage.removeItem('bug-hunt-found');
    localStorage.removeItem('bug-hunt-active');
    localStorage.removeItem('bug-hunt-completed');
    setBugs([]);
    setFoundBugs([]);
    setIsGameActive(false);
    console.log('Bug Hunt localStorage cleared');
  }, []);

  // Generate random bugs
  const generateBugs = useCallback((): BugData[] => {
    const newBugs: BugData[] = [];
    const bugCounts = { common: 6, rare: 3, legendary: 1 };

    Object.entries(bugCounts).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        const bugType = type as keyof typeof BUG_TYPES;
        newBugs.push({
          id: `${type}-${i}`,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          type: bugType,
          points: BUG_TYPES[bugType].points,
          emoji: BUG_TYPES[bugType].emoji,
          found: false,
        });
      }
    });

    return newBugs;
  }, []);

  const showProgressNotification = useCallback(
    (currentFoundBugs: string[]) => {
      const progressMessage = t('bugHuntProgress.message', {
        found: currentFoundBugs.length,
        total: 10,
      });

      emitNotification(t('bugHuntProgress.title'), progressMessage, '🐛', false, undefined);
    },
    [t]
  );

  // Initialize game state from localStorage
  useEffect(() => {
    const savedBugs = localStorage.getItem('bug-hunt-bugs');
    const savedFoundBugs = localStorage.getItem('bug-hunt-found');
    const gameActive = localStorage.getItem('bug-hunt-active');

    // Only restore if there's an active game in progress
    if (savedBugs && gameActive === 'true') {
      try {
        const parsedBugs = JSON.parse(savedBugs);
        const parsedFound = JSON.parse(savedFoundBugs || '[]');

        setBugs(parsedBugs);
        setFoundBugs(parsedFound);
        setIsGameActive(true);

        // Show progress notification for resumed game
        showProgressNotification(parsedFound);
      } catch (error) {
        console.error('Error loading bug hunt state:', error);
        clearBugHuntStorage();
      }
    }
  }, [clearBugHuntStorage, showProgressNotification]);

  const startBugHunt = useCallback(
    (showStartConfetti = false) => {
      const newBugs = generateBugs();

      setBugs(newBugs);
      setFoundBugs([]);
      setIsGameActive(true);

      localStorage.setItem('bug-hunt-bugs', JSON.stringify(newBugs));
      localStorage.setItem('bug-hunt-found', JSON.stringify([]));
      localStorage.setItem('bug-hunt-active', 'true');

      // Show progress notification
      showProgressNotification([]);

      // Show start notification
      if (showStartConfetti) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#22c55e', '#16a34a', '#15803d'],
        });
      }
    },
    [generateBugs, showProgressNotification]
  );

  // Set up name click handler
  useEffect(() => {
    const handleNameClick = (e: Event) => {
      e.preventDefault();

      // Always start a new game when name is clicked, regardless of current state
      startBugHunt(true);
    };

    // Try multiple selectors to find the name element
    const findNameElement = () => {
      const element1 = document.querySelector('h1 .text-gradient');
      const element2 = document.querySelector('[data-name-trigger]');
      const element3 = document.querySelector('h1 span');

      return element1 || element2 || element3;
    };

    // Set up the click handler with a delay to ensure DOM is ready
    const setupClickHandler = () => {
      const nameElement = findNameElement();
      if (nameElement) {
        nameElement.addEventListener('click', handleNameClick);
        // Add cursor pointer to indicate it's clickable
        (nameElement as HTMLElement).style.cursor = 'pointer';
        (nameElement as HTMLElement).title = tBugHunt('startHint');
        return nameElement;
      }
      return null;
    };

    // Try immediately, then with delays if not found
    let nameElement = setupClickHandler();

    if (!nameElement) {
      const timeout1 = setTimeout(() => {
        nameElement = setupClickHandler();
      }, 100);

      const timeout2 = setTimeout(() => {
        if (!nameElement) {
          nameElement = setupClickHandler();
        }
      }, 500);

      const timeout3 = setTimeout(() => {
        if (!nameElement) {
          nameElement = setupClickHandler();
        }
      }, 1000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        if (nameElement) {
          nameElement.removeEventListener('click', handleNameClick);
        }
      };
    }

    return () => {
      if (nameElement) {
        nameElement.removeEventListener('click', handleNameClick);
      }
    };
  }, [startBugHunt, tBugHunt]);

  const catchBug = (bugId: string) => {
    const bug = bugs.find(b => b.id === bugId);
    if (!bug || foundBugs.includes(bugId)) return;

    const newFoundBugs = [...foundBugs, bugId];
    setFoundBugs(newFoundBugs);

    localStorage.setItem('bug-hunt-found', JSON.stringify(newFoundBugs));

    // Show combined bug caught + progress notification
    const bugTypeKey = `bugTypes.${bug.type}` as const;
    const pointsKey = `points.${bug.type}` as const;

    emitNotification(
      t('bugCaught.title'),
      `${t('bugCaught.message', {
        type: tBugHunt(bugTypeKey),
        points: tBugHunt(pointsKey),
      })} (${newFoundBugs.length}/10)`,
      '🎯',
      false
    );

    // Bug caught animation
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x: bug.x / 100, y: bug.y / 100 },
      colors: ['#22c55e', '#16a34a'],
    });

    // Check if game completed
    if (newFoundBugs.length === 10) {
      completeGame();
    }
  };

  const completeGame = () => {
    setIsGameActive(false);

    // Save completion state but don't block restarting
    localStorage.setItem('bug-hunt-completed', 'true');
    localStorage.removeItem('bug-hunt-active');

    // Epic completion celebration
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.1 + i * 0.2, y: 0.8 },
          colors: ['#22c55e', '#16a34a', '#15803d', '#fbbf24'],
        });
      }, i * 300);
    }

    // Show completion notification
    setTimeout(() => {
      emitNotification(
        t('bugHuntComplete.title'),
        t('bugHuntComplete.message', { total: 10 }),
        '🏆',
        false
      );
    }, 1000);
  };

  // Expose clear function globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clearBugHuntStorage = clearBugHuntStorage;
    }
  }, [clearBugHuntStorage]);

  return (
    <>
      {/* Bugs scattered around the page - rendered via portal to avoid container issues */}
      {isMounted &&
        typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isGameActive &&
              bugs.length > 0 &&
              bugs.map(bug => {
                const isVisible = !foundBugs.includes(bug.id);

                if (!isVisible) return null;

                // Generate unique animation parameters for each bug
                const animationSeed = bug.id
                  .split('')
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const xMovement = 3 + (animationSeed % 5); // 3-7px movement
                const yMovement = 2 + (animationSeed % 4); // 2-5px movement
                const xDuration = 1.5 + (animationSeed % 10) / 10; // 1.5-2.4s duration
                const yDuration = 1.2 + (animationSeed % 8) / 10; // 1.2-1.9s duration
                const initialDelay = (animationSeed % 20) / 10; // 0-1.9s delay
                const rotationAmount = 5 + (animationSeed % 10); // 5-14 degrees

                return (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: [-rotationAmount, rotationAmount, -rotationAmount],
                      x: [0, xMovement, -xMovement, 0],
                      y: [0, -yMovement, yMovement, 0],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: initialDelay,
                      rotate: {
                        repeat: Infinity,
                        duration: 3 + (animationSeed % 15) / 10, // 3-4.4s wiggle
                        ease: 'easeInOut',
                      },
                      x: {
                        repeat: Infinity,
                        duration: xDuration,
                        ease: 'easeInOut',
                      },
                      y: {
                        repeat: Infinity,
                        duration: yDuration,
                        ease: 'easeInOut',
                      },
                    }}
                    className="fixed z-40 cursor-pointer select-none"
                    style={{
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => catchBug(bug.id)}
                    title={`${tBugHunt(`bugTypes.${bug.type}`)} - ${tBugHunt(`points.${bug.type}`)}`}
                  >
                    <div className="text-2xl hover:scale-125 transition-transform duration-200 drop-shadow-lg">
                      {bug.emoji}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

// Extend window type for sequence tracking
declare global {
  interface Window {
    bugHuntSequence?: string;
    clearBugHuntStorage?: () => void;
  }
}
