'use client';

import { useCallback, useEffect, useState } from 'react';
import { BugHuntBugsPortal } from '@/components/easter-eggs/bug-hunt/BugHuntBugsPortal';
import {
  BUG_HUNT_BUG_TYPES,
  BUG_STORAGE_ACTIVE_KEY,
  BUG_STORAGE_BUGS_KEY,
  BUG_STORAGE_COMPLETED_KEY,
  BUG_STORAGE_FOUND_KEY,
  emitBugHuntNotification,
  type BugDisplayData,
  type BugKind,
} from '@/components/easter-eggs/bug-hunt/bugHunt.constants';
import confetti from 'canvas-confetti';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    bugHuntSequence?: string;
    clearBugHuntStorage?: () => void;
  }
}

export function BugHuntGame() {
  const [bugs, setBugs] = useState<BugDisplayData[]>([]);
  const [foundBugs, setFoundBugs] = useState<string[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('easterEggs.notifications');
  const tBugHunt = useTranslations('easterEggs.bugHunt');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearBugHuntStorage = useCallback(() => {
    localStorage.removeItem(BUG_STORAGE_BUGS_KEY);
    localStorage.removeItem(BUG_STORAGE_FOUND_KEY);
    localStorage.removeItem(BUG_STORAGE_ACTIVE_KEY);
    localStorage.removeItem(BUG_STORAGE_COMPLETED_KEY);
    setBugs([]);
    setFoundBugs([]);
    setIsGameActive(false);
  }, []);

  const generateBugs = useCallback((): BugDisplayData[] => {
    const next: BugDisplayData[] = [];
    const counts: Record<BugKind, number> = { common: 6, rare: 3, legendary: 1 };

    (Object.entries(counts) as [BugKind, number][]).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        const spec = BUG_HUNT_BUG_TYPES[type];
        next.push({
          id: `${type}-${i}`,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          type,
          points: spec.points,
          emoji: spec.emoji,
          found: false,
        });
      }
    });

    return next;
  }, []);

  const showProgressNotification = useCallback(
    (currentFound: string[]) => {
      emitBugHuntNotification(
        t('bugHuntProgress.title'),
        t('bugHuntProgress.message', {
          found: currentFound.length,
          total: 10,
        }),
        '🐛',
        false,
        undefined
      );
    },
    [t]
  );

  useEffect(() => {
    const savedBugs = localStorage.getItem(BUG_STORAGE_BUGS_KEY);
    const savedFound = localStorage.getItem(BUG_STORAGE_FOUND_KEY);
    const active = localStorage.getItem(BUG_STORAGE_ACTIVE_KEY);

    if (!savedBugs || active !== 'true') return;

    try {
      const parsedBugs = JSON.parse(savedBugs) as BugDisplayData[];
      const parsedFound = JSON.parse(savedFound ?? '[]') as string[];

      setBugs(parsedBugs);
      setFoundBugs(parsedFound);
      setIsGameActive(true);
      showProgressNotification(parsedFound);
    } catch {
      clearBugHuntStorage();
    }
  }, [clearBugHuntStorage, showProgressNotification]);

  const completeGame = useCallback(() => {
    setIsGameActive(false);
    setBugs([]);

    localStorage.setItem(BUG_STORAGE_COMPLETED_KEY, 'true');
    localStorage.removeItem(BUG_STORAGE_ACTIVE_KEY);
    localStorage.removeItem(BUG_STORAGE_BUGS_KEY);

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

    setTimeout(() => {
      emitBugHuntNotification(
        t('bugHuntComplete.title'),
        t('bugHuntComplete.message', { total: 10 }),
        '🏆',
        false,
        undefined
      );
    }, 1000);
  }, [t]);

  const catchBug = useCallback(
    (bugId: string) => {
      const bug = bugs.find(b => b.id === bugId);
      if (!bug || foundBugs.includes(bugId)) return;

      const nextFound = [...foundBugs, bugId];
      setFoundBugs(nextFound);
      localStorage.setItem(BUG_STORAGE_FOUND_KEY, JSON.stringify(nextFound));

      emitBugHuntNotification(
        t('bugCaught.title'),
        `${t('bugCaught.message', {
          type: tBugHunt(`bugTypes.${bug.type}`),
          points: tBugHunt(`points.${bug.type}`),
        })} (${String(nextFound.length)}/10)`,
        '🎯',
        false,
        undefined
      );

      confetti({
        particleCount: 20,
        spread: 45,
        origin: { x: bug.x / 100, y: bug.y / 100 },
        colors: ['#22c55e', '#16a34a'],
      });

      if (nextFound.length === 10) {
        completeGame();
      }
    },
    [bugs, foundBugs, t, tBugHunt, completeGame]
  );

  const startBugHunt = useCallback(
    (showStartConfetti = false) => {
      setBugs([]);
      setFoundBugs([]);
      setIsGameActive(false);

      setTimeout(() => {
        const newBugs = generateBugs();
        setBugs(newBugs);
        setFoundBugs([]);
        setIsGameActive(true);

        localStorage.setItem(BUG_STORAGE_BUGS_KEY, JSON.stringify(newBugs));
        localStorage.setItem(BUG_STORAGE_FOUND_KEY, JSON.stringify([]));
        localStorage.setItem(BUG_STORAGE_ACTIVE_KEY, 'true');

        showProgressNotification([]);

        if (showStartConfetti) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#22c55e', '#16a34a', '#15803d'],
          });
        }
      }, 100);
    },
    [generateBugs, showProgressNotification]
  );

  useEffect(() => {
    const handleNameClick = (e: Event) => {
      e.preventDefault();

      if (isGameActive) {
        clearBugHuntStorage();
      }

      startBugHunt(true);
    };

    const findNameElement = (): Element | null =>
      document.querySelector('h1 .text-gradient') ||
      document.querySelector('[data-name-trigger]') ||
      document.querySelector('h1 span');

    let attached: Element | null = findNameElement();
    let t1 = 0;
    let t2 = 0;
    let t3 = 0;

    const attach = (): Element | null => {
      const el = findNameElement();
      if (!el) return null;

      el.addEventListener('click', handleNameClick);
      const node = el as HTMLElement;
      node.style.cursor = 'pointer';
      node.title = tBugHunt('startHint');

      return el;
    };

    attached = attach();
    if (!attached) {
      t1 = window.setTimeout(() => {
        if (!attached) attached = attach();
      }, 100);
      t2 = window.setTimeout(() => {
        if (!attached) attached = attach();
      }, 500);
      t3 = window.setTimeout(() => {
        if (!attached) attached = attach();
      }, 1000);
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      if (attached) {
        attached.removeEventListener('click', handleNameClick);
      }
    };
  }, [clearBugHuntStorage, startBugHunt, tBugHunt, isGameActive]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clearBugHuntStorage = clearBugHuntStorage;
    }
  }, [clearBugHuntStorage]);

  return (
    <BugHuntBugsPortal
      mounted={isMounted}
      active={isGameActive}
      bugs={bugs}
      foundIds={foundBugs}
      onCatch={catchBug}
    />
  );
}
