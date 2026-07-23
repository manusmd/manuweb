'use client';

import { useEffect } from 'react';

export const SCENES = ['hero', 'tour', 'roles', 'tech'] as const;

/**
 * GSAP scroll choreography for the afterhive detail page. Same scaffold as the
 * other project pages (bounded fonts/rAF waits, fit-to-viewport, deferred
 * refreshes); only the product tour is pinned+scrubbed — the stops crossfade
 * as you scroll, everything else reveals on enter.
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
          gsap.set(qa('[data-tour-stop]'), { autoAlpha: 1, y: 0 });
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

              // --- TOUR (pinned scrub): stops crossfade station by station ---
              const tourPin = q('[data-pin="tour"]');
              const stops = qa<HTMLElement>('[data-tour-stop]');
              const tabs = qa<HTMLElement>('[data-tour-tab]');
              if (tourPin && stops.length > 1) {
                gsap.set(stops.slice(1), { autoAlpha: 0, y: 30 });
                gsap.set(tabs.slice(1), { opacity: 0.4 });

                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: tourPin,
                    start: 'top top',
                    end: `+=${stops.length * 420}`,
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });
                stops.forEach((stop, i) => {
                  if (i === 0) return;
                  const pos = i * 1.5;
                  tl.to(stops[i - 1], { autoAlpha: 0, y: -30, duration: 0.5 }, pos);
                  tl.fromTo(
                    stop,
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.5 },
                    pos + 0.35
                  );
                  if (tabs[i - 1]) tl.to(tabs[i - 1], { opacity: 0.4, duration: 0.3 }, pos);
                  if (tabs[i]) tl.to(tabs[i], { opacity: 1, duration: 0.3 }, pos);
                });
                // hold the last stop for a beat before unpinning
                tl.to({}, { duration: 1 });
              }
            } else {
              gsap.set(qa('[data-tour-stop]'), { autoAlpha: 1, y: 0 });
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
