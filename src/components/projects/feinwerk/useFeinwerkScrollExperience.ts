'use client';

import { useEffect } from 'react';

export const SCENES = ['hero', 'upload', 'pipeline', 'tools', 'compress', 'tech', 'outro'] as const;

const fmt = (v: number, dec: number) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });

/**
 * GSAP scroll choreography for the Feinwerk detail page. Same scaffold as the
 * other project pages (bounded font/rAF waits, matchMedia branches, deferred
 * refreshes, fit-to-viewport for pinned scenes). Three pinned desktop scenes —
 * the upload-fear reversal, the local pipeline, and a horizontal tour through
 * the six tools — plus scrubbed count-ups and a drifting ruler backdrop.
 */
export function useFeinwerkScrollExperience(
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
      qa<HTMLElement>('[data-fw-count]').forEach(el => {
        const to = Number(el.dataset.to ?? 0);
        const dec = Number(el.dataset.decimals ?? 0);
        el.textContent = fmt(to, dec) + (el.dataset.suffix ?? '');
      });
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

        // ---- Reduced motion: resolved end-state, no pinning. ----
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set(qa('[data-fw-reveal], [data-fw-hero-title], [data-fw-chip]'), {
            opacity: 1,
            y: 0,
          });
          gsap.set(qa('[data-fw-rule]'), { scaleX: 1 });
          gsap.set(qa('[data-fw-guard]'), { scaleX: 1 });
          gsap.set(qa('[data-fw-stamp]'), { opacity: 1, scale: 1 });
          gsap.set(qa('[data-fw-cloud]'), { opacity: 0.35 });
          gsap.set(qa('[data-fw-stage]'), { color: '#d8e84a' });
          gsap.set(qa('[data-fw-comp-bar]'), { scaleX: 0.16 });
          gsap.set(qa('[data-fw-outro-tick]'), { opacity: 1, scaleY: 1 });
          setCountsToFinal();
          // Tools: show the full row as a horizontal scroller instead of a pin.
          const track = q('[data-fw-track]');
          if (track) {
            gsap.set(track, { x: 0 });
            track.style.paddingLeft = '1.5rem';
            track.style.paddingRight = '1.5rem';
            track.parentElement?.style.setProperty('overflow-x', 'auto');
          }
        });

        mm.add(
          {
            isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
            isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          },
          context => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };
            let fitPinned: (() => void) | undefined;
            let split: InstanceType<typeof SplitText> | undefined;

            // Scene tracking → nav dots
            SCENES.forEach((name, i) => {
              const el = q(`[data-scene="${name}"]`);
              if (!el) return;
              ScrollTrigger.create({
                trigger: el,
                start: 'top 55%',
                end: 'bottom 45%',
                onToggle: self => self.isActive && setActiveScene(i),
              });
            });

            // Signature backdrop: ruler ticks drift slowly on their own loops.
            qa<HTMLElement>('[data-fw-tick]').forEach((tick, i) => {
              const dir = i % 2 === 0 ? 1 : -1;
              gsap.to(tick, {
                yPercent: dir * (30 + i * 8),
                duration: 12 + i * 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            });

            // Hero intro (SplitText chars + staggered reveals + rule draw)
            const heroTitle = q('[data-fw-hero-title]');
            const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
            gsap.set('[data-fw-reveal]', { opacity: 0, y: 24 });
            gsap.set('[data-fw-rule]', { scaleX: 0 });
            if (heroTitle) {
              split = new SplitText(heroTitle, { type: 'chars' });
              gsap.set(split.chars, { opacity: 0, y: 48 });
              intro.to(split.chars, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6 }, 0.1);
            }
            intro.to('[data-fw-rule]', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.5);
            const heroReveals = qa('[data-fw-reveal]').filter(el =>
              el.closest('[data-scene="hero"]')
            );
            intro.to(heroReveals, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 }, 0.4);

            // Generic reveals (everything outside the hero)
            qa<HTMLElement>('[data-fw-reveal]')
              .filter(el => !el.closest('[data-scene="hero"]'))
              .forEach(el => {
                gsap.set(el, { opacity: 0, y: 24 });
                gsap.to(el, {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: el, start: 'top 85%' },
                });
              });

            // Tech chips cascade in
            if (q('[data-fw-chip]')) {
              gsap.from('[data-fw-chip]', {
                opacity: 0,
                y: 14,
                scale: 0.9,
                stagger: 0.05,
                duration: 0.4,
                ease: 'back.out(1.6)',
                scrollTrigger: { trigger: '[data-scene="tech"]', start: 'top 70%', once: true },
              });
            }

            // Outro ruler ticks converge — "measurement complete"
            if (q('[data-fw-outro-tick]')) {
              gsap.from('[data-fw-outro-tick]', {
                scaleY: 0,
                opacity: 0,
                transformOrigin: 'bottom',
                stagger: { each: 0.02, from: 'edges' },
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: { trigger: '[data-scene="outro"]', start: 'top 70%', once: true },
              });
            }

            // Compression: scrubbed bar + count-ups (all sizes)
            const compressScene = q('[data-scene="compress"]');
            if (compressScene) {
              gsap.fromTo(
                '[data-fw-comp-bar]',
                { scaleX: 1 },
                {
                  scaleX: 0.16,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: compressScene,
                    start: 'top 70%',
                    end: 'center 45%',
                    scrub: 0.5,
                  },
                }
              );
              qa<HTMLElement>('[data-fw-count]').forEach(el => {
                const to = Number(el.dataset.to ?? 0);
                const dec = Number(el.dataset.decimals ?? 0);
                const suffix = el.dataset.suffix ?? '';
                const c = { v: 0 };
                gsap.to(c, {
                  v: to,
                  duration: 1.3,
                  ease: 'power1.out',
                  onUpdate: () => {
                    el.textContent = fmt(c.v, dec) + suffix;
                  },
                  scrollTrigger: { trigger: compressScene, start: 'top 65%', once: true },
                });
              });
            }

            if (isDesktop) {
              fitPinned = () => {
                const avail = window.innerHeight - 120;
                qa<HTMLElement>('[data-pin]:not([data-no-fit])').forEach(pin => {
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

              // --- UPLOAD (pinned scrub): files get pulled back behind the line ---
              const uploadPin = q('[data-pin="upload"]');
              const files = qa<HTMLElement>('[data-fw-file]');
              if (uploadPin && files.length) {
                gsap.set('[data-fw-stamp]', { opacity: 0, scale: 0.6 });
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: uploadPin,
                    start: 'top top',
                    end: '+=1300',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 4,
                  },
                });
                // Phase A: the files are dragged up toward the foreign server.
                tl.to(files, { y: -170, stagger: 0.05, ease: 'power1.in', duration: 1 }, 0);
                tl.to('[data-fw-cloud]', { color: '#e86a5a', duration: 1 }, 0);
                // Phase B: the "Dein Gerät" line snaps in and pulls them back.
                tl.to('[data-fw-guard]', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 1.1);
                tl.to(files, { y: 0, stagger: 0.05, ease: 'back.out(1.4)', duration: 0.7 }, 1.2);
                tl.to('[data-fw-cloud]', { opacity: 0.3, color: '#8a8f8a', duration: 0.5 }, 1.2);
                tl.to(
                  '[data-fw-stamp]',
                  { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' },
                  1.7
                );
                tl.to({}, { duration: 0.6 });
              }

              // --- PIPELINE (pinned scrub): the file travels; 0 bytes leave ---
              const pipelinePin = q('[data-pin="pipeline"]');
              const token = q('[data-fw-token]');
              const stages = qa<HTMLElement>('[data-fw-stage]');
              if (pipelinePin && token) {
                gsap.set(stages, { color: '#8a8f8a' });
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: pipelinePin,
                    start: 'top top',
                    end: '+=1200',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });
                stages.forEach((stage, i) => {
                  const at = 0.4 + i * 1;
                  tl.to(
                    token,
                    {
                      left: `${(i / (stages.length - 1)) * 100}%`,
                      xPercent: i === 0 ? 0 : i === stages.length - 1 ? -100 : -50,
                      ease: 'none',
                      duration: 1,
                    },
                    at
                  );
                  tl.to(stage, { color: '#d8e84a', duration: 0.3 }, at + 0.5);
                });
                // a tiny nudge on the "0" to underline it never moves
                tl.to(
                  '[data-fw-bytes]',
                  { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1 },
                  '>-0.2'
                );
                tl.to({}, { duration: 0.6 });
              }

              // --- TOOLS (pinned horizontal scrub): tour the six tools ---
              const toolsPin = q('[data-pin="tools"]');
              const track = q('[data-fw-track]');
              const numEl = q('[data-fw-tool-num]');
              const cards = qa<HTMLElement>('[data-fw-tool-card]');
              if (toolsPin && track && cards.length) {
                const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
                gsap.to(track, {
                  x: () => -distance(),
                  ease: 'none',
                  scrollTrigger: {
                    trigger: toolsPin,
                    start: 'top top',
                    // Deterministic scroll budget so the pin always establishes
                    // (a width-derived end can resolve to zero before layout).
                    end: '+=' + cards.length * 440,
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 2,
                    onUpdate: self => {
                      const idx = Math.min(
                        cards.length - 1,
                        Math.round(self.progress * (cards.length - 1))
                      );
                      if (numEl) numEl.textContent = String(idx + 1).padStart(2, '0');
                    },
                  },
                });
              }
            } else {
              // Mobile: resolved end-states, no pinning.
              gsap.set(qa('[data-fw-guard]'), { scaleX: 1 });
              gsap.set(qa('[data-fw-stamp]'), { opacity: 1, scale: 1 });
              gsap.set(qa('[data-fw-cloud]'), { opacity: 0.3 });
              gsap.set(qa('[data-fw-stage]'), { color: '#d8e84a' });
              const token = q('[data-fw-token]');
              if (token) gsap.set(token, { left: '100%', xPercent: -100 });
              const track = q('[data-fw-track]');
              if (track) {
                track.style.paddingLeft = '1.5rem';
                track.style.paddingRight = '1.5rem';
                track.parentElement?.style.setProperty('overflow-x', 'auto');
              }
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
