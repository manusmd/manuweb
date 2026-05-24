'use client';

import { useEffect, useState } from 'react';

let gsap: GSAP | null = null;
let ScrollTriggerLib: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

export function useTimelineGsapReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        gsap = gsapModule.gsap;
        ScrollTriggerLib = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTriggerLib);
        setReady(true);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}

export function useTimelinePinnedHorizontalScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  horizontalRef: React.RefObject<HTMLDivElement | null>,
  isClient: boolean,
  gsapReady: boolean,
  experiencesLength: number,
  setCurrentPanel: (index: number) => void
) {
  useEffect(() => {
    if (
      !isClient ||
      !gsapReady ||
      !gsap ||
      !ScrollTriggerLib ||
      !containerRef.current ||
      !horizontalRef.current
    ) {
      return;
    }

    const container = containerRef.current;
    const horizontal = horizontalRef.current;

    const totalPanels = experiencesLength + 1;
    const panelWidth = window.innerWidth;
    const totalWidth = totalPanels * panelWidth;
    const maxTranslate = -(totalWidth - panelWidth);

    ScrollTriggerLib.getAll().forEach(trigger => trigger.kill());

    gsap.set([container, horizontal], {
      clearProps: 'all',
    });

    gsap.set(horizontal, {
      width: totalWidth,
      x: 0,
    });

    const panels = horizontal.children;

    Array.from(panels).forEach(panel => {
      gsap!.set(panel, {
        width: panelWidth,
        height: '100vh',
        scale: 1,
        opacity: 1,
        clearProps: 'transform',
      });
    });

    const snapPoints: number[] = [];
    const totalTranslateDistance = Math.abs(maxTranslate);

    for (let i = 0; i < totalPanels; i++) {
      const targetX = -i * panelWidth;
      const progress = Math.abs(targetX) / totalTranslateDistance;
      snapPoints.push(progress);
    }

    ScrollTriggerLib.create({
      trigger: container,
      start: 'top top',
      end: () => `+=${totalPanels * window.innerHeight}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.3, max: 0.7 },
        delay: 0.1,
        ease: 'power2.out',
        directional: false,
      },
      animation: gsap!.to(horizontal, {
        x: maxTranslate,
        ease: 'none',
      }),
      onUpdate: () => {
        let currentX = 0;
        currentX = gsap!.getProperty(horizontal, 'x') as number;
        const expectedPanel = Math.round(Math.abs(currentX) / panelWidth);
        if (expectedPanel >= 0 && expectedPanel < totalPanels) {
          setCurrentPanel(expectedPanel);
        }
        Array.from(panels).forEach(panel => {
          gsap!.set(panel, {
            scale: 1,
            opacity: 1,
            force3D: false,
          });
        });
      },
      onRefresh: () => {
        const newPanelWidth = window.innerWidth;
        const newTotalWidth = totalPanels * newPanelWidth;
        gsap!.set(horizontal, { width: newTotalWidth });
        Array.from(panels).forEach(panel => {
          gsap!.set(panel, {
            width: newPanelWidth,
            scale: 1,
            opacity: 1,
          });
        });
      },
    });

    let rafId: number;
    const enforceStyles = () => {
      if ((ScrollTriggerLib as unknown as { isActive: boolean }).isActive) {
        Array.from(panels).forEach(panel => {
          const element = panel as HTMLElement;
          element.style.transform = 'none';
          element.style.opacity = '1';
          element.style.scale = 'none';
        });
      }
      rafId = requestAnimationFrame(enforceStyles);
    };
    rafId = requestAnimationFrame(enforceStyles);

    return () => {
      if (ScrollTriggerLib) {
        ScrollTriggerLib.getAll().forEach(trigger => trigger.kill());
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      setCurrentPanel(0);
    };
  }, [isClient, gsapReady, experiencesLength, setCurrentPanel, containerRef, horizontalRef]);
}

export function timelineAnimateToPanel(panelIndex: number, horizontalEl: HTMLElement | null) {
  if (!gsap || !horizontalEl) return;

  const panelWidth = window.innerWidth;
  const targetX = -panelIndex * panelWidth;

  gsap.to(horizontalEl, {
    x: targetX,
    duration: 1,
    ease: 'power2.out',
  });
}
