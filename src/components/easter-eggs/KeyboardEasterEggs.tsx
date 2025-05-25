'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface KeyboardEasterEggsProps {
  isDeveloperMode: boolean;
  setIsDeveloperMode: (mode: boolean) => void;
  setStyleInfo: (info: any) => void;
  showEasterEggHelp: boolean;
  setShowEasterEggHelp: (show: boolean) => void;
  setNotifications: (fn: (prev: any[]) => any[]) => void;
  showEasterEggDiscovery: (title: string, message: string, icon: string) => void;
}

export function KeyboardEasterEggs({
  isDeveloperMode,
  setIsDeveloperMode,
  setStyleInfo,
  showEasterEggHelp,
  setShowEasterEggHelp,
  setNotifications,
  showEasterEggDiscovery,
}: KeyboardEasterEggsProps) {
  // Easter Egg: Press 'd' key to toggle developer mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 'd') {
        const newDeveloperMode = !isDeveloperMode;
        setIsDeveloperMode(newDeveloperMode);

        if (newDeveloperMode) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00ff00', '#0080ff', '#8000ff'],
          });
          showEasterEggDiscovery(
            'Developer Mode!',
            'Hover over any element to see its CSS properties! Press C for confetti or R to reset! 🚀',
            '👨‍💻'
          );
        } else {
          setStyleInfo(null);
          showEasterEggDiscovery(
            'Developer Mode Off',
            'Developer mode has been disabled. Press D again to re-enable! 💤',
            '😴'
          );
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showEasterEggDiscovery, isDeveloperMode, setIsDeveloperMode, setStyleInfo]);

  // Easter Egg: Press 'a' key to show easter egg help
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 'a') {
        setShowEasterEggHelp(!showEasterEggHelp);

        if (!showEasterEggHelp) {
          showEasterEggDiscovery(
            'Easter Egg Guide!',
            'Here are all the hidden secrets you can discover! 📖',
            '📚'
          );
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showEasterEggDiscovery, showEasterEggHelp, setShowEasterEggHelp]);

  // Easter Egg: Press 'c' key for confetti burst
  useEffect(() => {
    const handleKeyCombo = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();

        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 30,
              angle: 60 + i * 24,
              spread: 55,
              origin: { x: 0.1 + i * 0.2, y: 0.8 },
              colors: colors,
            });
          }, i * 200);
        }

        showEasterEggDiscovery(
          'Confetti Burst!',
          'You discovered the confetti key! Press C anytime for more! 🎊',
          '🎊'
        );
      }
    };

    document.addEventListener('keydown', handleKeyCombo);
    return () => document.removeEventListener('keydown', handleKeyCombo);
  }, [showEasterEggDiscovery]);

  // Easter Egg: Press 'r' key to reset all easter eggs
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 'r') {
        localStorage.removeItem('first-blog-notification-shown');
        localStorage.removeItem('blog-reading-state');
        localStorage.removeItem('konami-unlocked');
        localStorage.removeItem('logo-clicks');
        localStorage.removeItem('bug-hunt-bugs');
        localStorage.removeItem('bug-hunt-found');
        localStorage.removeItem('bug-hunt-active');
        localStorage.removeItem('bug-hunt-completed');

        setNotifications(() => []);
        setIsDeveloperMode(false);
        setStyleInfo(null);

        const nameElement = document.querySelector('h1 .text-gradient');
        if (nameElement) {
          (nameElement as HTMLElement).style.cursor = 'pointer';
          (nameElement as HTMLElement).title = 'Click to start Bug Hunt!';
        }

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        });

        showEasterEggDiscovery(
          'Reset Command!',
          'All easter eggs have been reset! Refresh to test again. 🔄',
          '🔄'
        );
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showEasterEggDiscovery, setNotifications, setIsDeveloperMode, setStyleInfo]);

  return null;
} 