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
