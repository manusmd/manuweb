'use client';

import type { SnakeSegment } from '@/components/easter-eggs/snake/snake.constants';
import { SNAKE_GRID_SIZE } from '@/components/easter-eggs/snake/snake.constants';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface SnakeGameBoardProps {
  gameSizePx: number;
  cellSizePx: number;
  snake: SnakeSegment[];
  food: SnakeSegment;
  currentIcon: string;
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
  isCompactViewport: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onStartClick: () => void;
  onResetClick: () => void;
  onPauseClick: () => void;
}

export function SnakeGameBoard({
  gameSizePx,
  cellSizePx,
  snake,
  food,
  currentIcon,
  score,
  isPlaying,
  gameOver,
  isCompactViewport,
  onTouchStart,
  onTouchEnd,
  onStartClick,
  onResetClick,
  onPauseClick,
}: SnakeGameBoardProps) {
  const t = useTranslations('easterEggs.snakeGame');

  return (
    <>
      <div className="text-center mb-6">
        <p className="text-sm md:text-base text-muted-foreground mb-4 font-medium">
          {t('subtitle')}
        </p>
        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border">
          <div className="text-left">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              {t('score', { score: '' }).replace(': ', '')}
            </span>
            <div className="text-lg md:text-xl font-bold text-foreground">{score}</div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              {t('nextFood')}
            </span>
            <div className="text-2xl">{currentIcon}</div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mb-4" style={{ width: gameSizePx, height: gameSizePx }}>
        <div
          className="border-2 border-border rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden"
          style={{ width: gameSizePx, height: gameSizePx }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: SNAKE_GRID_SIZE + 1 }).map((_, i) => (
              <div key={`grid-${String(i)}`}>
                <div
                  className="absolute bg-border"
                  style={{
                    left: i * cellSizePx,
                    top: 0,
                    width: 1,
                    height: gameSizePx,
                  }}
                />
                <div
                  className="absolute bg-border"
                  style={{
                    left: 0,
                    top: i * cellSizePx,
                    width: gameSizePx,
                    height: 1,
                  }}
                />
              </div>
            ))}
          </div>

          {isPlaying &&
            snake.map((segment, index) => (
              <div
                key={`snake-${segment.x}-${segment.y}-${String(index)}`}
                className={`absolute border-2 ${
                  index === 0
                    ? 'bg-green-500 border-green-600 shadow-lg'
                    : 'bg-green-400 border-green-500'
                } rounded-sm transition-all duration-100`}
                style={{
                  left: segment.x * cellSizePx + 1,
                  top: segment.y * cellSizePx + 1,
                  width: cellSizePx - 2,
                  height: cellSizePx - 2,
                  zIndex: 10,
                }}
              >
                {index === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-xs">🐍</div>
                )}
              </div>
            ))}

          {isPlaying && (
            <div
              className="absolute flex items-center justify-center text-lg animate-bounce border-2 border-yellow-400 bg-yellow-100 dark:bg-yellow-900 rounded-sm"
              style={{
                left: food.x * cellSizePx + 1,
                top: food.y * cellSizePx + 1,
                width: cellSizePx - 2,
                height: cellSizePx - 2,
                zIndex: 5,
              }}
            >
              {currentIcon}
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">{t('gameOver')}</h3>
                <p className="text-base md:text-lg mb-4 font-medium">
                  {t('finalScore', { score })}
                </p>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <Play className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t('instructions.title')}</h3>
                <p className="text-sm md:text-base font-medium opacity-90">
                  {t('instructions.goal')}
                </p>
                {isCompactViewport && (
                  <p className="text-xs md:text-sm mt-2 opacity-75 font-medium">
                    {t('instructions.mobile')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-center mb-4">
        {!isPlaying && !gameOver && (
          <Button
            onClick={onStartClick}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 font-semibold px-6"
          >
            <Play className="w-4 h-4" />
            {t('startGame')}
          </Button>
        )}

        {gameOver && (
          <Button onClick={onResetClick} className="flex items-center gap-2 font-semibold px-6">
            <RotateCcw className="w-4 h-4" />
            {t('playAgain')}
          </Button>
        )}

        {isPlaying && (
          <Button
            type="button"
            onClick={onPauseClick}
            variant="outline"
            className="flex items-center gap-2 font-semibold px-6"
          >
            ⏸️ {t('pause')}
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
          {isCompactViewport ? t('instructions.mobile') : t('instructions.desktop')}
        </p>
      </div>
    </>
  );
}
