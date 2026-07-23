'use client';

import { useEffect } from 'react';

export const SCENES = ['hero', 'tour', 'dues', 'attendance', 'website', 'roles', 'tech'] as const;

/**
 * GSAP scroll choreography for the afterhive detail page. Same scaffold as the
 * other project pages (bounded fonts/rAF waits, fit-to-viewport, deferred
 * refreshes). Three pinned scenes — product tour, attendance check-in, website
 * publish — with refreshPriority descending down the page; dues animates with
 * a scrubbed progress bar and count-ups on enter.
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

    const setCountsToFinal = () => {
      qa<HTMLElement>('[data-dues-count]').forEach(el => {
        const to = Number(el.dataset.to ?? 0);
        el.textContent = to.toLocaleString('de-DE') + (el.dataset.suffix ?? '');
      });
      const num = q('[data-att-num]');
      if (num) num.textContent = String(qa('[data-att-check][data-present]').length);
    };

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
          gsap.set(qa('[data-att-check]'), { opacity: 1, scale: 1 });
          gsap.set(qa('[data-ws-img="1"], [data-ws-url="1"], [data-ws-online]'), { opacity: 1 });
          gsap.set(qa('[data-ws-url="0"], [data-ws-publish]'), { opacity: 0 });
          setCountsToFinal();
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

            // --- DUES: scrubbed progress bar + count-ups on enter (all sizes) ---
            const duesScene = q('[data-scene="dues"]');
            if (duesScene) {
              gsap.fromTo(
                '[data-dues-bar]',
                { scaleX: 0 },
                {
                  scaleX: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: duesScene,
                    start: 'top 75%',
                    end: 'center 45%',
                    scrub: 0.5,
                  },
                }
              );
              gsap.from('[data-dues-done]', {
                opacity: 0,
                scale: 0.6,
                duration: 0.4,
                ease: 'back.out(1.6)',
                scrollTrigger: { trigger: duesScene, start: 'center 50%', once: true },
              });
              qa<HTMLElement>('[data-dues-count]').forEach(el => {
                const to = Number(el.dataset.to ?? 0);
                const suffix = el.dataset.suffix ?? '';
                const c = { v: 0 };
                gsap.to(c, {
                  v: to,
                  duration: 1.2,
                  ease: 'power1.out',
                  onUpdate: () => {
                    el.textContent = Math.round(c.v).toLocaleString('de-DE') + suffix;
                  },
                  scrollTrigger: { trigger: duesScene, start: 'top 65%', once: true },
                });
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
                    refreshPriority: 4,
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
                tl.to({}, { duration: 1 });
              }

              // --- ATTENDANCE (pinned scrub): tick the roster, count climbs ---
              const attPin = q('[data-pin="attendance"]');
              const checks = qa<HTMLElement>('[data-att-check]');
              const attNum = q('[data-att-num]');
              if (attPin && checks.length) {
                gsap.set(checks, { opacity: 0, scale: 0.3 });
                let present = 0;
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: attPin,
                    start: 'top top',
                    end: '+=1200',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });
                checks.forEach((check, i) => {
                  const isPresent = check.dataset.present === 'true';
                  if (isPresent) present += 1;
                  const target = present;
                  tl.to(
                    check,
                    {
                      opacity: 1,
                      scale: 1,
                      duration: 0.35,
                      ease: 'back.out(2)',
                      onStart: () => {
                        if (attNum && isPresent) attNum.textContent = String(target);
                      },
                      onReverseComplete: () => {
                        if (attNum && isPresent) attNum.textContent = String(target - 1);
                      },
                    },
                    i * 0.8 + 0.4
                  );
                });
                tl.to({}, { duration: 1 });
              }

              // --- WEBSITE (pinned scrub): builder publishes into the live site ---
              const wsPin = q('[data-pin="website"]');
              if (wsPin) {
                const steps = qa<HTMLElement>('[data-ws-step]');
                gsap.set('[data-ws-img="1"], [data-ws-url="1"], [data-ws-online]', { opacity: 0 });
                gsap.set('[data-ws-publish]', { opacity: 0, scale: 0.7 });
                gsap.set(steps.slice(1), { opacity: 0.45 });

                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: wsPin,
                    start: 'top top',
                    end: '+=1500',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 2,
                  },
                });
                // 01 activate → 02 customize
                tl.to(steps[0], { opacity: 0.45, duration: 0.3 }, 0.8);
                if (steps[1]) tl.to(steps[1], { opacity: 1, duration: 0.3 }, 0.8);
                // publish button appears and pulses
                tl.to(
                  '[data-ws-publish]',
                  { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' },
                  1.6
                );
                tl.to('[data-ws-publish]', { scale: 1.12, duration: 0.2 }, 2.2);
                tl.to('[data-ws-publish]', { scale: 1, duration: 0.2 }, 2.4);
                // 03 publish: crossfade to the live site, flip URL, go online
                if (steps[1]) tl.to(steps[1], { opacity: 0.45, duration: 0.3 }, 2.8);
                if (steps[2]) tl.to(steps[2], { opacity: 1, duration: 0.3 }, 2.8);
                tl.to('[data-ws-publish]', { opacity: 0, scale: 0.7, duration: 0.3 }, 2.8);
                tl.to('[data-ws-img="1"]', { opacity: 1, duration: 0.6 }, 2.9);
                tl.to('[data-ws-url="0"]', { opacity: 0, duration: 0.4 }, 2.9);
                tl.to('[data-ws-url="1"]', { opacity: 1, duration: 0.4 }, 3.0);
                tl.to('[data-ws-online]', { opacity: 1, duration: 0.3 }, 3.3);
                tl.to({}, { duration: 0.8 });
              }
            } else {
              // Mobile: resolved end-states, no pinning.
              gsap.set(qa('[data-tour-stop]'), { autoAlpha: 1, y: 0 });
              gsap.set(qa('[data-att-check]'), { opacity: 1, scale: 1 });
              gsap.set(qa('[data-ws-img="1"], [data-ws-url="1"], [data-ws-online]'), {
                opacity: 1,
              });
              gsap.set(qa('[data-ws-url="0"], [data-ws-publish]'), { opacity: 0 });
              const num = q('[data-att-num]');
              if (num) num.textContent = String(qa('[data-att-check][data-present]').length);
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
