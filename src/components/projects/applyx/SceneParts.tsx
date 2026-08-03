import type { HTMLAttributes, ReactNode } from 'react';
import { STATUS, type StatusKey } from '@/components/projects/applyx/tokens';

/**
 * ApplyX's signature backdrop: the calm navy app shell. A deep navy base, a
 * faint data-table dot grid, a soft indigo focus glow up top, and a hint of the
 * app's left sidebar rail. This is the counterpart to Feinwerk's drafting board
 * and afterhive's Liquid field — it gives the page the ApplyX app's identity.
 */
export function ApplyxBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0e14]" />
      {/* data-table dot grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1.4px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black, transparent 78%)',
        }}
      />
      {/* indigo focus glow */}
      <div
        className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(79,124,255,0.16), transparent 62%)',
        }}
      />
      {/* left sidebar rail hint */}
      <div className="absolute inset-y-0 left-16 hidden w-px bg-white/[0.05] lg:block" />
    </div>
  );
}

/** Section eyebrow with the app's rounded-square mark (echoes the ApplyX logo). */
export function SceneStep({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
      <span className="grid h-4 w-4 place-items-center rounded-[5px] bg-primary/15">
        <span className="h-1.5 w-1.5 rounded-[2px] bg-primary" />
      </span>
      {children}
    </span>
  );
}

/** A dark app-surface panel matching ApplyX's cards. */
export function AppPanel({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-white/[0.02] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** The app's signature status pill (Applied / Interview / Offer / …). */
export function StatusPill({ status, children }: { status: StatusKey; children: ReactNode }) {
  const s = STATUS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
      style={{ color: s.color, borderColor: s.border, backgroundColor: s.tint }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {children}
    </span>
  );
}

export function PipelineRow({ label, lit = false }: { label: string; lit?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${lit ? 'bg-primary' : 'bg-muted-foreground/30'}`}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function StatTile({
  value,
  label,
  suffix = '',
  accent = 'blue',
  active = false,
}: {
  value: number;
  label: string;
  suffix?: string;
  accent?: 'blue' | 'indigo' | 'green';
  active?: boolean;
}) {
  const color =
    accent === 'green' ? '#22c55e' : accent === 'indigo' ? '#6b8afd' : 'hsl(var(--primary))';
  return (
    <div
      className={`rounded-2xl border p-6 transition-colors ${
        active ? 'border-primary/60 bg-primary/[0.06]' : 'border-white/[0.08] bg-white/[0.02]'
      }`}
    >
      <div className="font-display text-4xl font-bold md:text-5xl" style={{ color }}>
        <span data-count-to={value} data-count-suffix={suffix}>
          0{suffix}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
