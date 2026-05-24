'use client';

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { BugDisplayData } from '@/components/easter-eggs/bug-hunt/bugHunt.constants';

interface BugHuntBugsPortalProps {
  mounted: boolean;
  active: boolean;
  bugs: BugDisplayData[];
  foundIds: string[];
  onCatch: (bugId: string) => void;
}

export function BugHuntBugsPortal({
  mounted,
  active,
  bugs,
  foundIds,
  onCatch,
}: BugHuntBugsPortalProps) {
  const tBugHunt = useTranslations('easterEggs.bugHunt');

  if (!mounted || typeof window === 'undefined') {
    return null;
  }

  const visibleBugs = bugs.filter(bug => !foundIds.includes(bug.id));

  return createPortal(
    <AnimatePresence>
      {active &&
        bugs.length > 0 &&
        visibleBugs.map(bug => {
          const animationSeed = bug.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const xMovement = 3 + (animationSeed % 5);
          const yMovement = 2 + (animationSeed % 4);
          const xDuration = 1.5 + (animationSeed % 10) / 10;
          const yDuration = 1.2 + (animationSeed % 8) / 10;
          const initialDelay = (animationSeed % 20) / 10;
          const rotationAmount = 5 + (animationSeed % 10);

          const bugTypeLabel = `bugTypes.${bug.type}` as `bugTypes.${typeof bug.type}`;
          const bugPointsLabel = `points.${bug.type}` as `points.${typeof bug.type}`;

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
                  duration: 3 + (animationSeed % 15) / 10,
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
              className="fixed z-[9999] cursor-pointer select-none"
              style={{
                left: `${String(bug.x)}%`,
                top: `${String(bug.y)}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onCatch(bug.id)}
              title={`${tBugHunt(bugTypeLabel)} - ${tBugHunt(bugPointsLabel)}`}
            >
              <div className="text-2xl hover:scale-125 transition-transform duration-200 drop-shadow-lg">
                {bug.emoji}
              </div>
            </motion.div>
          );
        })}
    </AnimatePresence>,
    document.body
  );
}
