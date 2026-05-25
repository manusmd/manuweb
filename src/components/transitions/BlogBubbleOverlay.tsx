'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import {
  BLOG_BUBBLE_HIDE_EASING,
  BLOG_BUBBLE_HIDE_MS,
  BLOG_BUBBLE_REVEAL_EASING,
  BLOG_BUBBLE_REVEAL_MS,
  getMaxBubbleRadius,
  type BlogBubbleOrigin,
  type BlogBubblePhase,
} from '@/components/transitions/blogBubble.constants';

function useLenisScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return undefined;

    const lenis = window.__lenis;
    lenis?.stop();

    return () => {
      lenis?.start();
      lenis?.resize();
    };
  }, [isLocked]);
}

function runAnimation(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
) {
  const animation = element.animate(keyframes, options);
  return {
    cancel: () => animation.cancel(),
    onfinish: (cb: () => void) => {
      animation.onfinish = () => cb();
    },
  };
}

function bubbleStyle(origin: BlogBubbleOrigin, maxRadius: number, diameter: number): CSSProperties {
  return {
    position: 'absolute',
    left: origin.x,
    top: origin.y,
    width: diameter,
    height: diameter,
    marginLeft: -maxRadius,
    marginTop: -maxRadius,
    borderRadius: '50%',
    transform: 'scale(0)',
    transformOrigin: 'center center',
    pointerEvents: 'none',
    willChange: 'transform, filter',
    background: 'hsl(var(--background))',
    boxShadow: '0 0 0 1px hsl(var(--border) / 0.45), 0 40px 100px -32px rgba(0, 0, 0, 0.45)',
  };
}

interface BlogBubbleOverlayProps {
  origin: BlogBubbleOrigin;
  phase: BlogBubblePhase;
  portalRoot: HTMLElement;
  onHideComplete: () => void;
  onRevealComplete: () => void;
}

export function BlogBubbleOverlay({
  origin,
  phase,
  portalRoot,
  onHideComplete,
  onRevealComplete,
}: BlogBubbleOverlayProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const maxRadius = useMemo(() => getMaxBubbleRadius(), []);
  const diameter = maxRadius * 2;

  useLenisScrollLock(true);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble || !portalRoot) return undefined;

    let cancelled = false;

    if (phase === 'hiding') {
      bubble.style.transform = 'scale(0)';
      bubble.style.filter = 'blur(8px)';

      const animation = runAnimation(
        bubble,
        [
          { transform: 'scale(0)', filter: 'blur(8px)' },
          { transform: 'scale(1.006)', filter: 'blur(0px)', offset: 0.9 },
          { transform: 'scale(1)', filter: 'blur(0px)' },
        ],
        { duration: BLOG_BUBBLE_HIDE_MS, easing: BLOG_BUBBLE_HIDE_EASING, fill: 'forwards' }
      );

      animation.onfinish(() => {
        if (!cancelled) onHideComplete();
      });

      return () => {
        cancelled = true;
        animation.cancel();
      };
    }

    if (phase === 'covered') {
      bubble.style.transform = 'scale(1)';
      bubble.style.filter = 'blur(0px)';
      return undefined;
    }

    if (phase === 'revealing') {
      bubble.style.transform = 'scale(1)';
      bubble.style.filter = 'blur(0px)';

      const animation = runAnimation(
        bubble,
        [
          { transform: 'scale(1)', filter: 'blur(0px)' },
          { transform: 'scale(0)', filter: 'blur(10px)' },
        ],
        { duration: BLOG_BUBBLE_REVEAL_MS, easing: BLOG_BUBBLE_REVEAL_EASING, fill: 'forwards' }
      );

      animation.onfinish(() => {
        if (!cancelled) onRevealComplete();
      });

      return () => {
        cancelled = true;
        animation.cancel();
      };
    }

    return undefined;
  }, [onHideComplete, onRevealComplete, origin, phase, portalRoot]);

  return createPortal(
    <div ref={bubbleRef} aria-hidden style={bubbleStyle(origin, maxRadius, diameter)} />,
    portalRoot
  );
}
