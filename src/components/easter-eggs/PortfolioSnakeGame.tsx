'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const TECH_ICONS = ['⚛️', '🔥', '⚡', '🚀', '💎', '🎯', '🔧', '📱', '💻', '🌟'];

export function PortfolioSnakeGame({ isOpen, onClose }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(TECH_ICONS[0]);
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
    setCurrentIcon(TECH_ICONS[Math.floor(Math.random() * TECH_ICONS.length)]);
  }, []);

  const resetGame = useCallback(() => {
    setSnake([...INITIAL_SNAKE]);
    setDirection({ ...INITIAL_DIRECTION });
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    generateFood();
  }, [generateFood]);

  const changeDirection = useCallback((newDirection: Position) => {
    if (!isPlaying || gameOver) return;
    
    // Prevent reversing into self
    if (direction.x !== 0 && newDirection.x !== 0) return;
    if (direction.y !== 0 && newDirection.y !== 0) return;
    
    setDirection(newDirection);
  }, [direction, isPlaying, gameOver]);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Prevent default for game-related keys when modal is open
    if (isOpen && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!isPlaying || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        changeDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        changeDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        changeDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        changeDirection({ x: 1, y: 0 });
        break;
    }
  }, [changeDirection, isPlaying, gameOver, isOpen]);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || !isPlaying || gameOver) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          changeDirection({ x: 1, y: 0 }); // Right
        } else {
          changeDirection({ x: -1, y: 0 }); // Left
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          changeDirection({ x: 0, y: 1 }); // Down
        } else {
          changeDirection({ x: 0, y: -1 }); // Up
        }
      }
    }

    touchStartRef.current = null;
  }, [changeDirection, isPlaying, gameOver]);

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen, resetGame]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 200);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when game is open
      document.body.style.overflow = 'hidden';
      
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        // Restore scrolling when game closes
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, handleKeyPress]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
  };

  if (!isOpen) return null;

  const cellSize = CANVAS_SIZE / GRID_SIZE;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const gameSize = isMobile ? Math.min(window.innerWidth - 32, 350) : CANVAS_SIZE;
  const mobileCellSize = gameSize / GRID_SIZE;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-background border border-border rounded-xl p-4 md:p-6 w-full max-w-md shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Portfolio Snake</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm md:text-base text-muted-foreground mb-4 font-medium">
              Collect tech stack icons to grow your portfolio!
            </p>
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border">
              <div className="text-left">
                <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Score</span>
                <div className="text-lg md:text-xl font-bold text-foreground">{score}</div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Next</span>
                <div className="text-2xl">{currentIcon}</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mb-4" style={{ width: gameSize, height: gameSize }}>
            <div 
              className="border-2 border-border rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden"
              style={{ width: gameSize, height: gameSize }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid lines for better visibility */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                  <div key={`v-${i}`}>
                    <div
                      className="absolute bg-border"
                      style={{
                        left: i * mobileCellSize,
                        top: 0,
                        width: 1,
                        height: gameSize,
                      }}
                    />
                    <div
                      className="absolute bg-border"
                      style={{
                        left: 0,
                        top: i * mobileCellSize,
                        width: gameSize,
                        height: 1,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Snake */}
              {isPlaying && snake.map((segment, index) => (
                <div
                  key={`snake-${index}`}
                  className={`absolute border-2 ${
                    index === 0 
                      ? 'bg-green-500 border-green-600 shadow-lg' 
                      : 'bg-green-400 border-green-500'
                  } rounded-sm transition-all duration-100`}
                  style={{
                    left: segment.x * mobileCellSize + 1,
                    top: segment.y * mobileCellSize + 1,
                    width: mobileCellSize - 2,
                    height: mobileCellSize - 2,
                    zIndex: 10,
                  }}
                >
                  {index === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-xs">
                      🐍
                    </div>
                  )}
                </div>
              ))}

              {/* Food */}
              {isPlaying && (
                <div
                  className="absolute flex items-center justify-center text-lg animate-bounce border-2 border-yellow-400 bg-yellow-100 dark:bg-yellow-900 rounded-sm"
                  style={{
                    left: food.x * mobileCellSize + 1,
                    top: food.y * mobileCellSize + 1,
                    width: mobileCellSize - 2,
                    height: mobileCellSize - 2,
                    zIndex: 5,
                  }}
                >
                  {currentIcon}
                </div>
              )}

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">Game Over!</h3>
                    <p className="text-base md:text-lg mb-4 font-medium">Final Score: <span className="font-bold text-yellow-400">{score}</span></p>
                  </div>
                </div>
              )}

              {/* Waiting to start overlay */}
              {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <Play className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Ready to Play?</h3>
                    <p className="text-sm md:text-base font-medium opacity-90">Press Start to begin!</p>
                    {isMobile && (
                      <p className="text-xs md:text-sm mt-2 opacity-75 font-medium">Swipe on the board to control</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-4">
            {!isPlaying && !gameOver && (
              <Button onClick={startGame} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 font-semibold px-6">
                <Play className="w-4 h-4" />
                Start Game
              </Button>
            )}
            
            {gameOver && (
              <Button onClick={resetGame} className="flex items-center gap-2 font-semibold px-6">
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
            )}

            {isPlaying && (
              <Button onClick={() => setIsPlaying(false)} variant="outline" className="flex items-center gap-2 font-semibold px-6">
                ⏸️ Pause
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
              {isMobile ? (
                <>Swipe on the game board to control your snake • Collect tech icons to grow!</>
              ) : (
                <>Use arrow keys or WASD to move • Collect tech icons to grow your snake!</>
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 