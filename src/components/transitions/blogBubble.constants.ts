export const BLOG_BUBBLE_HIDE_MS = 560;
export const BLOG_BUBBLE_COVERED_HOLD_MS = 72;
export const BLOG_BUBBLE_REVEAL_MS = 480;
export const BLOG_BUBBLE_NAVIGATION_TIMEOUT_MS = 8000;

export const BLOG_BUBBLE_HIDE_EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';
export const BLOG_BUBBLE_REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export type BlogBubblePhase = 'idle' | 'hiding' | 'covered' | 'revealing';

export type BlogBubbleOrigin = { x: number; y: number };

export function getMaxBubbleRadius() {
  if (typeof window === 'undefined') return 2400;
  return Math.hypot(window.innerWidth, window.innerHeight) * 1.12;
}
