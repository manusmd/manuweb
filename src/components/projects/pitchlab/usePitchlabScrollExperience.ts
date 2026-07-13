'use client';

import { useEffect } from 'react';
import { DEMO } from './tokens';

export const SCENES = [
  'hero',
  'strengths',
  'matchmodel',
  'montecarlo',
  'modelcheck',
  'product',
] as const;

const ITER = DEMO.sim.iterations;

/**
 * GSAP scroll choreography for the PitchLab detail page. Same shape as the
 * FingerMatch hook: pinned + scrubbed educational scenes on desktop, static
 * end-states on mobile / reduced-motion, fit-to-viewport scaling, refreshPriority
 * for stacked pins, and bounded fonts/rAF waits so setup never hangs.
 */
export function usePitchlabScrollExperience(
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
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('gsap/DrawSVGPlugin'),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

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

      const setText = (sel: string, v: string) => {
        const el = q(sel);
        if (el) el.textContent = v;
      };

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // ---- Reduced motion: resolved end-state. ----
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(qa('[data-fade]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-hero-hidden]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-hero-seg]'), { scaleX: 1 });
          gsap.set(qa('[data-str-bar]'), { scaleX: 1 });
          gsap.set(qa('[data-mm-cell]'), { scale: 1, opacity: 1 });
          gsap.set(qa('[data-mm-seg]'), { scaleX: 1 });
          gsap.set(qa('[data-mm-dc-note]'), { opacity: 1 });
          gsap.set(qa('[data-mc-bar]'), { scaleX: 1 });
          gsap.set(qa('[data-cal-pt]'), { scale: 1, opacity: 1 });
          setText('[data-mc-iter]', ITER.toLocaleString('en-US'));
          qa<HTMLElement>('[data-mc-pct]').forEach(el => {
            el.textContent = `${el.dataset.to ?? 0}%`;
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

            // Scene rail
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

            // Parallax
            qa<HTMLElement>('[data-parallax]').forEach(el => {
              const depth = parseFloat(el.dataset.parallax ?? '0');
              gsap.to(el, {
                yPercent: depth * 40,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });

            // Hero intro (plain timeline)
            const heroTitle = q('[data-hero-title]');
            let split: InstanceType<typeof SplitText> | undefined;
            const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
            gsap.set('[data-hero-hidden]', { opacity: 0, y: 24 });
            gsap.set('[data-hero-seg]', { scaleX: 0, transformOrigin: 'left center' });
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
            intro.to(
              '[data-hero-seg]',
              { scaleX: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out' },
              0.5
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

            // ModelCheck: pop the calibration points in on enter. (The dashed
            // ideal/market lines are drawn statically — DrawSVG fights an explicit
            // strokeDasharray and would leave them invisible.)
            if (q('[data-cal-pt]')) {
              gsap.from('[data-cal-pt]', {
                scale: 0,
                opacity: 0,
                transformOrigin: 'center',
                stagger: 0.04,
                duration: 0.3,
                ease: 'back.out(1.6)',
                scrollTrigger: { trigger: '[data-scene="modelcheck"]', start: 'top 65%' },
              });
              gsap.from('[data-bt-line]', {
                opacity: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: { trigger: '[data-scene="modelcheck"]', start: 'top 60%' },
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

              // --- STRENGTHS: attack/defence bars grow ---
              const strPin = q('[data-pin="strengths"]');
              if (strPin) {
                gsap.set('[data-str-bar]', { scaleX: 0, transformOrigin: 'left center' });
                gsap
                  .timeline({
                    scrollTrigger: {
                      trigger: strPin,
                      start: 'top top',
                      end: '+=1400',
                      scrub: 0.6,
                      pin: true,
                      anticipatePin: 1,
                      invalidateOnRefresh: true,
                      refreshPriority: 4,
                    },
                  })
                  .to('[data-str-bar]', {
                    scaleX: 1,
                    stagger: 0.03,
                    duration: 0.5,
                    ease: 'power2.out',
                  });
              }

              // --- MATCH MODEL: heatmap builds, DC nudge, result bar ---
              const mmPin = q('[data-pin="matchmodel"]');
              if (mmPin) {
                gsap.set('[data-mm-cell]', { scale: 0.4, opacity: 0, transformOrigin: 'center' });
                gsap.set('[data-mm-seg]', { scaleX: 0, transformOrigin: 'left center' });
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: mmPin,
                    start: 'top top',
                    end: '+=1800',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });
                tl.to(
                  '[data-mm-cell]',
                  { scale: 1, opacity: 1, stagger: 0.01, duration: 0.3, ease: 'back.out(1.4)' },
                  0
                );
                tl.to('[data-mm-dc-note]', { opacity: 1, duration: 0.2 }, 0.5);
                tl.to(
                  '[data-mm-dc]',
                  { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' },
                  0.55
                );
                tl.to('[data-mm-seg]', { scaleX: 1, stagger: 0.06, duration: 0.3 }, 0.75);
              }

              // --- MONTE-CARLO: iterations count up, title bars grow ---
              const mcPin = q('[data-pin="montecarlo"]');
              if (mcPin) {
                gsap.set('[data-mc-bar]', { scaleX: 0, transformOrigin: 'left center' });
                const iter = { v: 0 };
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: mcPin,
                    start: 'top top',
                    end: '+=1600',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 2,
                  },
                });
                tl.to(
                  iter,
                  {
                    v: ITER,
                    duration: 0.7,
                    ease: 'power1.out',
                    onUpdate: () =>
                      setText('[data-mc-iter]', Math.round(iter.v).toLocaleString('en-US')),
                  },
                  0
                );
                tl.to('[data-mc-bar]', { scaleX: 1, stagger: 0.06, duration: 0.5 }, 0.15);
                qa<HTMLElement>('[data-mc-pct]').forEach(el => {
                  const to = Number(el.dataset.to ?? 0);
                  const c = { v: 0 };
                  tl.to(
                    c,
                    {
                      v: to,
                      duration: 0.5,
                      ease: 'power1.out',
                      onUpdate: () => {
                        el.textContent = `${c.v.toFixed(1)}%`;
                      },
                    },
                    0.15
                  );
                });
              }
            } else {
              // Mobile: resolved end-states.
              gsap.set(qa('[data-str-bar]'), { scaleX: 1 });
              gsap.set(qa('[data-mm-cell]'), { scale: 1, opacity: 1 });
              gsap.set(qa('[data-mm-seg]'), { scaleX: 1 });
              gsap.set(qa('[data-mm-dc-note]'), { opacity: 1 });
              gsap.set(qa('[data-mc-bar]'), { scaleX: 1 });
              setText('[data-mc-iter]', ITER.toLocaleString('en-US'));
              qa<HTMLElement>('[data-mc-pct]').forEach(el => {
                el.textContent = `${el.dataset.to ?? 0}%`;
              });
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
