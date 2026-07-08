'use client';

import { useTranslations } from 'next-intl';
import type { ExperienceEntry } from '@/types/experience';
import { AboutExperienceCard } from '@/components/about/AboutExperienceCard';
import { SectionHeader } from '@/components/layout/SectionHeader';

interface AboutExperienceTimelineProps {
  experiences: ExperienceEntry[];
}

export function AboutExperienceTimeline({ experiences }: AboutExperienceTimelineProps) {
  const t = useTranslations('about');

  return (
    <div className="relative mt-16 w-full px-4 md:mt-20 md:px-6 lg:px-8">
      <SectionHeader
        title={t('timeline.title')}
        description={t('timeline.subtitle')}
        className="mb-10 md:mb-14"
      />
      <div className="relative flex flex-col gap-6">
        <span className="pointer-events-none absolute bottom-2 left-[5px] top-2 w-px bg-border" />
        {experiences.map((exp, index) => (
          <AboutExperienceCard
            key={`${exp.company}-${exp.date}-${String(index)}`}
            exp={exp}
            revealDelay={index * 0.06}
          />
        ))}
      </div>
    </div>
  );
}
