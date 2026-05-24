'use client';

import type { TimelineDesktopTheme } from '@/components/about/timeline.constants';
import { cn } from '@/lib/utils';

type AboutJobSceneVisualProps = {
  visualElement: TimelineDesktopTheme['visualElement'];
  accentHex: string;
  className?: string;
};

export function AboutJobSceneVisual({
  visualElement,
  accentHex,
  className,
}: AboutJobSceneVisualProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-0 top-1/2 z-[1] hidden h-[min(300px,46%)] w-[min(300px,36%)] -translate-y-1/2 opacity-85 lg:block',
        className
      )}
      aria-hidden
    >
      {visualElement === 'secret' && (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <rect
            x="28"
            y="40"
            width="144"
            height="112"
            rx="12"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.45"
          />
          <rect x="28" y="40" width="144" height="28" rx="12" fill={accentHex} opacity="0.12" />
          <circle cx="44" cy="54" r="4" fill={accentHex} opacity="0.5" />
          <circle cx="58" cy="54" r="4" fill={accentHex} opacity="0.35" />
          <circle cx="72" cy="54" r="4" fill={accentHex} opacity="0.25" />
          <path d="M88 108h24v28H88z" stroke={accentHex} strokeWidth="2" opacity="0.5" />
          <path
            d="M76 108c0-12 10-20 24-20s24 8 24 20"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.55"
          />
        </svg>
      )}
      {visualElement === 'matrix' && (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          {[0, 1, 2, 3, 4].map(row =>
            [0, 1, 2, 3, 4].map(col => (
              <rect
                key={`${row}-${col}`}
                x={36 + col * 28}
                y={36 + row * 28}
                width="18"
                height="18"
                rx="2"
                fill={accentHex}
                opacity={0.08 + ((row + col) % 3) * 0.06}
              />
            ))
          )}
          <path
            d="M36 164h128"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.35"
            strokeDasharray="6 8"
          />
        </svg>
      )}
      {visualElement === 'tech' && (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <circle cx="100" cy="72" r="28" stroke={accentHex} strokeWidth="2" opacity="0.45" />
          <circle cx="52" cy="132" r="22" stroke={accentHex} strokeWidth="2" opacity="0.35" />
          <circle cx="148" cy="132" r="22" stroke={accentHex} strokeWidth="2" opacity="0.35" />
          <path
            d="M88 92 L60 118 M112 92 L140 118 M100 100 V132"
            stroke={accentHex}
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      )}
      {visualElement === 'medical' && (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <rect
            x="68"
            y="48"
            width="64"
            height="104"
            rx="16"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.4"
          />
          <path d="M100 76v48M76 100h48" stroke={accentHex} strokeWidth="3" opacity="0.5" />
          <path
            d="M48 156c16-12 32-18 52-18s36 6 52 18"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      )}
      {visualElement === 'education' && (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <path
            d="M36 88 L100 56 L164 88 L100 120 Z"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.45"
            fill={accentHex}
            fillOpacity="0.08"
          />
          <path
            d="M52 96v40c0 10 22 18 48 18s48-8 48-18V96"
            stroke={accentHex}
            strokeWidth="2"
            opacity="0.4"
          />
          <path d="M164 88v44" stroke={accentHex} strokeWidth="2" opacity="0.35" />
        </svg>
      )}
    </div>
  );
}
