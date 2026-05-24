'use client';

import { useEffect, useRef, useState } from 'react';

export function useAboutTimelineActiveStep(
  containerRef: React.RefObject<HTMLElement | null>,
  itemCount: number
): number {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window === 'undefined' || itemCount === 0) {
      return undefined;
    }

    let observer: IntersectionObserver | null = null;

    const connect = () => {
      observer?.disconnect();
      observer = null;

      const root = containerRef.current;
      if (!root) return;

      const elements = [...root.querySelectorAll<HTMLElement>('[data-about-step]')]
        .filter(el => el.dataset.aboutStep !== undefined)
        .sort(
          (a, b) =>
            Number.parseInt(a.dataset.aboutStep ?? '0', 10) -
            Number.parseInt(b.dataset.aboutStep ?? '0', 10)
        );

      if (elements.length === 0) return;

      observer = new IntersectionObserver(
        entries => {
          let bestIdx = activeIndexRef.current;
          let bestRatio = -1;

          for (const entry of entries) {
            if (
              entry.isIntersecting &&
              entry.target instanceof HTMLElement &&
              entry.intersectionRatio > bestRatio
            ) {
              const idxRaw = entry.target.dataset.aboutStep;
              if (idxRaw === undefined) continue;
              const idx = Number.parseInt(idxRaw, 10);
              if (Number.isNaN(idx)) continue;
              bestRatio = entry.intersectionRatio;
              bestIdx = idx;
            }
          }

          if (bestRatio >= 0) {
            setActiveIndex(bestIdx);
          }
        },
        {
          threshold: [0, 0.15, 0.35, 0.55],
          rootMargin: '-22% 0px -38% 0px',
        }
      );

      for (const el of elements) {
        observer.observe(el);
      }
    };

    const raf = requestAnimationFrame(connect);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [containerRef, itemCount]);

  return activeIndex;
}
