'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';
import type { ToolDemo } from './tokens';

/**
 * Feinwerk's signature backdrop: a faint millimetre grid, a set of slowly
 * drifting lime ruler ticks (driven by GSAP in the scroll hook via
 * `data-fw-tick`), and a vertical measuring line. This is what gives the page
 * its "technical workshop" identity — the counterpart to afterhive's Liquid.
 */
export function FeinwerkBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#0b0d11]" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          data-fw-tick
          className="absolute block h-16 w-px bg-[#d8e84a]/30"
          style={{ left: `${8 + i * 13}%`, top: `${10 + ((i * 37) % 70)}%` }}
        />
      ))}
      <div
        className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />
    </div>
  );
}

/**
 * Full-hero "drafting board" background: graph paper (fine + major grid), a
 * ruler along the top and left edges with lime majors, and measurement numbers
 * at the major marks. Masked to fade out toward the bottom so the hero copy
 * always sits on a calm surface. This is the ruler from feinwerk-tools.de scaled
 * up into a background.
 */
export function HeroRulerField() {
  const marks = Array.from({ length: 12 }, (_, i) => i);
  const fadeGradient = 'linear-gradient(to bottom, black 52%, transparent 88%)';
  const fade = { maskImage: fadeGradient, WebkitMaskImage: fadeGradient } as const;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* fine graph paper */}
      <div
        className="absolute inset-0"
        style={{
          ...fade,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* major graph lines (every 160px), a touch of lime on the verticals */}
      <div
        className="absolute inset-0"
        style={{
          ...fade,
          backgroundImage:
            'linear-gradient(to right, rgba(216,232,74,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '160px 160px',
        }}
      />
      {/* top ruler, just below the fixed header */}
      <div
        className="absolute inset-x-0 top-[66px] h-4"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(150,153,148,0.5) 0 1px, transparent 1px 16px), repeating-linear-gradient(to right, rgba(216,232,74,0.85) 0 1px, transparent 1px 160px)',
          backgroundPosition: 'top',
          backgroundSize: '100% 8px, 100% 16px',
          backgroundRepeat: 'repeat-x',
        }}
      />
      {/* left ruler */}
      <div
        className="absolute bottom-0 left-0 top-[66px] w-4"
        style={{
          ...fade,
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(150,153,148,0.5) 0 1px, transparent 1px 16px), repeating-linear-gradient(to bottom, rgba(216,232,74,0.85) 0 1px, transparent 1px 160px)',
          backgroundPosition: 'left',
          backgroundSize: '8px 100%, 16px 100%',
          backgroundRepeat: 'repeat-y',
        }}
      />
      {/* measurement numbers along the top ruler */}
      <div className="absolute inset-x-0 top-[88px] hidden md:block">
        {marks.map(n => (
          <span
            key={n}
            className="absolute font-mono text-[10px] tabular-nums text-[#8a8f8a]/45"
            style={{ left: n * 160 + 6 }}
          >
            {n * 100}
          </span>
        ))}
      </div>
      {/* origin marker where the two rulers meet */}
      <div className="absolute left-1.5 top-[70px] font-mono text-[10px] text-[#d8e84a]/70">0</div>
    </div>
  );
}

/** Mono eyebrow with a lime pulse dot. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#8a8f8a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d8e84a]" />
      {children}
    </span>
  );
}

/** A dark technical panel. */
export function Panel({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.04] backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function Chip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-md border px-3 py-1.5 font-mono text-sm ${
        accent
          ? 'border-[#d8e84a]/50 bg-[#d8e84a]/10 text-[#d8e84a]'
          : 'border-white/15 bg-white/[0.04] text-[#c6c9c2]'
      }`}
    >
      {children}
    </span>
  );
}

/** A small looping demonstration of what each tool does. Idle animation only —
 *  purely decorative, and stilled entirely under reduced motion. */
export function ToolDemoVisual({ demo }: { demo: ToolDemo }) {
  const reduce = useReducedMotion();
  const loop = (extra: TargetAndTransition) =>
    reduce
      ? {}
      : { animate: extra, transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' } };

  if (demo === 'heic') {
    return (
      <div className="flex h-full items-center justify-center gap-3">
        <Chip>HEIC</Chip>
        <motion.span className="font-mono text-lg text-[#d8e84a]" {...loop({ x: [0, 8, 0] })}>
          →
        </motion.span>
        <Chip accent>JPG</Chip>
      </div>
    );
  }

  if (demo === 'shrink') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="flex h-24 items-end gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 rounded-sm bg-white/15" style={{ height: 90 }} />
            <span className="font-mono text-[11px] text-[#8a8f8a]">8,4 MB</span>
          </div>
          <span className="mb-6 font-mono text-[#d8e84a]">→</span>
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="w-12 rounded-sm bg-[#d8e84a]"
              style={{ height: 30, transformOrigin: 'bottom' }}
              {...loop({ scaleY: [1, 0.75, 1] })}
            />
            <span className="font-mono text-[11px] text-[#d8e84a]">1,2 MB</span>
          </div>
        </div>
      </div>
    );
  }

  if (demo === 'merge') {
    return (
      <div className="relative flex h-full items-center justify-center">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute h-20 w-16 rounded-md border border-white/15 bg-white/[0.05]"
            style={{ left: `calc(50% - 32px + ${(i - 1) * 34}px)` }}
            {...loop({ x: [0, -(i - 1) * 34, 0], opacity: [1, i === 1 ? 1 : 0.4, 1] })}
          />
        ))}
        <div className="absolute h-24 w-[3px] rounded bg-[#d8e84a]/40" />
      </div>
    );
  }

  if (demo === 'compress') {
    return (
      <div className="flex h-full items-center justify-center gap-4">
        <div className="grid grid-cols-6 gap-[3px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-2 w-2 rounded-[1px] bg-white/25" />
          ))}
        </div>
        <span className="font-mono text-[#d8e84a]">→</span>
        <motion.div className="grid grid-cols-6 gap-[3px]" {...loop({ opacity: [1, 0.7, 1] })}>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-[1px]"
              style={{ background: i % 3 === 0 ? '#d8e84a' : 'rgba(255,255,255,0.12)' }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (demo === 'scale') {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          className="rounded-md border-2 border-dashed border-[#d8e84a]/60"
          style={{ width: 120, height: 80 }}
          {...loop({ width: [120, 78, 120], height: [80, 52, 80] })}
        />
      </div>
    );
  }

  // qr
  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid grid-cols-6 gap-[3px]">
        {Array.from({ length: 36 }).map((_, i) => {
          const on = [
            0, 1, 2, 6, 12, 5, 4, 3, 11, 17, 35, 34, 33, 29, 23, 14, 20, 26, 8, 15,
          ].includes(i);
          return (
            <motion.span
              key={i}
              className="h-2.5 w-2.5 rounded-[1px]"
              style={{ background: on ? '#f4f4f1' : 'rgba(255,255,255,0.06)' }}
              {...(reduce || !on
                ? {}
                : {
                    animate: { opacity: [1, 0.4, 1] },
                    transition: { repeat: Infinity, duration: 2, delay: (i % 6) * 0.15 },
                  })}
            />
          );
        })}
      </div>
    </div>
  );
}
