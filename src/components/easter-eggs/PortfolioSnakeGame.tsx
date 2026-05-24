'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SnakeGameBoard } from '@/components/easter-eggs/snake/SnakeGameBoard';
import {
  SNAKE_CANVAS_SIZE_PX,
  SNAKE_GAME_SPEED_MS,
  SNAKE_GRID_SIZE,
  SNAKE_INITIAL_DIRECTION,
  SNAKE_INITIAL_SNAKE,
  SNAKE_TECH_ICONS,
  type SnakeSegment,
} from '@/components/easter-eggs/snake/snake.constants';
import { Button } from '@/components/ui/button';
import { MQ } from '@/constants/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';
import { Trophy, X } from 'lucide-react';

interface SnakeGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PortfolioSnakeGame({ isOpen, onClose }: SnakeGameProps) {
  const [snake, setSnake] = useState<SnakeSegment[]>(() => [...SNAKE_INITIAL_SNAKE]);
  const [direction, setDirection] = useState<SnakeSegment>(SNAKE_INITIAL_DIRECTION);
  const [food, setFood] = useState<SnakeSegment>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(SNAKE_TECH_ICONS[0]);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const t = useTranslations('easterEggs.snakeGame');
  const isCompactGameViewport = useMediaQuery(MQ.mobileDown);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${String(scrollY)}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * SNAKE_GRID_SIZE),
      y: Math.floor(Math.random() * SNAKE_GRID_SIZE),
    };
    setFood(newFood);
    setCurrentIcon(SNAKE_TECH_ICONS[Math.floor(Math.random() * SNAKE_TECH_ICONS.length)]!);
  }, []);

  const resetGame = useCallback(() => {
    setSnake([...SNAKE_INITIAL_SNAKE]);
    setDirection({ ...SNAKE_INITIAL_DIRECTION });
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    generateFood();
  }, [generateFood]);

  const changeDirection = useCallback(
    (newDirection: SnakeSegment) => {
      if (!isPlaying || gameOver) return;

      if (direction.x !== 0 && newDirection.x !== 0) return;
      if (direction.y !== 0 && newDirection.y !== 0) return;

      setDirection(newDirection);
    },
    [direction, isPlaying, gameOver]
  );

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0]! };

      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= SNAKE_GRID_SIZE || head.y < 0 || head.y >= SNAKE_GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      if (isOpen && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          changeDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    },
    [changeDirection, isPlaying, gameOver, isOpen, onClose]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || !isPlaying || gameOver) return;

      const touch = e.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            changeDirection({ x: 1, y: 0 });
          } else {
            changeDirection({ x: -1, y: 0 });
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            changeDirection({ x: 0, y: 1 });
          } else {
            changeDirection({ x: 0, y: -1 });
          }
        }
      }

      touchStartRef.current = null;
    },
    [changeDirection, isPlaying, gameOver]
  );

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen, resetGame]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, SNAKE_GAME_SPEED_MS);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, handleKeyPress]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
  };

  if (!isOpen) return null;

  const gameSizePx = isCompactGameViewport
    ? typeof window !== 'undefined'
      ? Math.min(window.innerWidth - 32, 350)
      : 350
    : SNAKE_CANVAS_SIZE_PX;
  const cellSizePx = gameSizePx / SNAKE_GRID_SIZE;

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
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">{t('title')}</h2>
            </div>
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <SnakeGameBoard
            gameSizePx={gameSizePx}
            cellSizePx={cellSizePx}
            snake={snake}
            food={food}
            currentIcon={currentIcon}
            score={score}
            isPlaying={isPlaying}
            gameOver={gameOver}
            isCompactViewport={isCompactGameViewport}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onStartClick={startGame}
            onResetClick={resetGame}
            onPauseClick={() => setIsPlaying(false)}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
