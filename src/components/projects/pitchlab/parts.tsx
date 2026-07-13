import type { ReactNode } from 'react';
import type { Team } from './tokens';

/** Section eyebrow. */
export function SceneStep({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
      {children}
    </span>
  );
}

/** A team chip: 3-letter code on the team's colours. */
export function TeamBadge({
  team,
  size = 'md',
  className = '',
}: {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const dims =
    size === 'lg' ? 'h-12 w-12 text-sm' : size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-bold tracking-tight ring-1 ring-white/10 ${dims} ${className}`}
      style={{ backgroundColor: team.bg, color: team.fg }}
    >
      {team.code}
    </span>
  );
}

/**
 * A macOS-style browser window framing a real app screenshot. Optional children
 * overlay on top of the shot.
 */
export function BrowserFrame({
  src,
  alt = '',
  url = 'pitchlab.projects.manu-web.de',
  imgClassName = 'block w-full',
}: {
  src: string;
  alt?: string;
  url?: string;
  imgClassName?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0e13] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.03]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/50 px-3.5 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-muted-foreground">
          {url}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- static exported screenshot */}
      <img src={src} alt={alt} className={imgClassName} />
    </div>
  );
}

/** A stat tile (big mono number + label). */
export function StatTile({
  value,
  label,
  accent,
  dataAttr,
}: {
  value: ReactNode;
  label: string;
  accent?: string;
  dataAttr?: Record<string, string>;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4" {...dataAttr}>
      <div
        className="font-mono text-2xl font-bold tracking-tight md:text-3xl"
        style={{ color: accent ?? 'hsl(var(--foreground))' }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
