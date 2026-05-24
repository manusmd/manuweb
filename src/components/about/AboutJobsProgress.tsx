'use client';

import { resolveTimelineMobileAccent } from '@/components/about/timeline.constants';
import { cn } from '@/lib/utils';
import type { ExperienceEntry } from '@/types/experience';

type AboutJobsProgressProps = {
  experiences: ExperienceEntry[];
  activeIndex: number;
  scrollProgress: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function AboutJobsProgress({
  experiences,
  activeIndex,
  scrollProgress,
  onSelect,
  className,
}: AboutJobsProgressProps) {
  const total = experiences.length;
  const current = String(activeIndex + 1).padStart(2, '0');
  const count = String(total).padStart(2, '0');
  const activeExp = experiences[activeIndex];
  const accentHex = activeExp ? resolveTimelineMobileAccent(activeExp.company) : undefined;

  return (
    <div className={cn('w-full', className)}>
      <div className="rounded-2xl border border-white/[0.08] bg-background/30 px-3.5 py-2.5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-4 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex shrink-0 items-baseline gap-1 border-r border-border/35 pr-3 md:pr-4">
            <span className="font-display text-lg font-bold tabular-nums tracking-tight text-foreground md:text-xl">
              {current}
            </span>
            <span className="text-[11px] font-medium tabular-nums text-muted-foreground/50 md:text-xs">
              / {count}
            </span>
          </div>

          <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground/85 md:text-sm">
            {activeExp?.company ?? ''}
          </p>

          <div className="flex shrink-0 items-center gap-1.5">
            {experiences.map((exp, index) => {
              const active = activeIndex === index;
              const dotAccent = resolveTimelineMobileAccent(exp.company);
              return (
                <button
                  key={`${exp.company}-dot-${index}`}
                  type="button"
                  title={exp.company}
                  aria-label={exp.company}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active ? 'h-2 w-7' : 'h-1.5 w-1.5 bg-foreground/20 hover:bg-foreground/35'
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: dotAccent,
                          boxShadow: `0 0 12px ${dotAccent}66`,
                        }
                      : undefined
                  }
                  onClick={() => onSelect(index)}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-foreground/[0.08]">
          <div
            className="h-full rounded-full transition-[width] duration-150 ease-out"
            style={{
              width: `${Math.max(3, scrollProgress * 100)}%`,
              background: accentHex
                ? `linear-gradient(90deg, ${accentHex}cc, ${accentHex})`
                : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
