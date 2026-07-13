import type { ReactNode } from 'react';
import { TYPE_TOKENS, type Minutia, type MinutiaType } from './tokens';

/** Section eyebrow, mirrors ApplyX's SceneStep. */
export function SceneStep({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
      {children}
    </span>
  );
}

/**
 * A single minutia marker as an SVG group positioned in a 0..100 viewBox.
 * Shapes match the app: circle=bifurcation, square=ending, triangle=loop,
 * diamond=delta. Optional orientation tick for typed minutiae.
 */
export function MinutiaMarker({
  m,
  size = 2.6,
  tick = false,
  extraProps,
}: {
  m: Minutia;
  size?: number;
  tick?: boolean;
  extraProps?: Record<string, string>;
}) {
  const cx = m.x * 100;
  const cy = m.y * 100;
  const c = TYPE_TOKENS[m.type].color;
  const r = size / 2;
  const stroke = 'rgba(5,7,10,0.85)';
  const sw = 0.5;

  let shape: ReactNode;
  const g = TYPE_TOKENS[m.type].glyph;
  if (g === 'circle') {
    shape = <circle cx={cx} cy={cy} r={r} fill={c} stroke={stroke} strokeWidth={sw} />;
  } else if (g === 'square') {
    shape = (
      <rect
        x={cx - r}
        y={cy - r}
        width={size}
        height={size}
        fill={c}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  } else if (g === 'diamond') {
    shape = (
      <rect
        x={cx - r}
        y={cy - r}
        width={size}
        height={size}
        fill={c}
        stroke={stroke}
        strokeWidth={sw}
        transform={`rotate(45 ${cx} ${cy})`}
      />
    );
  } else {
    // triangle
    const h = size * 0.9;
    shape = (
      <polygon
        points={`${cx},${cy - h / 2} ${cx - r},${cy + h / 2} ${cx + r},${cy + h / 2}`}
        fill={c}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  }

  const tickEl =
    tick && m.angle !== null ? (
      <line
        x1={cx}
        y1={cy}
        x2={Math.round((cx + Math.cos(m.angle) * (r + 2.4)) * 1000) / 1000}
        y2={Math.round((cy + Math.sin(m.angle) * (r + 2.4)) * 1000) / 1000}
        stroke={c}
        strokeWidth={0.6}
        strokeLinecap="round"
        opacity={0.85}
      />
    ) : null;

  return (
    <g
      data-type={m.type}
      data-id={m.id}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      {...extraProps}
    >
      {tickEl}
      {shape}
    </g>
  );
}

/** A small legend swatch glyph (HTML, for legends/cards). */
export function Glyph({ type, size = 12 }: { type: MinutiaType; size?: number }) {
  const c = TYPE_TOKENS[type].color;
  const g = TYPE_TOKENS[type].glyph;
  const base = { width: size, height: size, display: 'inline-block' } as const;
  if (g === 'circle') return <span style={{ ...base, borderRadius: '50%', background: c }} />;
  if (g === 'square') return <span style={{ ...base, background: c }} />;
  if (g === 'diamond')
    return <span style={{ ...base, background: c, transform: 'rotate(45deg)' }} />;
  return (
    <span
      style={{
        width: 0,
        height: 0,
        display: 'inline-block',
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${c}`,
      }}
    />
  );
}

/**
 * A square fingerprint frame: a stacked set of stage images plus a marker
 * overlay. Children render inside the same 0..100 SVG coordinate space.
 */
export function FingerprintFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * A macOS-style browser window that frames a real app screenshot so it reads as
 * "the actual product". Optional children overlay on top of the shot (e.g. a
 * scan line). The URL bar shows the live app.
 */
export function BrowserFrame({
  src,
  alt = '',
  url = 'fingermatch.projects.manu-web.de',
  children,
  imgClassName = 'block w-full',
}: {
  src: string;
  alt?: string;
  url?: string;
  children?: ReactNode;
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
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- static exported screenshot */}
        <img src={src} alt={alt} className={imgClassName} />
        {children}
      </div>
    </div>
  );
}
