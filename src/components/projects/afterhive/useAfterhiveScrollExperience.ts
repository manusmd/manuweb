'use client';

import { useEffect } from 'react';

export const SCENES = ['hero', 'tenancy', 'matrix', 'datalayer', 'domain', 'product'] as const;

/**
 * GSAP scroll choreography for the afterhive detail page. Same scaffold as the
 * other project pages (bounded fonts/rAF waits, fit-to-viewport, deferred
 * refreshes); only the permission matrix is pinned+scrubbed — everything else
 * reveals on enter.
 */
export function useAfterhiveScrollExperience(
  rootRef: React.RefObject<HTMLDivElement | null>,
  setActiveScene: (index: number) => void
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const q = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector<T>(sel) ?? undefined;
    const qa = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      await Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>(r => setTimeout(r, 1200)),
      ]);
      await new Promise<void>(r => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            r();
          }
        };
        requestAnimationFrame(() => requestAnimationFrame(finish));
        setTimeout(finish, 250);
      });
      if (disposed) return;

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // ---- Reduced motion: resolved end-state. ----
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(qa('[data-fade]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-hero-hidden]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-mx-cell]'), { opacity: 1, scale: 1 });
          gsap.set(qa('[data-dm-chip]'), { opacity: 1 });
          qa<HTMLElement>('[data-dm-count]').forEach(el => {
            el.textContent = el.dataset.to ?? '0';
          });
        });

        mm.add(
          {
            isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
            isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          },
          context => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };
            let fitPinned: (() => void) | undefined;

            SCENES.forEach((_, i) => {
              const el = q(`[data-scene="${SCENES[i]}"]`);
              if (!el) return;
              ScrollTrigger.create({
                trigger: el,
                start: 'top 55%',
                end: 'bottom 45%',
                onToggle: self => self.isActive && setActiveScene(i),
              });
            });

            qa<HTMLElement>('[data-parallax]').forEach(el => {
              const depth = parseFloat(el.dataset.parallax ?? '0');
              gsap.to(el, {
                yPercent: depth * 40,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });

            // Hero intro
            const heroTitle = q('[data-hero-title]');
            let split: InstanceType<typeof SplitText> | undefined;
            const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
            gsap.set('[data-hero-hidden]', { opacity: 0, y: 24 });
            if (heroTitle) {
              split = new SplitText(heroTitle, { type: 'chars' });
              gsap.set(heroTitle, { opacity: 1, y: 0 });
              gsap.set(split.chars, { opacity: 0, y: 40 });
              intro.to(split.chars, { opacity: 1, y: 0, stagger: 0.02, duration: 0.6 }, 0.1);
            }
            intro.to(
              '[data-hero-hidden]:not([data-hero-title])',
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 },
              0.15
            );

            // Generic fade-ups
            qa<HTMLElement>('[data-fade]').forEach(el => {
              gsap.from(el, {
                opacity: 0,
                y: 28,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
              });
            });

            // Domain: count-ups + model-chip cascade (once, on enter)
            if (q('[data-dm-count]')) {
              qa<HTMLElement>('[data-dm-count]').forEach(el => {
                const to = Number(el.dataset.to ?? 0);
                const c = { v: 0 };
                gsap.to(c, {
                  v: to,
                  duration: 1.1,
                  ease: 'power1.out',
                  onUpdate: () => {
                    el.textContent = String(Math.round(c.v));
                  },
                  scrollTrigger: { trigger: '[data-scene="domain"]', start: 'top 70%', once: true },
                });
              });
              gsap.from('[data-dm-chip]', {
                opacity: 0,
                scale: 0.7,
                stagger: 0.012,
                duration: 0.3,
                ease: 'back.out(1.4)',
                scrollTrigger: { trigger: '[data-scene="domain"]', start: 'top 60%', once: true },
              });
            }

            if (isDesktop) {
              fitPinned = () => {
                const avail = window.innerHeight - 120;
                qa<HTMLElement>('[data-pin]').forEach(pin => {
                  const el = pin.firstElementChild as HTMLElement | null;
                  if (!el) return;
                  el.style.transformOrigin = 'center center';
                  el.style.transform = '';
                  const h = el.getBoundingClientRect().height;
                  const scale = Math.min(1, avail / h);
                  if (scale < 1) el.style.transform = `scale(${scale})`;
                });
              };
              ScrollTrigger.addEventListener('refresh', fitPinned);

              // --- MATRIX (pinned scrub): the SSOT fills in row by row ---
              const mxPin = q('[data-pin="matrix"]');
              if (mxPin) {
                gsap.set('[data-mx-cell]', { opacity: 0, scale: 0.6, transformOrigin: 'center' });
                gsap
                  .timeline({
                    scrollTrigger: {
                      trigger: mxPin,
                      start: 'top top',
                      end: '+=1600',
                      scrub: 0.6,
                      pin: true,
                      anticipatePin: 1,
                      invalidateOnRefresh: true,
                      refreshPriority: 3,
                    },
                  })
                  .to('[data-mx-cell]', {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.012,
                    duration: 0.25,
                    ease: 'back.out(1.3)',
                  });
              }
            } else {
              gsap.set(qa('[data-mx-cell]'), { opacity: 1, scale: 1 });
            }

            return () => {
              if (fitPinned) ScrollTrigger.removeEventListener('refresh', fitPinned);
              qa<HTMLElement>('[data-pin]').forEach(pin => {
                const el = pin.firstElementChild as HTMLElement | null;
                if (el) el.style.transform = '';
              });
              split?.revert();
            };
          }
        );
      }, root);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      ScrollTrigger.refresh();
      const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
      fontSet?.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      const refreshTimers = [
        window.setTimeout(() => !disposed && ScrollTrigger.refresh(), 300),
        window.setTimeout(() => !disposed && ScrollTrigger.refresh(), 900),
      ];

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        refreshTimers.forEach(clearTimeout);
        ctx.revert();
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [rootRef, setActiveScene]);
}
