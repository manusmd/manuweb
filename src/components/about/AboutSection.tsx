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
    <div className="relative w-full overflow-x-hidden px-4 pb-24 pt-8 md:px-6 lg:px-8 lg:pb-28">
      <AboutIntro ref={parallaxRootRef} title={t('title')} subtitle={t('subtitle')} />
      <AboutExperienceTimeline experiences={experiences} />
    </div>
  );
}
