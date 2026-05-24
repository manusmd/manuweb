'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
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

async function waitForLayoutSettle() {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function getNativeScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function getWindowScrollY() {
  const native = getNativeScrollY();
  const lenisScroll = window.__lenis?.scroll;
  if (lenisScroll == null) return native;
  if (lenisScroll < 1 && native > 1) return native;
  return lenisScroll;
}

function syncLenisToNativeScroll() {
  const native = getNativeScrollY();
  const lenis = window.__lenis;
  if (lenis && Math.abs(lenis.scroll - native) > 1) {
    lenis.scrollTo(native, { immediate: true });
  }
}

function isScrollLayoutConsistent(triggerEl: HTMLElement, scrollY: number) {
  const rectTop = triggerEl.getBoundingClientRect().top;
  if (scrollY < 80) return rectTop > 200;
  return rectTop < window.innerHeight + 400;
}

async function waitForScrollLayoutConsistency(
  triggerEl: HTMLElement,
  isDisposed: () => boolean
) {
  for (let frame = 0; frame < 120; frame += 1) {
    if (isDisposed()) return;

    syncLenisToNativeScroll();
    const scrollY = getWindowScrollY();
    const consistent = isScrollLayoutConsistent(triggerEl, scrollY);

    if (consistent) {
      await waitForLayoutSettle();
      return;
    }

    await new Promise<void>(resolve => {
      requestAnimationFrame(() => resolve());
    });
  }
}

function getScrollTriggerForTrigger(
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
  triggerEl: HTMLElement
) {
  return ScrollTrigger.getAll().find(st => st.trigger === triggerEl);
}

function shouldResetToFirstJob(
  pinOuter: HTMLElement,
  scrollY: number,
  stStart: number,
  stEnd: number,
  progress: number
) {
  if (stStart < 0) return true;
  if (scrollY >= stStart - 20 && scrollY <= stEnd + 20) return false;
  if (scrollY < 80 && progress > 0.01) return true;
  const sectionTop = pinOuter.getBoundingClientRect().top;
  if (sectionTop > window.innerHeight * 0.5 && progress > 0.01) return true;
  return false;
}

function resetHorizontalJobsToStart(
  gsap: typeof import('gsap').gsap,
  track: HTMLElement,
  viewport: HTMLElement,
  itemCount: number,
  setActiveIndex: (index: number) => void,
  setScrollProgress: (progress: number) => void,
  lastIdxRef: MutableRefObject<number>
) {
  gsap.set(track, { x: 0, overwrite: true });
  lastIdxRef.current = 0;
  setActiveIndex(0);
  setScrollProgress(0);

  const scenes = [...viewport.querySelectorAll<HTMLElement>('[data-about-job-scene]')];
  scenes.forEach((scene, index) => {
    applyPanelStaging(gsap, scene, index === 0 ? 1 : 0);
  });
}

export type AboutJobsHorizontalScenesApi = {
  activeIndex: number;
  scrollProgress: number;
  scrollToIndex: (index: number) => void;
};

export function useAboutJobsHorizontalScenesScroll(
  pinTriggerRef: React.RefObject<HTMLElement | null>,
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

      await waitForLayoutSettle();
      if (disposed) return;

      const pinTrigger = pinTriggerRef.current;
      const pinOuter = pinOuterRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!pinTrigger || !pinOuter || !viewport || !track || disposed) return;

      await waitForScrollLayoutConsistency(pinTrigger, () => disposed);
      if (disposed) return;

      syncLenisToNativeScroll();
      ScrollTrigger.refresh(true);

      gsap.set(track, { x: 0, overwrite: true });
      ScrollTrigger.refresh(true);

      const onResize = () => {
        ScrollTrigger.refresh(true);
      };
      window.addEventListener('resize', onResize);
      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(onResize);
        ro.observe(pinOuter);
        ro.observe(pinTrigger);
      }

      const computeMaxTranslate = (): number =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);

      const computeEndPx = (): number => {
        const maxX = computeMaxTranslate();
        const perJob = window.innerHeight * 0.2;
        return Math.max(maxX + window.innerHeight * 0.08, perJob * Math.max(itemCount - 1, 1));
      };

      let scrollReady = false;

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -computeMaxTranslate(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinTrigger,
            pin: pinOuter,
            pinSpacing: true,
            scrub: 0.55,
            start: () => `top top+=${String(ABOUT_JOBS_PIN_START_OFFSET_PX)}`,
            end: () => `+=${String(computeEndPx())}`,
            invalidateOnRefresh: true,
            anticipatePin: 0,
            onUpdate(self) {
              if (!scrollReady) return;

              const prog = clamp(self.progress, 0, 1);
              setScrollProgress(prog);
              const idx =
                itemCount <= 1
                  ? 0
                  : clamp(Math.round(prog * (itemCount - 1)), 0, itemCount - 1);
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
      }, pinOuter);

      ScrollTrigger.refresh(true);
      await waitForLayoutSettle();
      ScrollTrigger.refresh(true);

      const stInstance = getScrollTriggerForTrigger(ScrollTrigger, pinTrigger);
      const postScrollY = getWindowScrollY();
      const stStart = stInstance?.start ?? 0;
      const progress = stInstance?.progress ?? 0;

      if (
        stInstance &&
        shouldResetToFirstJob(
          pinOuter,
          postScrollY,
          stStart,
          stInstance.end,
          progress
        )
      ) {
        resetHorizontalJobsToStart(
          gsap,
          track,
          viewport,
          itemCount,
          setActiveIndex,
          setScrollProgress,
          lastIdxRef
        );
        if (stStart >= 0) {
          stInstance.scroll(stStart);
        }
        ScrollTrigger.refresh(true);
      }

      scrollReady = true;

      const stAfterReset = getScrollTriggerForTrigger(ScrollTrigger, pinTrigger);
      if (stAfterReset) {
        scrollTriggerRef.current = { start: stAfterReset.start, end: stAfterReset.end };
      }

      const onWindowLoad = () => {
        void waitForLayoutSettle().then(() => {
          if (disposed) return;
          ScrollTrigger.refresh(true);
        });
      };
      window.addEventListener('load', onWindowLoad);

      const runCleanup = () => {
        scrollReady = false;
        window.removeEventListener('resize', onResize);
        window.removeEventListener('load', onWindowLoad);
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
  }, [enabled, itemCount, pinTriggerRef, pinOuterRef, trackRef, viewportRef]);

  return { activeIndex, scrollProgress, scrollToIndex };
}
