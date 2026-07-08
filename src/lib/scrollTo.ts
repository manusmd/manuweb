/**
 * Scroll ownership (single source of truth)
 * -----------------------------------------
 * Lenis owns the scroll position. It is created once in `SmoothScroll` and
 * exposed as `window.__lenis`; a `ScrollTrigger.scrollerProxy` bridges GSAP to
 * it, so GSAP reads/writes scroll through Lenis too. Under reduced motion Lenis
 * is not created and native scrolling applies.
 *
 * Therefore, all *programmatic* scrolling should go through the Lenis-aware
 * helpers in this module (`scrollWindowTo` / `scrollWindowToTop`) so it stays in
 * sync with Lenis + ScrollTrigger, rather than calling `window.scrollTo` or
 * `Element.scrollIntoView` directly.
 *
 * Known legacy call sites still using native scrolling (candidates to migrate
 * onto these helpers, kept as-is for now to avoid behavior changes): the hero
 * CTA buttons (`HeroSection`), header nav (`Header`), `SectionScrollNav`,
 * `TableOfContents`, and the back-to-top button (`ScrollProgress`). Low-level
 * scroll-lock/proxy internals (`SmoothScroll`, `useBodyScrollLock`) intentionally
 * use native APIs.
 */

type LenisLike = {
  scroll: number;
  isStopped: boolean;
  scrollTo: (target: number, options?: { immediate?: boolean; duration?: number }) => void;
  stop: () => void;
  start: () => void;
  resize: () => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

export function scrollWindowTo(top: number, behavior: ScrollBehavior = 'smooth'): void {
  if (typeof window === 'undefined') return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(top, {
      immediate: behavior === 'auto',
      duration: behavior === 'smooth' ? 1.1 : 0,
    });
  } else {
    window.scrollTo({ top, behavior });
  }

  if (top === 0) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

export function scrollWindowToTop(): void {
  scrollWindowTo(0, 'auto');
}
