'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollWindowTo } from '@/lib/scrollTo';
import { NAV_SCROLL_OFFSET_PX } from '@/constants/scroll';

/**
 * Scrolls to the section referenced by the URL hash (e.g. `/en#projects`) when
 * arriving on the homepage from another route. The browser's native hash scroll
 * doesn't work here because the smooth scroller (Lenis) owns scrolling and the
 * target sections are lazy-loaded and initially behind the loading screen (which
 * locks the body with `position: fixed`). So we wait until the section exists and
 * scrolling is unlocked, then scroll with a single correction pass for late
 * layout shifts as sections above finish loading.
 */
export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = Date.now();

    const targetFor = (el: HTMLElement) => {
      const scrollPos = window.__lenis?.scroll ?? window.scrollY;
      return Math.max(0, el.getBoundingClientRect().top + scrollPos - NAV_SCROLL_OFFSET_PX);
    };

    const run = () => {
      if (cancelled) return;

      const el = document.getElementById(hash);
      const scrollLocked = document.body.style.position === 'fixed';

      if (el && el.offsetHeight > 40 && !scrollLocked) {
        scrollWindowTo(targetFor(el), 'smooth');
        // A correction pass: sections above are lazy-loaded, so the target
        // position can shift after the first scroll settles.
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            const settled = document.getElementById(hash);
            if (settled) scrollWindowTo(targetFor(settled), 'smooth');
          }, 700)
        );
        return;
      }

      if (Date.now() - start < 6000) {
        timers.push(setTimeout(run, 100));
      }
    };

    timers.push(setTimeout(run, 100));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
