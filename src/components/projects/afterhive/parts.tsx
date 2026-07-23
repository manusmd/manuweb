import type { HTMLAttributes, ReactNode } from 'react';

/** Section eyebrow. */
export function SceneStep({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent-violet">
      {children}
    </span>
  );
}

/** A Liquid glass card — the app's own visual language. */
export function GlassCard({
  children,
  className = '',
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.05] backdrop-blur-xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** A macOS-style browser window framing a real app screenshot. */
export function BrowserFrame({
  src,
  alt = '',
  url = 'app.afterhive.de',
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
