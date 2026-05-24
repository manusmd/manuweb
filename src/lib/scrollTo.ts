type LenisLike = {
  scroll: number;
  scrollTo: (target: number, options?: { immediate?: boolean; duration?: number }) => void;
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
    return;
  }

  window.scrollTo({ top, behavior });
}
