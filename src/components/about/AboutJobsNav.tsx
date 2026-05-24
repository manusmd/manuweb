'use client';

import { cn } from '@/lib/utils';
import type { ExperienceEntry } from '@/types/experience';

function shortCompany(company: string): string {
  const main = company.split(/[—–]/)[0]?.split(',')[0]?.trim() ?? company;
  if (main.length <= 22) return main;
  return `${main.slice(0, 20)}…`;
}

type AboutJobsNavProps = {
  experiences: ExperienceEntry[];
  activeIndex: number;
  mode: 'horizontal' | 'stacked';
  onSelect: (index: number) => void;
  className?: string;
};

export function AboutJobsNav({
  experiences,
  activeIndex,
  mode,
  onSelect,
  className,
}: AboutJobsNavProps) {
  return (
    <nav
      aria-label="Jobs"
      className={cn(
        mode === 'horizontal'
          ? 'pointer-events-none absolute bottom-0 left-0 right-0 z-30 flex justify-center px-3 pb-6 pt-10 md:pb-8'
          : 'mt-10 flex flex-wrap justify-center gap-2',
        className
      )}
    >
      <div
        className={cn(
          'flex max-w-[min(100vw-1.5rem,42rem)] gap-1.5 overflow-x-auto rounded-full border border-border/50 bg-background/80 p-2 shadow-lg backdrop-blur-xl',
          mode === 'horizontal' && 'pointer-events-auto'
        )}
      >
        {experiences.map((exp, index) => {
          const active = activeIndex === index;
          return (
            <button
              key={`${exp.company}-${exp.date}-${String(index)}`}
              type="button"
              aria-current={active ? 'step' : undefined}
              className={cn(
                'shrink-0 rounded-full px-3 py-2 text-left text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:text-xs',
                active
                  ? 'bg-gradient-to-br from-primary via-fuchsia-600 to-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
              onClick={() => onSelect(index)}
            >
              <span className="block max-w-[11rem] truncate">{shortCompany(exp.company)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
