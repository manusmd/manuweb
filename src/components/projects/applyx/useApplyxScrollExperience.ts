'use client';

import { useEffect } from 'react';

export const SCENES = [
  'hero',
  'ingest',
  'pipeline',
  'indeed',
  'stats',
  'local',
  'jobposting',
  'ask',
  'assistant',
  'outro',
] as const;

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
          gsap.set(qa('[data-response-bar]'), { scaleY: 1 });
          gsap.set(qa('[data-spark]'), { scaleY: 1 });
          gsap.set(qa('[data-stage-card]'), { opacity: 1, y: 0 });
          qa('[data-stage]').forEach(s => gsap.set(s, { '--lit': 1 }));
          gsap.set(q('[data-marker]') ?? [], { left: '100%' });
          gsap.set(q('[data-pipe-fill]') ?? [], { scaleX: 1, transformOrigin: 'left center' });
          qa<HTMLElement>('[data-gauge-arc]').forEach(el => {
            gsap.set(el, { strokeDashoffset: Number(el.dataset.gaugeOffset ?? 0) });
          });
          qa<HTMLElement>('[data-donut-arc]').forEach(el => {
            gsap.set(el, { drawSVG: `${el.dataset.drawFrom ?? 0}% ${el.dataset.drawTo ?? 0}%` });
          });
          gsap.set(qa('[data-gate-reveal]'), { opacity: 1, y: 0 });
          qa('[data-gate-fill]').forEach(el =>
            gsap.set(el, { scaleX: 1, transformOrigin: 'left' })
          );
          gsap.set(qa('[data-gate-lock]'), { scale: 1, opacity: 1 });
          gsap.set(qa('[data-jp-board]'), { opacity: 1, y: 0, scale: 1 });
          gsap.set(qa('[data-jp-opening]'), { opacity: 1, x: 0 });
          gsap.set(qa('[data-jp-field]'), { opacity: 1, y: 0 });
          gsap.set(qa('[data-asst-card]'), { opacity: 1, y: 0, scale: 1 });
          gsap.set(qa('[data-asst-icon]'), { scale: 1 });
        });

        // ---- Full experience (desktop pin + mobile light) ----
        mm.add(
          {
            isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
            isMobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
          },
          context => {
            const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

            // Scale each pinned scene's content to the viewport height so the
            // designed compositions never overflow on shorter screens. Assigned
            // in the desktop branch, cleaned up when the breakpoint changes.
            let fitPinned: (() => void) | undefined;

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
              // --- Fit-to-viewport for pinned scenes. Each pin holds a single
              //     content wrapper (its first child). If that wrapper is taller
              //     than the available height, scale it down uniformly so it sits
              //     fully on screen, centered, clearing the fixed nav. Transform
              //     only — layout height is untouched, so pin spacers stay exact.
              //     Runs on every ScrollTrigger refresh (initial load + resize). ---
              fitPinned = () => {
                const avail = window.innerHeight - 140;
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
                    // Stacked pins must refresh top-to-bottom so each one's
                    // start is measured after the pins above it have inserted
                    // their spacers. Higher priority = refreshed first.
                    refreshPriority: 6,
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

              // --- PIPELINE (pinned, scrubbed): stages light up in turn, a fill
              //     grows to the marker, and each stage's signal card lands and
              //     stays — the detected signals accumulate into a full picture ---
              const pipePin = q('[data-pin="pipeline"]');
              const stages = qa<HTMLElement>('[data-stage]');
              const cards = qa<HTMLElement>('[data-stage-card]');
              const pipeFill = q('[data-pipe-fill]');
              if (pipePin && stages.length) {
                gsap.set(cards, { opacity: 0, y: 16 });
                gsap.set(cards[0] ?? [], { opacity: 1, y: 0 });
                if (pipeFill) gsap.set(pipeFill, { scaleX: 0, transformOrigin: 'left center' });
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: pipePin,
                    start: 'top top',
                    end: '+=1800',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 5,
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
                  if (pipeFill && stage.dataset.pos) {
                    tl.to(
                      pipeFill,
                      { scaleX: parseFloat(stage.dataset.pos) / 100, duration: 0.25 },
                      at
                    );
                  }
                  if (cards[i] && i > 0) {
                    tl.to(
                      cards[i] ?? [],
                      { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' },
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
                    refreshPriority: 4,
                  },
                });
                tl.to('[data-scanbar]', { scaleX: 1, duration: 0.5 }, 0.1)
                  .to('[data-redaction]', { xPercent: 100, opacity: 0, duration: 0.4 }, 0.5)
                  .from('[data-revealed]', { opacity: 0, scale: 0.9, duration: 0.35 }, 0.55)
                  .to('[data-scanbar]', { opacity: 0, duration: 0.2 }, 0.85);
              }

              // --- JOBPOSTING (pinned, scrubbed): an email's ATS link resolves to a
              //     board, its openings populate, the role title normalises, the scan
              //     lands on the match, the confidence bar fills past the 0.60 gate, a
              //     lock snaps in, and the extracted fields slide out. ---
              const jobPin = q('[data-pin="jobposting"]');
              if (jobPin) {
                const scoreEl = q('[data-gate-score]');
                if (scoreEl) scoreEl.textContent = '0.00';
                const counter = { v: 0 };
                const gateCard = q('[data-gate-card]');
                const fillAt = 0.75;
                const fillDur = 0.6;
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: jobPin,
                    start: 'top top',
                    end: '+=2000',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 2,
                  },
                });
                tl.fromTo(
                  '[data-jp-link]',
                  { backgroundColor: 'rgba(59, 130, 246, 0)' },
                  { backgroundColor: 'rgba(59, 130, 246, 0.18)', duration: 0.25 },
                  0.05
                )
                  .from(
                    '[data-jp-board]',
                    { opacity: 0, y: 24, scale: 0.96, duration: 0.4, ease: 'back.out(1.4)' },
                    0.2
                  )
                  .from(
                    '[data-jp-opening]',
                    { opacity: 0, x: -12, stagger: 0.12, duration: 0.3 },
                    0.35
                  )
                  .from(
                    '[data-gate-reveal]',
                    { opacity: 0, y: 10, stagger: 0.18, duration: 0.3 },
                    0.55
                  )
                  .fromTo(
                    '[data-jp-match]',
                    { boxShadow: '0 0 0 0px rgba(52, 211, 153, 0)' },
                    {
                      boxShadow: '0 0 0 2px rgba(52, 211, 153, 0.5)',
                      duration: 0.2,
                      yoyo: true,
                      repeat: 1,
                    },
                    0.66
                  )
                  .fromTo(
                    '[data-gate-fill]',
                    { scaleX: 0, transformOrigin: 'left' },
                    { scaleX: 1, duration: fillDur, ease: 'power2.out' },
                    fillAt
                  )
                  .to(
                    counter,
                    {
                      v: 0.82,
                      duration: fillDur,
                      ease: 'power2.out',
                      onUpdate: () => {
                        if (scoreEl) scoreEl.textContent = counter.v.toFixed(2);
                      },
                    },
                    fillAt
                  )
                  .to(
                    '[data-gate-marker]',
                    { scaleY: 1.8, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.inOut' },
                    fillAt + fillDur * (60 / 82)
                  )
                  .from(
                    '[data-gate-lock]',
                    { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(2.2)' },
                    1.15
                  )
                  .fromTo(
                    gateCard ?? [],
                    { boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)' },
                    {
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.45)',
                      duration: 0.25,
                      yoyo: true,
                      repeat: 1,
                    },
                    1.15
                  )
                  .from(
                    '[data-jp-field]',
                    { opacity: 0, y: 14, stagger: 0.15, duration: 0.3 },
                    1.35
                  );
              }

              // --- ASK (pinned, scrubbed + snapped): scrolling steps through questions.
              //     Each panel's question types in char-by-char (data-ask-q) and its typed
              //     block reveals (data-ask-reveal); only one panel shows at a time. Snap
              //     lands on each question so it never rests mid-transition. The embedding
              //     retrieval lines draw over the first segment. ---
              const askPin = q('[data-pin="ask"]');
              if (askPin) {
                const panels = qa('[data-ask-panel]');
                const qSpans = qa('[data-ask-q]');
                const reveals = qa('[data-ask-reveal]');
                const N = panels.length;
                if (N > 0) {
                  const fulls = qSpans.map(s => s.textContent ?? '');
                  gsap.set(panels, { opacity: 0 });
                  gsap.set(panels[0]!, { opacity: 1 });
                  gsap.set(reveals, { opacity: 0 });
                  gsap.set(reveals[0]!, { opacity: 1 });
                  // Panels 1..N-1 type in on scroll — start them empty.
                  qSpans.forEach((s, i) => {
                    if (i > 0) s.textContent = '';
                  });

                  const tl = gsap.timeline({
                    scrollTrigger: {
                      trigger: askPin,
                      start: 'top top',
                      end: `+=${(N - 1) * 520}`,
                      scrub: 0.5,
                      pin: true,
                      anticipatePin: 1,
                      invalidateOnRefresh: true,
                      refreshPriority: 1,
                      snap: {
                        snapTo: 1 / (N - 1),
                        duration: { min: 0.15, max: 0.35 },
                        ease: 'power2.inOut',
                        directional: false,
                      },
                    },
                  });

                  // Embedding retrieval draws over the first segment.
                  tl.from(
                    '[data-embed-query]',
                    { attr: { r: 0 }, opacity: 0, duration: 0.15, ease: 'back.out(2)' },
                    0.05
                  )
                    .from(
                      '[data-embed-dot]',
                      { attr: { r: 0 }, opacity: 0, stagger: 0.02, duration: 0.15 },
                      0.1
                    )
                    .from(
                      '[data-embed-line]',
                      { drawSVG: '0%', stagger: 0.06, duration: 0.25 },
                      0.2
                    );

                  // Each subsequent question: swap panel, type its text, reveal its block.
                  for (let i = 1; i < N; i++) {
                    const base = i - 1;
                    const full = fulls[i] ?? '';
                    const counter = { v: 0 };
                    // Hold the previous question through the first ~36% of the segment,
                    // then crossfade panels (old out as new in — no hard cut), type
                    // the new question, and reveal its block.
                    tl.to(
                      panels[i - 1]!,
                      { opacity: 0, duration: 0.22, ease: 'power1.inOut' },
                      base + 0.36
                    )
                      .to(
                        panels[i]!,
                        { opacity: 1, duration: 0.22, ease: 'power1.inOut' },
                        base + 0.4
                      )
                      .to(
                        counter,
                        {
                          v: full.length,
                          duration: 0.32,
                          ease: 'none',
                          onUpdate: () => {
                            const el = qSpans[i];
                            if (el) el.textContent = full.slice(0, Math.round(counter.v));
                          },
                        },
                        base + 0.44
                      )
                      .fromTo(
                        reveals[i]!,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.2 },
                        base + 0.78
                      );
                  }
                }
              }
            } else {
              // --- Mobile: no pinning/scrubbing. Show each pinned scene's resolved
              //     end-state; entrances are handled by the [data-fade] fade-ups. ---
              gsap.set(q('[data-status="reading"]') ?? [], { opacity: 0 });
              gsap.set(q('[data-status="classified"]') ?? [], { opacity: 1 });
              gsap.set(q('[data-redaction]') ?? [], { xPercent: 100, opacity: 0 });
              gsap.set(q('[data-jp-board]') ?? [], { opacity: 1, y: 0, scale: 1 });
              gsap.set(qa('[data-jp-opening]'), { opacity: 1, x: 0 });
              gsap.set(qa('[data-gate-reveal]'), { opacity: 1, y: 0 });
              qa('[data-gate-fill]').forEach(el =>
                gsap.set(el, { scaleX: 1, transformOrigin: 'left' })
              );
              gsap.set(qa('[data-gate-lock]'), { scale: 1, opacity: 1 });
              gsap.set(qa('[data-jp-field]'), { opacity: 1, y: 0 });
            }

            // --- STATS (pinned, scrubbed on desktop): the dashboard assembles as you
            //     scroll — KPI numbers count up, sparklines + funnel + bars grow, the
            //     reply gauge and outcomes donut draw, and confetti fires once when the
            //     funnel reaches the offer. Mobile/reduced show the resolved end-state. ---
            const statsPin = q('[data-pin="stats"]');
            if (statsPin) {
              const counts = qa<HTMLElement>('[data-stat-count]');
              const setFinal = (el: HTMLElement) => {
                el.textContent = `${el.dataset.to ?? ''}${el.dataset.suffix ?? ''}`;
              };

              if (isDesktop) {
                counts.forEach(el => {
                  el.textContent = `0${el.dataset.suffix ?? ''}`;
                });
                let confettiFired = false;
                const tl = gsap.timeline({
                  scrollTrigger: {
                    trigger: statsPin,
                    start: 'top top',
                    end: '+=1700',
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    refreshPriority: 3,
                  },
                });

                counts.forEach(el => {
                  const to = Number(el.dataset.to ?? 0);
                  const suffix = el.dataset.suffix ?? '';
                  const c = { v: 0 };
                  tl.to(
                    c,
                    {
                      v: to,
                      duration: 0.3,
                      ease: 'power1.out',
                      onUpdate: () => {
                        el.textContent = `${Math.round(c.v)}${suffix}`;
                      },
                    },
                    0.05
                  );
                });
                tl.to(
                  '[data-spark]',
                  { scaleY: 1, transformOrigin: 'bottom', stagger: 0.02, duration: 0.3 },
                  0.05
                );
                qa<HTMLElement>('[data-gauge-arc]').forEach(el => {
                  tl.to(
                    el,
                    { strokeDashoffset: Number(el.dataset.gaugeOffset ?? 0), duration: 0.35 },
                    0.1
                  );
                });
                tl.from(
                  '[data-funnel-seg]',
                  {
                    scaleY: 0,
                    opacity: 0,
                    transformOrigin: 'top',
                    stagger: 0.1,
                    duration: 0.3,
                    ease: 'power3.out',
                  },
                  0.3
                );
                tl.call(
                  () => {
                    if (!confettiFired) {
                      confettiFired = true;
                      fireConfetti();
                    }
                  },
                  [],
                  0.66
                );
                qa<HTMLElement>('[data-donut-arc]').forEach((el, i) => {
                  tl.fromTo(
                    el,
                    { drawSVG: `${el.dataset.drawFrom ?? 0}% ${el.dataset.drawFrom ?? 0}%` },
                    {
                      drawSVG: `${el.dataset.drawFrom ?? 0}% ${el.dataset.drawTo ?? 0}%`,
                      duration: 0.3,
                    },
                    0.55 + i * 0.05
                  );
                });
                tl.from(
                  '[data-response-bar]',
                  { scaleY: 0, transformOrigin: 'bottom', stagger: 0.05, duration: 0.3 },
                  0.72
                );
              } else {
                // Mobile: resolved end-state (no pin/scrub).
                counts.forEach(setFinal);
                gsap.set('[data-spark]', { scaleY: 1 });
                qa<HTMLElement>('[data-gauge-arc]').forEach(el =>
                  gsap.set(el, { strokeDashoffset: Number(el.dataset.gaugeOffset ?? 0) })
                );
                qa<HTMLElement>('[data-donut-arc]').forEach(el =>
                  gsap.set(el, {
                    drawSVG: `${el.dataset.drawFrom ?? 0}% ${el.dataset.drawTo ?? 0}%`,
                  })
                );
              }
            }

            // --- ASSISTANT (not pinned): the calmer beat before the finale. Cards
            //     cascade in, icons pop, and the queue's open-count ticks up — played
            //     once on enter (like the stats reveal). Runs on desktop and mobile. ---
            const asstSection = q('[data-scene="assistant"]');
            if (asstSection) {
              const asstCountEl = q('[data-asst-count]');
              gsap.set('[data-asst-card]', { opacity: 0, y: 34, scale: 0.96 });
              gsap.set('[data-asst-icon]', { scale: 0 });
              if (asstCountEl) asstCountEl.textContent = '0';
              ScrollTrigger.create({
                trigger: asstSection,
                start: 'top 72%',
                once: true,
                onEnter: () => {
                  gsap.to('[data-asst-card]', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power3.out',
                  });
                  gsap.to('[data-asst-icon]', {
                    scale: 1,
                    stagger: 0.1,
                    delay: 0.15,
                    duration: 0.45,
                    ease: 'back.out(1.7)',
                  });
                  const asstCounter = { v: 0 };
                  gsap.to(asstCounter, {
                    v: 3,
                    duration: 0.8,
                    delay: 0.5,
                    ease: 'power1.out',
                    onUpdate: () => {
                      if (asstCountEl) asstCountEl.textContent = String(Math.round(asstCounter.v));
                    },
                  });
                },
              });
            }

            return () => {
              if (fitPinned) ScrollTrigger.removeEventListener('refresh', fitPinned);
              // Inline scale transforms aren't GSAP tweens, so clear them by hand
              // when leaving the desktop breakpoint.
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
