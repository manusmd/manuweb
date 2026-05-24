'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AboutIntro } from '@/components/about/AboutIntro';
import { AboutExperienceTimeline } from '@/components/about/AboutExperienceTimeline';
import { useAboutParallax } from '@/hooks/useAboutParallax';
import type { ExperienceEntry } from '@/types/experience';

export function AboutSection() {
  const parallaxRootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('about');
  useAboutParallax(parallaxRootRef, true);

  const experiences = t.raw('experience') as ExperienceEntry[];

  return (
    <div className="relative w-full overflow-x-hidden pb-24 pt-8 lg:pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-purple-950/20 via-transparent to-transparent" />
      <div ref={parallaxRootRef} className="relative px-4 md:px-6 lg:px-8">
        <AboutIntro title={t('title')} subtitle={t('subtitle')} />
      </div>
      <AboutExperienceTimeline experiences={experiences} />
    </div>
  );
}
