'use client';

import { useEffect } from 'react';

export function useAboutParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
): void {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const stRef: {
      current: ReturnType<typeof import('gsap/ScrollTrigger').ScrollTrigger.create> | null;
    } = { current: null };

    void (async () => {
      const [{ gsap }, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      const ScrollTriggerLib = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTriggerLib);

      if (cancelled) return;

      const container = containerRef.current;
      if (!container) return;

      const st = ScrollTriggerLib.create({
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const layers = container.querySelectorAll<HTMLElement>('[data-about-parallax]');
          const d = self.progress - 0.5;
          layers.forEach(el => {
            const raw = el.dataset.aboutParallax ?? '0';
            const speed = Number.parseFloat(raw);
            if (!Number.isFinite(speed)) return;
            gsap.set(el, {
              x: d * 48 * speed,
              y: d * -32 * speed,
              force3D: true,
            });
          });
        },
      });

      if (cancelled) {
        st.kill();
        return;
      }

      stRef.current = st;
      ScrollTriggerLib.refresh();
    })();

    return () => {
      cancelled = true;
      stRef.current?.kill();
      stRef.current = null;
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    };
  }, [enabled, containerRef]);
}
