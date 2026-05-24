'use client';

import { useTranslations } from 'next-intl';
import { resolveTimelineMobileAccent } from '@/components/about/timeline.constants';
import type { ExperienceEntry } from '@/types/experience';

export function MobileTimeline() {
  const t = useTranslations('about');
  const experiences = t.raw('experience') as ExperienceEntry[];

  return (
    <div className="w-full min-h-screen bg-background px-2 py-8">
      <div className="flex flex-col gap-8">
        {experiences.map((exp, i) => {
          const accent = resolveTimelineMobileAccent(exp.company);
          return (
            <div
              key={`${exp.company}-${exp.date}-${String(i)}`}
              className="w-full relative flex bg-zinc-900/90 rounded-2xl shadow-lg border border-zinc-800 px-6 py-7 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
            >
              <div
                className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full"
                style={{ background: accent, opacity: 0.8 }}
              />
              <div className="pl-5 flex-1 flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-400 tracking-wide">
                  {exp.date}
                </span>
                <h3 className="text-xl font-extrabold text-white">{exp.title}</h3>
                <p className="text-base font-semibold" style={{ color: accent }}>
                  {exp.company}
                </p>
                <p className="text-sm text-zinc-300">{exp.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
