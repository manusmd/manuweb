'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Code, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  type: 'temporary' | 'persistent';
  duration?: number;
  onClose?: () => void;
}

interface StyleInfo {
  x: number;
  y: number;
  tagName: string;
  className: string;
  styles: { [key: string]: string };
}

export function SimpleEasterEggs() {
  const [showHearts, setShowHearts] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showLogoHint, setShowLogoHint] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [styleInfo, setStyleInfo] = useState<StyleInfo | null>(null);
  const [showEasterEggHelp, setShowEasterEggHelp] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Initialize logo click count from localStorage
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('logo-clicks') || '0');
    setLogoClickCount(savedCount);
  }, []);

  // Notification management functions
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove temporary notifications
    if (notification.type === 'temporary') {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 4000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Helper function to show easter egg discovery notifications
  const showEasterEggDiscovery = useCallback(
    (title: string, message: string, icon: string) => {
      addNotification({
        title,
        message,
        icon,
        type: 'temporary',
        duration: 4000,
      });
    },
    [addNotification]
  );

  // Listen for custom easter egg discovery events
  useEffect(() => {
    const handleEasterEggDiscovered = (event: CustomEvent) => {
      const { title, message, icon, persistent, onClose } = event.detail;
      addNotification({
        title,
        message,
        icon,
        type: persistent ? 'persistent' : 'temporary',
        duration: persistent ? undefined : 4000,
        onClose,
      });
    };

    window.addEventListener('easterEggDiscovered', handleEasterEggDiscovered as EventListener);
    return () =>
      window.removeEventListener('easterEggDiscovered', handleEasterEggDiscovered as EventListener);
  }, [addNotification]);

  // Developer mode hover inspector
  useEffect(() => {
    if (!isDeveloperMode) {
      setStyleInfo(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('.dev-tooltip')) return; // Don't inspect the tooltip itself

      const computedStyles = window.getComputedStyle(target);
      const rect = target.getBoundingClientRect();

      // Get the most relevant CSS properties
      const relevantStyles = {
        display: computedStyles.display,
        position: computedStyles.position,
        width: computedStyles.width,
        height: computedStyles.height,
        padding: computedStyles.padding,
        margin: computedStyles.margin,
        background: computedStyles.backgroundColor,
        color: computedStyles.color,
        'font-size': computedStyles.fontSize,
        'font-weight': computedStyles.fontWeight,
        border: computedStyles.border,
        'border-radius': computedStyles.borderRadius,
        'z-index': computedStyles.zIndex,
        opacity: computedStyles.opacity,
        transform: computedStyles.transform,
      };

      // Filter out default/empty values
      const filteredStyles: { [key: string]: string } = {};
      Object.entries(relevantStyles).forEach(([key, value]) => {
        if (
          value &&
          value !== 'none' &&
          value !== 'auto' &&
          value !== 'normal' &&
          value !== 'rgba(0, 0, 0, 0)'
        ) {
          filteredStyles[key] = value;
        }
      });

      // Handle className properly for both HTML and SVG elements
      let className = '';
      if (target instanceof SVGElement) {
        // For SVG elements, className is an SVGAnimatedString
        className = target.className.baseVal || '';
      } else {
        // For HTML elements, className is a string
        className = target.className || '';
      }

      // Smart positioning logic with actual tooltip dimensions
      let tooltipWidth = 320; // Default fallback
      let tooltipHeight = 250; // Default fallback

      // Get actual tooltip dimensions if available
      if (tooltipRef.current) {
        const rect = tooltipRef.current.getBoundingClientRect();
        tooltipWidth = rect.width || 320;
        tooltipHeight = rect.height || 250;
      }

      const offset = 2; // Minimal 2px offset for very tight positioning
      const margin = 2; // Minimal 2px margin from screen edges

      // Calculate available space in each direction
      const spaceRight = window.innerWidth - e.clientX;
      const spaceLeft = e.clientX;
      const spaceBelow = window.innerHeight - e.clientY;
      const spaceAbove = e.clientY;

      let x, y;

      // Check if we're in a corner situation where we need to position diagonally
      const needsLeftPosition = spaceRight < tooltipWidth + offset + margin;
      const needsAbovePosition = spaceBelow < tooltipHeight + offset + margin;

      // Handle corner cases first (bottom-right, top-right, bottom-left, top-left)
      if (needsLeftPosition && needsAbovePosition) {
        // Bottom-right corner: position above and to the left, almost touching cursor
        x = e.clientX - tooltipWidth - offset;
        y = e.clientY - tooltipHeight - offset;
      } else if (needsLeftPosition && spaceAbove < tooltipHeight + offset + margin) {
        // Top-right corner: position below and to the left
        x = e.clientX - tooltipWidth - offset;
        y = e.clientY + offset;
      } else if (spaceLeft < tooltipWidth + offset + margin && needsAbovePosition) {
        // Bottom-left corner: position above and to the right
        x = e.clientX + offset;
        y = e.clientY - tooltipHeight - offset;
      } else if (
        spaceLeft < tooltipWidth + offset + margin &&
        spaceAbove < tooltipHeight + offset + margin
      ) {
        // Top-left corner: position below and to the right
        x = e.clientX + offset;
        y = e.clientY + offset;
      } else {
        // Not in a corner, use standard positioning logic

        // Determine horizontal position
        if (spaceRight >= tooltipWidth + offset + margin) {
          // Enough space on the right
          x = e.clientX + offset;
        } else if (spaceLeft >= tooltipWidth + offset + margin) {
          // Not enough space on right, try left with minimal gap
          x = e.clientX - tooltipWidth - offset;
        } else {
          // Not enough space on either side, position optimally
          if (spaceRight > spaceLeft) {
            x = window.innerWidth - tooltipWidth - margin;
          } else {
            x = margin;
          }
        }

        // Determine vertical position
        if (spaceBelow >= tooltipHeight + offset + margin) {
          // Enough space below
          y = e.clientY + offset;
        } else if (spaceAbove >= tooltipHeight + offset + margin) {
          // Not enough space below, try above with minimal gap
          y = e.clientY - tooltipHeight - offset;
        } else {
          // Not enough space above or below, position optimally
          if (spaceBelow > spaceAbove) {
            y = window.innerHeight - tooltipHeight - margin;
          } else {
            y = margin;
          }
        }
      }

      // Final safety clamps - only prevent going completely off screen
      x = Math.max(0, Math.min(x, window.innerWidth - tooltipWidth));
      y = Math.max(0, Math.min(y, window.innerHeight - tooltipHeight));

      setStyleInfo({
        x: x,
        y: y,
        tagName: target.tagName.toLowerCase(),
        className: className,
        styles: filteredStyles,
      });
    };

    const handleMouseLeave = () => {
      setStyleInfo(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDeveloperMode]);

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
            colors: ['#ff69b4', '#ff1493', '#dc143c'],
          });
          setTimeout(() => setShowHearts(false), 3000);
          showEasterEggDiscovery(
            'Hearts Discovered!',
            'You found the triple-click easter egg! 💕',
            '💕'
          );
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

  // Easter Egg 2: Press 'd' key to toggle developer mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key.toLowerCase() === 'd') {
        const newDeveloperMode = !isDeveloperMode;
        setIsDeveloperMode(newDeveloperMode);

        if (newDeveloperMode) {
          // Turning on developer mode
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
          // Turning off developer mode
          setStyleInfo(null); // Clear any visible tooltip
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
  }, [showEasterEggDiscovery, isDeveloperMode]);

  // Easter Egg: Press 'a' key to show easter egg help
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
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
  }, [showEasterEggDiscovery, showEasterEggHelp]);

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
        localStorage.removeItem('bug-hunt-bugs');
        localStorage.removeItem('bug-hunt-found');
        localStorage.removeItem('bug-hunt-active');
        localStorage.removeItem('bug-hunt-completed');

        // Clear all notifications
        setNotifications([]);

        // Reset developer mode
        setIsDeveloperMode(false);
        setStyleInfo(null);

        // Reset name element styling
        const nameElement = document.querySelector('h1 .text-gradient');
        if (nameElement) {
          (nameElement as HTMLElement).style.cursor = 'pointer';
          (nameElement as HTMLElement).title = 'Click to start Bug Hunt!';
        }

        // Show confirmation
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
        colors: ['#ffd700', '#ffed4e', '#fbbf24'],
      });
      showEasterEggDiscovery(
        'Logo Master!',
        `You've clicked the logo ${logoClickCount} times! Golden confetti for your dedication! 🏆`,
        '🏆'
      );
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
                  rotate: 0,
                }}
                animate={{
                  y: -100,
                  scale: [0, 1, 0.8, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute"
              >
                <Heart className="w-8 h-8 text-pink-500 fill-current" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Developer Mode Style Inspector Tooltip */}
      <AnimatePresence>
        {isDeveloperMode && styleInfo && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="dev-tooltip fixed z-[9999] pointer-events-none"
            style={{
              left: styleInfo.x,
              top: styleInfo.y,
            }}
          >
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg shadow-2xl border border-green-500/30 max-w-xs font-mono text-xs">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
                <Code className="w-4 h-4" />
                <span className="font-bold text-green-300">&lt;{styleInfo.tagName}&gt;</span>
              </div>

              {styleInfo.className && (
                <div className="mb-2 pb-2 border-b border-green-500/20">
                  <span className="text-blue-400">class:</span>
                  <div className="text-yellow-300 break-all text-[10px] mt-1">
                    {styleInfo.className}
                  </div>
                </div>
              )}

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {Object.entries(styleInfo.styles).map(([property, value]) => (
                  <div key={property} className="flex flex-col">
                    <span className="text-cyan-400">{property}:</span>
                    <span className="text-white ml-2 break-all text-[10px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Help Window */}
      <AnimatePresence>
        {showEasterEggHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEasterEggHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-background border border-border rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎮</span>
                  <h2 className="text-2xl font-bold tracking-tight">Easter Egg Guide</h2>
                </div>
                <button
                  onClick={() => setShowEasterEggHelp(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4">
                  {/* Keyboard Shortcuts */}
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      ⌨️ Keyboard Shortcuts
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                          D
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Toggle Developer Mode (CSS Inspector)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                          C
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Colorful Confetti Burst
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                          R
                        </span>
                        <span className="text-sm text-muted-foreground">Reset All Easter Eggs</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                          A
                        </span>
                        <span className="text-sm text-muted-foreground">Show This Help Guide</span>
                      </div>
                    </div>
                  </div>

                  {/* Mouse Actions */}
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      🖱️ Mouse Actions
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Triple Click Anywhere</span>
                        <span className="text-sm text-muted-foreground">
                          Floating Hearts Animation
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Click Logo (10x)</span>
                        <span className="text-sm text-muted-foreground">
                          Golden Confetti Celebration
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Click Name in Hero</span>
                        <span className="text-sm text-muted-foreground">Start Bug Hunt Game</span>
                      </div>
                    </div>
                  </div>

                  {/* Games & Activities */}
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      🎯 Games & Activities
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Portfolio Snake Game</span>
                        <span className="text-sm text-muted-foreground">
                          Click game button or complete first blog
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bug Hunt Game</span>
                        <span className="text-sm text-muted-foreground">
                          Find 10 hidden bugs across the site
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Blog Reading Rewards</span>
                        <span className="text-sm text-muted-foreground">
                          Complete reading any blog post
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      💡 Pro Tips
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Developer mode shows CSS properties when hovering over elements</p>
                      <p>• Bug hunt progress is saved - you can continue later</p>
                      <p>• Some easter eggs unlock others - explore to find them all!</p>
                      <p>• Press 'R' to reset everything and start fresh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="font-mono bg-muted px-2 py-1 rounded text-xs">A</kbd> again
                  to close this guide
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification System */}
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, scale: 0.8, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 100 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg"
              style={{
                marginTop: index > 0 ? '12px' : '0',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{notification.icon}</span>
                  <span className="font-semibold">{notification.title}</span>
                </div>
                {notification.type === 'persistent' && (
                  <button
                    onClick={() => {
                      if (notification.onClose) {
                        notification.onClose();
                      }
                      removeNotification(notification.id);
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm opacity-90">{notification.message}</p>
              <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                <Sparkles className="w-3 h-3" />
                <span>
                  {notification.type === 'persistent' ? 'Active' : 'Easter egg discovered'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
              <Code className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden CSS for additional effects */}
      <style jsx global>{`
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        .developer-mode-active * {
          transition: all 0.3s ease;
        }

        .developer-mode-active *:hover {
          animation: rainbow 2s linear infinite;
          outline: 2px dashed #00ff00;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}
