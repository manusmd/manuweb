'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioSnakeGame } from './PortfolioSnakeGame';
import confetti from 'canvas-confetti';

interface KonamiCodeHandlerProps {
  onGameStart?: () => void;
}

export function KonamiCodeHandler({ onGameStart }: KonamiCodeHandlerProps) {
  const [isGameUnlocked, setIsGameUnlocked] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  
  // The classic Konami code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    // Check if game was already unlocked
    const gameUnlocked = localStorage.getItem('konami-game-unlocked');
    if (gameUnlocked) {
      setIsGameUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.code].slice(-konamiCode.length);
      setSequence(newSequence);

      // Check if the sequence matches the Konami code
      if (newSequence.length === konamiCode.length && 
          newSequence.every((key, index) => key === konamiCode[index])) {
        
        if (!isGameUnlocked) {
          // First time unlocking
          setIsGameUnlocked(true);
          setShowGameModal(true);
          localStorage.setItem('konami-game-unlocked', 'true');
          
          // Celebration effects
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          onGameStart?.();
        } else {
          // Already unlocked, just show the game
          setShowSnakeGame(true);
        }
        
        setSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, konamiCode, isGameUnlocked, onGameStart]);

  const handlePlayGame = () => {
    setShowGameModal(false);
    setShowSnakeGame(true);
  };

  const handleCloseModal = () => {
    setShowGameModal(false);
  };

  const handleCloseGame = () => {
    setShowSnakeGame(false);
  };

  return (
    <>
      {/* Game Unlock Modal */}
      <AnimatePresence>
        {showGameModal && (
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
              className="bg-background border border-border rounded-xl p-6 max-w-md w-full text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Trophy className="w-12 h-12 text-yellow-500" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">🎉 Easter Egg Unlocked!</h2>
              <p className="text-muted-foreground mb-6">
                You've discovered the secret Konami code! Enjoy a special portfolio-themed Snake game.
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={handlePlayGame} className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Play Game
                </Button>
                <Button variant="outline" onClick={handleCloseModal}>
                  <X className="w-4 h-4" />
                  Maybe Later
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Tip: Use the Konami code again anytime to play!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game */}
      <PortfolioSnakeGame 
        isOpen={showSnakeGame} 
        onClose={handleCloseGame} 
      />
    </>
  );
} 