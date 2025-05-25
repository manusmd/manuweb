'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Coffee, Code, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SimpleEasterEggs() {
  const [showHearts, setShowHearts] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showLogoHint, setShowLogoHint] = useState(false);
  const [easterEggNotification, setEasterEggNotification] = useState<{
    title: string;
    message: string;
    icon: string;
  } | null>(null);

  // Initialize logo click count from localStorage
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('logo-clicks') || '0');
    setLogoClickCount(savedCount);
  }, []);

  // Helper function to show easter egg discovery notifications
  const showEasterEggDiscovery = useCallback((title: string, message: string, icon: string) => {
    setEasterEggNotification({ title, message, icon });
    setTimeout(() => setEasterEggNotification(null), 4000);
  }, []);

  // Easter Egg 1: Triple click anywhere to show hearts
  useEffect(() => {
    let clickTimer: NodeJS.Timeout;
    let currentClickCount = 0;
    
    const handleTripleClick = () => {
      currentClickCount++;
      
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        if (currentClickCount >= 3) {
          setShowHearts(true);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#dc143c']
          });
          setTimeout(() => setShowHearts(false), 3000);
          showEasterEggDiscovery('Hearts Discovered!', 'You found the triple-click easter egg! 💕', '💕');
        }
        currentClickCount = 0;
      }, 500);
    };

    document.addEventListener('click', handleTripleClick);
    return () => {
      document.removeEventListener('click', handleTripleClick);
      clearTimeout(clickTimer);
    };
  }, [showEasterEggDiscovery]);

  // Easter Egg 2: Press 'd' key to enable developer mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key.toLowerCase() === 'd') {
        setIsDeveloperMode(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00ff00', '#0080ff', '#8000ff']
        });
        showEasterEggDiscovery('Developer Mode!', 'Welcome, fellow developer! Try pressing C for confetti or R to reset! 🚀', '👨‍💻');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showEasterEggDiscovery]);

  // Easter Egg 3: Press 'c' key for confetti burst
  useEffect(() => {
    const handleKeyCombo = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        
        // Create a burst of confetti
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 30,
              angle: 60 + (i * 24),
              spread: 55,
              origin: { x: 0.1 + (i * 0.2), y: 0.8 },
              colors: colors
            });
          }, i * 200);
        }
        
        showEasterEggDiscovery('Confetti Burst!', 'You discovered the confetti key! Press C anytime for more! 🎊', '🎊');
      }
    };

    document.addEventListener('keydown', handleKeyCombo);
    return () => document.removeEventListener('keydown', handleKeyCombo);
  }, [showEasterEggDiscovery]);

  // Easter Egg 4: Press 'r' key to reset all easter eggs
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key.toLowerCase() === 'r') {
        // Reset all easter egg states
        localStorage.removeItem('first-blog-notification-shown');
        localStorage.removeItem('blog-reading-state');
        localStorage.removeItem('konami-unlocked');
        localStorage.removeItem('logo-clicks');
        
        // Show confirmation
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        });
        
        showEasterEggDiscovery('Reset Command!', 'All easter eggs have been reset! Refresh to test again. 🔄', '🔄');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showEasterEggDiscovery]);

  // Easter Egg 4: Logo click counter (every 10 clicks)
  const handleLogoClick = useCallback(() => {
    const logoClickCount = parseInt(localStorage.getItem('logo-clicks') || '0') + 1;
    localStorage.setItem('logo-clicks', logoClickCount.toString());
    setLogoClickCount(logoClickCount);
    
    // Show hint after first click
    if (logoClickCount === 1) {
      setShowLogoHint(true);
      setTimeout(() => setShowLogoHint(false), 5000);
    }
    
    if (logoClickCount % 10 === 0) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 1.0 },
        colors: ['#ffd700', '#ffed4e', '#fbbf24']
      });
      showEasterEggDiscovery('Logo Master!', `You've clicked the logo ${logoClickCount} times! Golden confetti for your dedication! 🏆`, '🏆');
    }
  }, [showEasterEggDiscovery]);

  // Attach logo click handler to any element with data-logo attribute
  useEffect(() => {
    const logoElements = document.querySelectorAll('[data-logo]');
    
    logoElements.forEach(element => {
      element.addEventListener('click', handleLogoClick);
    });

    return () => {
      logoElements.forEach(element => {
        element.removeEventListener('click', handleLogoClick);
      });
    };
  }, [handleLogoClick]);

  return (
    <>
      {/* Floating Hearts Easter Egg */}
      <AnimatePresence>
        {showHearts && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  scale: 0,
                  rotate: 0
                }}
                animate={{ 
                  y: -100,
                  scale: [0, 1, 0.8, 1, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <Heart className="w-8 h-8 text-pink-500 fill-current" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Universal Easter Egg Discovery Notification */}
      <AnimatePresence>
        {easterEggNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{easterEggNotification.icon}</span>
              <span className="font-semibold">{easterEggNotification.title}</span>
            </div>
            <p className="text-sm opacity-90">
              {easterEggNotification.message}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
              <Sparkles className="w-3 h-3" />
              <span>Easter egg discovered</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Click Hint */}
      <AnimatePresence>
        {showLogoHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm border-2 border-yellow-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👆</span>
              <span className="font-bold text-lg">Keep clicking!</span>
            </div>
            <p className="text-sm opacity-95 font-medium">
              Something special happens at 10 clicks... ({logoClickCount}/10)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Mode Indicator */}
      <AnimatePresence>
        {isDeveloperMode && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-4 left-4 z-40 bg-black/80 text-green-400 px-3 py-2 rounded-md text-sm font-mono"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>DEV_MODE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden CSS for additional effects */}
      <style jsx global>{`
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        .developer-mode-active * {
          transition: all 0.3s ease;
        }
        
        .developer-mode-active *:hover {
          animation: rainbow 2s linear infinite;
        }
      `}</style>
    </>
  );
} 