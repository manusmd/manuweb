'use client';

import { useEffect } from 'react';
import { DEMO } from './tokens';

export const SCENES = [
  'hero',
  'enhance',
  'skeleton',
  'minutiae',
  'singular',
  'match',
  'cockpit',
] as const;

const RIDGE_TOTAL = DEMO.A.minutiae.filter(
  m => m.type === 'ending' || m.type === 'bifurcation'
).length;

/**
 * GSAP scroll choreography for the FingerMatch detail page. Same shape as the
 * ApplyX hook: pinned + scrubbed scenes on desktop, static end-states on mobile
 * / reduced-motion, a fit-to-viewport scaler so nothing overflows, and
 * refreshPriority so the stacked pins measure top-to-bottom.
 */
export function useFingermatchScrollExperience(
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

      // Wait for fonts so pinned measurements are stable — but never block setup
      // on it (some embedded browsers never resolve fonts.ready). A late-loading
      // font is handled by the fonts.ready refresh below.
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

        // ---- Reduced motion: resolved end-state, no motion. ----
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(qa('[data-fade]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-hero-hidden]'), { opacity: 1, y: 0 });
          gsap.set(q('[data-enh-layer="binary"]') ?? [], { opacity: 1 });
          gsap.set(q('[data-skel]') ?? [], { opacity: 1 });
          gsap.set(qa('[data-enh-step]'), { opacity: 1 });
          gsap.set(qa('[data-cn-case]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-min-marker]'), { scale: 1, opacity: 1 });
          gsap.set(qa('[data-sing-marker]'), { scale: 1, opacity: 1 });
          gsap.set(q('[data-fm-scan]') ?? [], { opacity: 0 });
          setText('[data-min-count]', String(RIDGE_TOTAL));
          setText('[data-spur-count]', '0');
          setText('[data-poincare-loop-deg]', '+180°');
          setText('[data-poincare-delta-deg]', '−180°');
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

            // Parallax blobs
            qa<HTMLElement>('[data-parallax]').forEach(el => {
              const depth = parseFloat(el.dataset.parallax ?? '0');
              gsap.to(el, {
                yPercent: depth * 40,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });

            // Hero reveal — the hero is always at the top on load, so play a
            // plain intro timeline (no ScrollTrigger, which a later refresh would
            // otherwise reset mid-play).
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
              // Fit each pinned scene to the viewport height.
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

              // --- ENHANCE: raw → norm (+ orientation field) → gabor → binary ---
              const enhPin = q('[data-pin="enhance"]');
              if (enhPin) {
                const steps = qa('[data-enh-step]');
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: enhPin,
                    start: 'top top',
                    end: '+=1800',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 6,
                  },
                });
                const lit = (i: number, at: number) =>
                  steps[i] && tl.to(steps[i]!, { opacity: 1, duration: 0.1 }, at);
                tl.to('[data-enh-layer="norm"]', { opacity: 1, duration: 0.15 }, 0);
                lit(0, 0);
                tl.set('[data-orient]', { opacity: 1 }, 0.18).from(
                  '[data-orient-line]',
                  { drawSVG: '0%', stagger: 0.004, duration: 0.3, ease: 'none' },
                  0.2
                );
                lit(1, 0.2);
                tl.to('[data-orient]', { opacity: 0.14, duration: 0.2 }, 0.48);
                tl.to('[data-enh-layer="gabor"]', { opacity: 1, duration: 0.2 }, 0.5);
                lit(2, 0.5);
                tl.to('[data-enh-layer="binary"]', { opacity: 1, duration: 0.2 }, 0.78);
                lit(3, 0.78);
              }

              // --- SKELETON: thin to 1px, prune spurs ---
              const skelPin = q('[data-pin="skeleton"]');
              if (skelPin) {
                const spurCount = { v: 4 };
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: skelPin,
                    start: 'top top',
                    end: '+=1200',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 5,
                  },
                });
                tl.to('[data-skel]', { opacity: 1, duration: 0.55 }, 0);
                tl.to(
                  '[data-spur]',
                  { drawSVG: '0%', stagger: 0.08, duration: 0.3, ease: 'power1.in' },
                  0.55
                );
                tl.to(
                  spurCount,
                  {
                    v: 0,
                    duration: 0.35,
                    ease: 'none',
                    onUpdate: () => setText('[data-spur-count]', String(Math.round(spurCount.v))),
                  },
                  0.55
                );
              }

              // --- MINUTIAE: CN cases, markers pop, tally ---
              const minPin = q('[data-pin="minutiae"]');
              if (minPin) {
                const markers = qa('[data-min-marker]');
                gsap.set('[data-cn-case]', { opacity: 0, y: 12 });
                gsap.set(markers, { scale: 0, opacity: 0 });
                const count = { v: 0 };
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: minPin,
                    start: 'top top',
                    end: '+=1600',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 4,
                  },
                });
                tl.to('[data-cn-case]', { opacity: 1, y: 0, stagger: 0.12, duration: 0.2 }, 0.05);
                tl.to(
                  markers,
                  { scale: 1, opacity: 1, stagger: 0.02, duration: 0.3, ease: 'back.out(1.6)' },
                  0.35
                );
                tl.to(
                  count,
                  {
                    v: RIDGE_TOTAL,
                    duration: 0.5,
                    ease: 'none',
                    onUpdate: () => setText('[data-min-count]', String(Math.round(count.v))),
                  },
                  0.35
                );
              }

              // --- SINGULAR: Poincaré accumulation, loop + delta ---
              const singPin = q('[data-pin="singular"]');
              if (singPin) {
                const markers = qa('[data-sing-marker]');
                gsap.set(markers, { scale: 0, opacity: 0 });
                const loopDeg = { v: 0 };
                const deltaDeg = { v: 0 };
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: singPin,
                    start: 'top top',
                    end: '+=1300',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });
                tl.to('[data-poincare-ring]', { rotation: 360, duration: 0.6, ease: 'none' }, 0);
                tl.to(
                  loopDeg,
                  {
                    v: 180,
                    duration: 0.45,
                    ease: 'none',
                    onUpdate: () =>
                      setText('[data-poincare-loop-deg]', `+${Math.round(loopDeg.v)}°`),
                  },
                  0
                );
                tl.to(markers[0] ?? [], { scale: 1, opacity: 1, duration: 0.2 }, 0.45);
                tl.to(
                  deltaDeg,
                  {
                    v: 180,
                    duration: 0.45,
                    ease: 'none',
                    onUpdate: () =>
                      setText('[data-poincare-delta-deg]', `−${Math.round(deltaDeg.v)}°`),
                  },
                  0.5
                );
                tl.to(markers[1] ?? [], { scale: 1, opacity: 1, duration: 0.2 }, 0.9);
              }

              // --- MATCH (not pinned): a scan line sweeps down the real match
              //     screenshot on enter, once, to signal "analysis". ---
              const scanEl = q('[data-fm-scan]');
              if (scanEl) {
                gsap.set(scanEl, { yPercent: -100, opacity: 0 });
                gsap.to(scanEl, {
                  keyframes: [
                    { opacity: 1, yPercent: -100, duration: 0.01 },
                    { yPercent: 100, duration: 1.4, ease: 'power1.inOut' },
                    { opacity: 0, duration: 0.2 },
                  ],
                  scrollTrigger: { trigger: '[data-scene="match"]', start: 'top 60%', once: true },
                });
              }
            } else {
              // Mobile: resolved end-states, no pin/scrub.
              gsap.set(q('[data-enh-layer="binary"]') ?? [], { opacity: 1 });
              gsap.set(q('[data-skel]') ?? [], { opacity: 1 });
              gsap.set(qa('[data-enh-step]'), { opacity: 1 });
              gsap.set(qa('[data-cn-case]'), { opacity: 1, y: 0 });
              gsap.set(qa('[data-min-marker]'), { scale: 1, opacity: 1 });
              gsap.set(qa('[data-sing-marker]'), { scale: 1, opacity: 1 });
              gsap.set(q('[data-fm-scan]') ?? [], { opacity: 0 });
              setText('[data-min-count]', String(RIDGE_TOTAL));
              setText('[data-spur-count]', '0');
              setText('[data-poincare-loop-deg]', '+180°');
              setText('[data-poincare-delta-deg]', '−180°');
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
      // Extra deferred refreshes: with several stacked pins, the first pass can
      // measure a later pin's start before the pins above it have settled their
      // spacers. A couple of re-refreshes (in refreshPriority order) lock the
      // starts once the layout is final. Cheap, and only runs on mount.
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
