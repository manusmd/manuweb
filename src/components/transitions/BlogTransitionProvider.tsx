'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BlogBubbleOverlay } from '@/components/transitions/BlogBubbleOverlay';
import {
  BLOG_BUBBLE_COVERED_HOLD_MS,
  BLOG_BUBBLE_NAVIGATION_TIMEOUT_MS,
  type BlogBubbleOrigin,
  type BlogBubblePhase,
} from '@/components/transitions/blogBubble.constants';
import { scrollWindowToTop } from '@/lib/scrollTo';

type BlogTransitionState = {
  active: boolean;
  href: string | null;
  origin: BlogBubbleOrigin;
  phase: BlogBubblePhase;
};

type BlogTransitionContextValue = {
  startBlogTransition: (href: string, origin: BlogBubbleOrigin) => void;
  isTransitioning: boolean;
};

const BlogTransitionContext = createContext<BlogTransitionContextValue | null>(null);

function useTransitionPortalRoot(isActive: boolean) {
  const [root] = useState<HTMLElement | null>(() => {
    if (typeof document === 'undefined') return null;

    let el = document.getElementById('blog-transition-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'blog-transition-root';
      el.style.cssText =
        'position:fixed;inset:0;z-index:2147483646;pointer-events:none;overflow:hidden;';
      document.body.appendChild(el);
    }
    return el;
  });

  useEffect(() => {
    if (!root) return;
    root.style.pointerEvents = isActive ? 'auto' : 'none';
  }, [isActive, root]);

  return root;
}

function normalizePath(path: string) {
  const withoutQuery = path.split('?')[0]?.split('#')[0] ?? path;
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

function isBlogArticlePath(path: string) {
  return /\/blog\/[^/]+$/.test(normalizePath(path));
}

export function BlogTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<number | null>(null);
  const coveredHoldRef = useRef<number | null>(null);
  const stateRef = useRef<BlogTransitionState>({
    active: false,
    href: null,
    origin: { x: 0, y: 0 },
    phase: 'idle',
  });

  const [state, setState] = useState<BlogTransitionState>(stateRef.current);
  const portalRoot = useTransitionPortalRoot(state.active);

  const syncState = useCallback((next: BlogTransitionState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearNavigationTimeout = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearCoveredHold = useCallback(() => {
    if (coveredHoldRef.current != null) {
      window.clearTimeout(coveredHoldRef.current);
      coveredHoldRef.current = null;
    }
  }, []);

  const resetTransition = useCallback(() => {
    clearNavigationTimeout();
    clearCoveredHold();
    syncState({
      active: false,
      href: null,
      origin: { x: 0, y: 0 },
      phase: 'idle',
    });
  }, [clearCoveredHold, clearNavigationTimeout, syncState]);

  const startBlogTransition = useCallback(
    (href: string, origin: BlogBubbleOrigin) => {
      if (stateRef.current.active) return;

      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const target = normalizePath(href);

      if (reduceMotion) {
        scrollWindowToTop();
        router.push(target);
        return;
      }

      window.__lenis?.stop();
      clearCoveredHold();
      clearNavigationTimeout();

      syncState({
        active: true,
        href: target,
        origin,
        phase: 'hiding',
      });

      timeoutRef.current = window.setTimeout(resetTransition, BLOG_BUBBLE_NAVIGATION_TIMEOUT_MS);
    },
    [clearCoveredHold, clearNavigationTimeout, resetTransition, router, syncState]
  );

  const handleHideComplete = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'hiding' || !current.href) return;

    syncState({ ...current, phase: 'covered' });

    clearCoveredHold();
    coveredHoldRef.current = window.setTimeout(() => {
      const latest = stateRef.current;
      if (latest.phase !== 'covered' || !latest.href) return;

      router.push(latest.href);
    }, BLOG_BUBBLE_COVERED_HOLD_MS);
  }, [clearCoveredHold, router, syncState]);

  const handleRevealComplete = useCallback(() => {
    resetTransition();
  }, [resetTransition]);

  useEffect(() => {
    const current = stateRef.current;
    if (current.phase !== 'covered' || !current.href) return;
    if (normalizePath(pathname) !== current.href) return;

    clearCoveredHold();
    scrollWindowToTop();
    clearNavigationTimeout();
    syncState({ ...current, phase: 'revealing' });
  }, [clearCoveredHold, clearNavigationTimeout, pathname, syncState]);

  useEffect(() => {
    if (!isBlogArticlePath(pathname)) return;
    scrollWindowToTop();
  }, [pathname]);

  useEffect(
    () => () => {
      clearNavigationTimeout();
      clearCoveredHold();
    },
    [clearCoveredHold, clearNavigationTimeout]
  );

  const value = useMemo(
    () => ({
      startBlogTransition,
      isTransitioning: state.active,
    }),
    [startBlogTransition, state.active]
  );

  return (
    <BlogTransitionContext.Provider value={value}>
      {children}
      {state.active && state.phase !== 'idle' && portalRoot ? (
        <BlogBubbleOverlay
          origin={state.origin}
          phase={state.phase}
          portalRoot={portalRoot}
          onHideComplete={handleHideComplete}
          onRevealComplete={handleRevealComplete}
        />
      ) : null}
    </BlogTransitionContext.Provider>
  );
}

export function useBlogTransition() {
  const context = useContext(BlogTransitionContext);
  if (!context) {
    throw new Error('useBlogTransition must be used within BlogTransitionProvider');
  }
  return context;
}

export type { BlogBubbleOrigin };
