'use client';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface LoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  className?: string;
}

/**
 * Full-screen loading overlay for the initial home-page load.
 *
 * The cover (fixed positioning, high z-index, solid opaque background, opacity)
 * is expressed entirely with INLINE styles rather than Tailwind classes or
 * framer-motion. That guarantees the overlay is painted opaque on the very
 * first frame from the server-rendered HTML — before the Tailwind bundle is
 * applied and before hydration runs — so page content can never flash through
 * behind it. The background is hardcoded to the dark theme's `--background`
 * (`hsl(219 20% 5%)`), which is safe because the site always renders in dark
 * mode (`<html class="dark">`).
 */
export function LoadingScreen({ isVisible, progress = 0, className = '' }: LoadingScreenProps) {
  // Lock body scroll while the overlay is visible.
  useBodyScrollLock(isVisible);

  return (
    <div
      aria-hidden={!isVisible}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0c0f',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0.5s',
      }}
    >
      <div className="flex flex-col items-center gap-6 px-4">
        <span className="text-gradient font-display text-3xl font-bold tracking-tight motion-safe:animate-pulse sm:text-4xl">
          manu
        </span>

        <div className="h-[3px] w-40 overflow-hidden rounded-full bg-muted sm:w-48">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 10px hsla(var(--accent-blue), 0.55)',
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}
