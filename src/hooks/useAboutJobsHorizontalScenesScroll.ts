'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ABOUT_JOBS_PIN_START_OFFSET_PX } from '@/components/about/aboutScroll';
import { scrollWindowTo } from '@/lib/scrollTo';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function smooth01(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

function applyPanelStaging(gsap: typeof import('gsap').gsap, scene: HTMLElement, local: number) {
  const stages = [
    ...scene.querySelectorAll<HTMLElement>('[data-scene-stage="meta"]'),
    ...scene.querySelectorAll<HTMLElement>('[data-scene-stage="heading"]'),
    ...scene.querySelectorAll<HTMLElement>('[data-scene-stage="company"]'),
    ...scene.querySelectorAll<HTMLElement>('[data-scene-stage="skills"]'),
    ...scene.querySelectorAll<HTMLElement>('[data-scene-stage="bullet"]'),
  ];

  if (local >= 0.88) {
    stages.forEach(el => {
      gsap.set(el, { opacity: 1, y: 0, overwrite: true });
    });
    return;
  }

  const meta = scene.querySelector<HTMLElement>('[data-scene-stage="meta"]');
  const heading = scene.querySelector<HTMLElement>('[data-scene-stage="heading"]');
  const company = scene.querySelector<HTMLElement>('[data-scene-stage="company"]');
  const skills = scene.querySelector<HTMLElement>('[data-scene-stage="skills"]');
  const bullets = [...scene.querySelectorAll<HTMLElement>('[data-scene-stage="bullet"]')];

  const reveal = (
    el: HTMLElement | null | undefined,
    edgeA: number,
    edgeB: number,
    fromY: number
  ) => {
    if (!el) return;
    const t = smooth01(local, edgeA, edgeB);
    gsap.set(el, {
      opacity: t,
      y: fromY * (1 - t),
      overwrite: true,
    });
  };

  reveal(meta, 0.02, 0.18, 14);
  reveal(heading, 0.06, 0.28, 24);
  reveal(company, 0.14, 0.36, 16);
  reveal(skills, 0.22, 0.44, 14);
  bullets.forEach((row, bi) => {
    const stagger = Math.min(bi * 0.04, 0.16);
    reveal(row, 0.32 + stagger, 0.62 + stagger, 12);
  });
}

export type AboutJobsHorizontalScenesApi = {
  activeIndex: number;
  scrollProgress: number;
  scrollToIndex: (index: number) => void;
};

export function useAboutJobsHorizontalScenesScroll(
  pinOuterRef: React.RefObject<HTMLElement | null>,
  viewportRef: React.RefObject<HTMLElement | null>,
  trackRef: React.RefObject<HTMLElement | null>,
  itemCount: number,
  enabled: boolean
): AboutJobsHorizontalScenesApi {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollTriggerRef = useRef<{ start: number; end: number } | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const lastIdxRef = useRef(-1);

  const scrollToIndex = useCallback(
    (rawIndex: number) => {
      if (typeof window === 'undefined') return;

      const idx = clamp(Math.round(rawIndex), 0, Math.max(itemCount - 1, 0));
      const st = scrollTriggerRef.current;

      if (!st || itemCount <= 1) {
        window.requestAnimationFrame(() => {
          document.getElementById(`about-exp-${idx}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        });
        return;
      }

      const p = itemCount <= 1 ? 0 : idx / (itemCount - 1);
      const y = st.start + (st.end - st.start) * p;
      scrollWindowTo(y, 'smooth');
    },
    [itemCount]
  );

  useEffect(() => {
    if (!enabled || itemCount <= 0 || typeof window === 'undefined') {
      scrollTriggerRef.current = null;
      return undefined;
    }

    let disposed = false;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (disposed) return;

      await new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      if (disposed) return;

      const pinOuter = pinOuterRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!pinOuter || !viewport || !track || disposed) return;

      const onResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(onResize);
        ro.observe(pinOuter);
      }

      const computeMaxTranslate = (): number =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);

      const computeEndPx = (): number => {
        const maxX = computeMaxTranslate();
        const perJob = window.innerHeight * 0.2;
        return Math.max(maxX + window.innerHeight * 0.08, perJob * Math.max(itemCount - 1, 1));
      };

      const ctx = gsap.context(() => {
        const tween = gsap.to(track, {
          x: () => -computeMaxTranslate(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinOuter,
            pin: pinOuter,
            pinSpacing: true,
            scrub: 0.55,
            start: () => `top top+=${String(ABOUT_JOBS_PIN_START_OFFSET_PX)}`,
            end: () => `+=${String(computeEndPx())}`,
            invalidateOnRefresh: true,
            anticipatePin: 0,
            onUpdate(self) {
              const prog = clamp(self.progress, 0, 1);
              setScrollProgress(prog);
              const idx =
                itemCount <= 1 ? 0 : clamp(Math.round(prog * (itemCount - 1)), 0, itemCount - 1);
              if (idx !== lastIdxRef.current) {
                lastIdxRef.current = idx;
                setActiveIndex(idx);
              }

              const scenes = [...viewport.querySelectorAll<HTMLElement>('[data-about-job-scene]')];
              const focused = itemCount <= 1 ? prog : prog * (itemCount - 1);
              scenes.forEach((scene, i) => {
                const local = itemCount <= 1 ? prog : clamp(1 - Math.abs(focused - i), 0, 1);

                scene.querySelectorAll<HTMLElement>('[data-about-scene-parallax]').forEach(el => {
                  const intensity = Number.parseFloat(el.dataset.aboutSceneParallax ?? '0');
                  if (!Number.isFinite(intensity)) return;
                  const drift = local - 0.5;
                  gsap.set(el, {
                    scale: 1 + drift * 0.08 * intensity,
                    x: drift * 48 * intensity,
                    y: drift * -32 * intensity,
                    rotation: drift * intensity * -0.4,
                    force3D: true,
                  });
                });

                applyPanelStaging(gsap, scene, local);
              });
            },
          },
        });

        const st = tween.scrollTrigger;
        if (st) {
          scrollTriggerRef.current = { start: st.start, end: st.end };
        }
      }, pinOuter);

      ScrollTrigger.refresh();

      const refreshWhenLenisReady = () => {
        if (window.__lenis) {
          ScrollTrigger.refresh();
          return;
        }
        requestAnimationFrame(refreshWhenLenisReady);
      };
      refreshWhenLenisReady();

      const runCleanup = () => {
        window.removeEventListener('resize', onResize);
        ro?.disconnect();
        ctx.revert();
        scrollTriggerRef.current = null;
        lastIdxRef.current = -1;
      };

      cleanupRef.current = runCleanup;
      if (disposed) {
        runCleanup();
      }
    })();

    return () => {
      disposed = true;
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      scrollTriggerRef.current = null;
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    };
  }, [enabled, itemCount, pinOuterRef, trackRef, viewportRef]);

  return { activeIndex, scrollProgress, scrollToIndex };
}
