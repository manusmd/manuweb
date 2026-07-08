'use client';

import { useEffect } from 'react';

export const SCENES = ['hero', 'ingest', 'pipeline', 'indeed', 'stats', 'outro'] as const;

/**
 * Sets up the GSAP-choreographed, scroll-driven experience for the ApplyX detail
 * page. All animation queries are scoped to `rootRef`; the only React output is
 * `setActiveScene`, which drives the progress rail. Pinned + scrubbed scenes on
 * desktop, lighter fade-ins on mobile, and a static end-state under
 * prefers-reduced-motion.
 *
 * Scene components own their own markup; this hook only depends on the
 * `data-*` attribute contract they render (data-scene, data-pin, data-hero-*,
 * data-stage, data-caption, data-fade, data-extract, data-count-to, …).
 */
export function useApplyxScrollExperience(
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
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, { MotionPathPlugin }] =
        await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/SplitText'),
          import('gsap/DrawSVGPlugin'),
          import('gsap/MotionPathPlugin'),
        ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);

      // Wait for fonts + two frames so pinned measurements are stable.
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      if (disposed) return;

      const fireConfetti = () => {
        void import('canvas-confetti').then(({ default: confetti }) => {
          confetti({
            particleCount: 90,
            spread: 72,
            startVelocity: 38,
            origin: { y: 0.7 },
            colors: ['#3b82f6', '#8b5cf6', '#22c55e', '#e2e8f0'],
            disableForReducedMotion: true,
          });
        });
      };

      const countUp = (el: HTMLElement) => {
        const target = Number.parseFloat(el.dataset.countTo ?? '0');
        const decimals = Number.parseInt(el.dataset.countDecimals ?? '0', 10);
        const suffix = el.dataset.countSuffix ?? '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals) + suffix;
          },
        });
      };

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // ---- Reduced motion: reveal the informative end-state, no motion.
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(qa('[data-fade]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-extract]'), { opacity: 1, y: 0 });
          gsap.set(q('[data-status="reading"]') ?? [], { opacity: 0 });
          gsap.set(q('[data-status="classified"]') ?? [], { opacity: 1 });
          gsap.set(q('[data-redaction]') ?? [], { xPercent: 100, opacity: 0 });
          gsap.set(q('[data-revealed]') ?? [], { opacity: 1 });
          qa<HTMLElement>('[data-count-to]').forEach(el => {
            const decimals = Number.parseInt(el.dataset.countDecimals ?? '0', 10);
            el.textContent =
              Number.parseFloat(el.dataset.countTo ?? '0').toFixed(decimals) +
              (el.dataset.countSuffix ?? '');
          });
        });

        // ---- Full experience (desktop pin + mobile light) ----
        mm.add(
          {
            isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
            isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          },
          context => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

            // Rail: which scene is active.
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

            // --- HERO: split-text intro + parallax glow ---
            // Elements carry `data-hero-hidden` (opacity:0 via CSS) so they never
            // flash visible before this runs. We reveal with fromTo/set.
            const title = q('[data-hero-title]');
            let split: InstanceType<typeof SplitText> | undefined;
            if (title) {
              gsap.set(title, { opacity: 1 });
              split = new SplitText(title, { type: 'chars' });
              gsap.from(split.chars, {
                yPercent: 120,
                opacity: 0,
                stagger: 0.035,
                ease: 'back.out(1.7)',
                duration: 0.8,
                delay: 0.1,
              });
            }
            gsap.fromTo(
              '[data-hero-eyebrow]',
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6, delay: 0.05 }
            );
            gsap.fromTo(
              '[data-hero-lead]',
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.7, delay: 0.5 }
            );
            gsap.set('[data-hero-actions]', { opacity: 1 });
            gsap.fromTo(
              '[data-hero-actions] > *',
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.7 }
            );
            gsap.fromTo(
              '[data-hero-cue]',
              { opacity: 0 },
              { opacity: 1, duration: 0.6, delay: 1.1 }
            );

            qa<HTMLElement>('[data-parallax]').forEach(el => {
              const depth = Number.parseFloat(el.dataset.parallax ?? '0');
              gsap.to(el, {
                yPercent: depth * 100,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });

            // --- Generic fade-ups for anything tagged [data-fade] ---
            qa<HTMLElement>('[data-fade]').forEach(el => {
              gsap.from(el, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 82%' },
              });
            });

            if (isDesktop) {
              // --- INGEST (pinned, scrubbed): the model reads the email and a
              //     structured application lifts out of it ---
              const ingestPin = q('[data-pin="ingest"]');
              if (ingestPin) {
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: ingestPin,
                    start: 'top top',
                    end: '+=1600',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                });

                tl.to('[data-scanline]', { yPercent: 520, opacity: 1, duration: 0.6 }, 0)
                  .to('[data-scanline]', { opacity: 0, duration: 0.15 }, 0.62)
                  .from(
                    '[data-highlight]',
                    {
                      backgroundColor: 'rgba(139,92,246,0)',
                      color: 'rgb(148,163,184)',
                      stagger: 0.15,
                      duration: 0.4,
                    },
                    0.3
                  )
                  .to('[data-status="reading"]', { opacity: 0, duration: 0.2 }, 0.55)
                  .to('[data-status="classifying"]', { opacity: 1, duration: 0.2 }, 0.6)
                  .to('[data-status="classifying"]', { opacity: 0, duration: 0.2 }, 1.05)
                  .to('[data-status="classified"]', { opacity: 1, duration: 0.2 }, 1.1)
                  .from(
                    '[data-appcard]',
                    { opacity: 0, y: 28, scale: 0.94, duration: 0.5, ease: 'back.out(1.4)' },
                    1.0
                  )
                  .from(
                    '[data-extract]',
                    { opacity: 0, x: -10, stagger: 0.14, duration: 0.4 },
                    1.15
                  );
              }

              // --- PIPELINE (pinned, scrubbed): stages light up + captions swap ---
              const pipePin = q('[data-pin="pipeline"]');
              const stages = qa<HTMLElement>('[data-stage]');
              const captions = qa<HTMLElement>('[data-caption]');
              if (pipePin && stages.length) {
                gsap.set(captions, { opacity: 0, y: 12 });
                gsap.set(captions[0] ?? [], { opacity: 1, y: 0 });
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: pipePin,
                    start: 'top top',
                    end: '+=1800',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                });
                const marker = q('[data-marker]');
                stages.forEach((stage, i) => {
                  const at = i / stages.length;
                  tl.to(stage, { '--lit': 1, duration: 0.25 }, at).to(
                    stage.querySelector('[data-dot]'),
                    { scale: 1.35, duration: 0.2, yoyo: true, repeat: 1 },
                    at
                  );
                  if (marker && stage.dataset.pos) {
                    tl.to(marker, { left: stage.dataset.pos, duration: 0.25 }, at);
                  }
                  if (captions[i] && i > 0) {
                    tl.to(captions[i - 1] ?? [], { opacity: 0, y: -12, duration: 0.2 }, at).to(
                      captions[i] ?? [],
                      { opacity: 1, y: 0, duration: 0.2 },
                      at + 0.02
                    );
                  }
                });
              }

              // --- INDEED (pinned, scrubbed): redaction wipe reveal ---
              const indeedPin = q('[data-pin="indeed"]');
              if (indeedPin) {
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: indeedPin,
                    start: 'top top',
                    end: '+=1200',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                });
                tl.to('[data-scanbar]', { scaleX: 1, duration: 0.5 }, 0.1)
                  .to('[data-redaction]', { xPercent: 100, opacity: 0, duration: 0.4 }, 0.5)
                  .from('[data-revealed]', { opacity: 0, scale: 0.9, duration: 0.35 }, 0.55)
                  .to('[data-scanbar]', { opacity: 0, duration: 0.2 }, 0.85);
              }
            } else {
              // --- Mobile: no pinning/scrubbing. Show each pinned scene's resolved
              //     end-state; entrances are handled by the [data-fade] fade-ups. ---
              gsap.set(q('[data-status="reading"]') ?? [], { opacity: 0 });
              gsap.set(q('[data-status="classified"]') ?? [], { opacity: 1 });
              gsap.set(q('[data-redaction]') ?? [], { xPercent: 100, opacity: 0 });
            }

            // --- STATS: funnel bars draw, numbers count up, confetti once ---
            const statsSection = q('[data-scene="stats"]');
            if (statsSection) {
              ScrollTrigger.create({
                trigger: statsSection,
                start: 'top 65%',
                once: true,
                onEnter: () => {
                  qa<HTMLElement>('[data-count-to]').forEach(countUp);
                  gsap.to('[data-bar]', {
                    scaleY: (i, el: HTMLElement) => Number.parseFloat(el.dataset.bar ?? '1'),
                    transformOrigin: 'bottom',
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                  });
                },
              });
              ScrollTrigger.create({
                trigger: q('[data-wrapped]') ?? statsSection,
                start: 'top 70%',
                once: true,
                onEnter: fireConfetti,
              });
            }

            return () => {
              split?.revert();
            };
          }
        );
      }, root);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      ScrollTrigger.refresh();

      cleanup = () => {
        window.removeEventListener('resize', onResize);
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
