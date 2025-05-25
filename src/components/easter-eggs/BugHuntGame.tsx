'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  common: { points: 10, emoji: '🐛', probability: 0.6 },
  rare: { points: 25, emoji: '🐞', probability: 0.3 },
  legendary: { points: 50, emoji: '🦗', probability: 0.1 },
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
  const [isGameActive, setIsGameActive] = useState(false);
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
    console.log('Bug Hunt localStorage cleared');
  }, []);

  // Generate random bugs
  const generateBugs = useCallback(() => {
    const newBugs: BugData[] = [];

    for (let i = 0; i < 10; i++) {
      const rand = Math.random();
      let bugType: keyof typeof BUG_TYPES = 'common';

      if (rand < BUG_TYPES.legendary.probability) {
        bugType = 'legendary';
      } else if (rand < BUG_TYPES.legendary.probability + BUG_TYPES.rare.probability) {
        bugType = 'rare';
      }

      const bug: BugData = {
        id: `bug-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of screen width
        y: Math.random() * 80 + 10, // 10-90% of screen height
        type: bugType,
        points: BUG_TYPES[bugType].points,
        emoji: BUG_TYPES[bugType].emoji,
        found: false,
      };

      newBugs.push(bug);
    }

    return newBugs;
  }, []);

  // Initialize game state from localStorage
  useEffect(() => {
    const savedBugs = localStorage.getItem('bug-hunt-bugs');
    const savedFoundBugs = localStorage.getItem('bug-hunt-found');
    const gameActive = localStorage.getItem('bug-hunt-active');

    // Only restore if there's an active game in progress
    if (savedBugs && gameActive === 'true') {
      setBugs(JSON.parse(savedBugs));
      setFoundBugs(JSON.parse(savedFoundBugs || '[]'));
      setIsGameActive(true);
      showProgressNotification(JSON.parse(savedFoundBugs || '[]'), JSON.parse(savedBugs));
    }
  }, []);

  const showProgressNotification = useCallback(
    (currentFoundBugs: string[], currentBugs: BugData[]) => {
      const totalScore = currentFoundBugs.reduce((score, bugId) => {
        const bug = currentBugs.find(b => b.id === bugId);
        return score + (bug?.points || 0);
      }, 0);

      const progressMessage = `Found: ${currentFoundBugs.length}/10 • Score: ${totalScore}\nClick bugs to catch them!`;

      emitNotification('Bug Hunt Active', progressMessage, '🐛', false, undefined);
    },
    []
  );

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
      showProgressNotification([], newBugs);

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
        (nameElement as HTMLElement).title = 'Click to start Bug Hunt!';
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
  }, [startBugHunt]); // Removed gameCompleted and isGameActive dependencies

  const catchBug = (bugId: string) => {
    const bug = bugs.find(b => b.id === bugId);
    if (!bug || foundBugs.includes(bugId)) return;

    const newFoundBugs = [...foundBugs, bugId];
    setFoundBugs(newFoundBugs);

    localStorage.setItem('bug-hunt-found', JSON.stringify(newFoundBugs));

    // Update progress notification
    showProgressNotification(newFoundBugs, bugs);

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
        'Bug Hunter Master!',
        'Congratulations! You found all 10 bugs scattered around the website! Your debugging skills are legendary! 🏆\n\nClick your name again to play another round!',
        '🏆',
        false
      );
    }, 1000);
  };

  // Expose clear function globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).clearBugHuntStorage = clearBugHuntStorage;
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

                return (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: [0, 5, -5, 0],
                      y: [0, -3, 3, 0],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      x: { repeat: Infinity, duration: 2 + Math.random() },
                      y: { repeat: Infinity, duration: 1.5 + Math.random() },
                    }}
                    className="fixed cursor-pointer z-[9999] hover:scale-125 transition-transform"
                    style={{
                      left: `${bug.x}%`,
                      top: `${bug.y}%`,
                      pointerEvents: 'auto',
                    }}
                    onClick={() => catchBug(bug.id)}
                    title={`${bug.type} bug - ${bug.points} points`}
                  >
                    <div className="text-2xl drop-shadow-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
  }
}
