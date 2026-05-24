'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SECTION_IDS, type SectionId } from '@/constants/sections';

type SectionScrollNavProps = {
  activeIndex: number;
  getLabel: (sectionId: SectionId) => string;
  getAriaLabel: (sectionId: SectionId) => string;
};

export function SectionScrollNav({ activeIndex, getLabel, getAriaLabel }: SectionScrollNavProps) {
  return (
    <nav
      className="rounded-full border border-white/12 bg-background/72 px-2 py-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
      aria-label="Page sections"
    >
      <ul className="flex flex-col items-center gap-3">
        {SECTION_IDS.map((sectionId, index) => {
          const isReached = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const label = getLabel(sectionId);

          return (
            <li key={sectionId}>
              <motion.button
                type="button"
                onClick={() => {
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative flex h-6 w-6 items-center justify-center"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                aria-label={getAriaLabel(sectionId)}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    isReached
                      ? 'bg-gradient-to-r from-blue-400 to-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.55),0_0_0_1px_rgba(255,255,255,0.35)]'
                      : 'border border-white/85 bg-black/30 shadow-[0_0_0_1px_rgba(0,0,0,0.65),0_1px_3px_rgba(0,0,0,0.35)]'
                  )}
                  style={{
                    width: isCurrent ? 18 : 8,
                    height: 8,
                  }}
                />

                <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-background/92 px-3 py-2 text-sm font-medium text-foreground opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {label}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
