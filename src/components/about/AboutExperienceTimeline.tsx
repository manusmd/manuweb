'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ExperienceEntry } from '@/types/experience';
import { AboutExperienceCard } from '@/components/about/AboutExperienceCard';
import { AboutJobScene } from '@/components/about/AboutJobScene';
import { AboutJobsNav } from '@/components/about/AboutJobsNav';
import { AboutJobsParallaxBackdrop } from '@/components/about/AboutJobsParallaxBackdrop';
import { AboutJobsProgress } from '@/components/about/AboutJobsProgress';
import { scrollToAboutExperienceCard } from '@/components/about/aboutScroll';
import { useAboutJobsHorizontalScenesScroll } from '@/hooks/useAboutJobsHorizontalScenesScroll';
import { useAboutTimelineActiveStep } from '@/hooks/useAboutTimelineActiveStep';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MQ } from '@/constants/breakpoints';

interface AboutExperienceTimelineProps {
  experiences: ExperienceEntry[];
}

export function AboutExperienceTimeline({ experiences }: AboutExperienceTimelineProps) {
  const t = useTranslations('about');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MQ.desktop);
    setIsDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const pinTriggerRef = useRef<HTMLDivElement>(null);
  const pinOuterRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stackColumnRef = useRef<HTMLDivElement>(null);

  const useStackedLayout = reduceMotion || !isDesktop;
  const horizontalEnabled = experiences.length > 0 && !useStackedLayout;

  const { activeIndex, scrollProgress, scrollToIndex } = useAboutJobsHorizontalScenesScroll(
    pinTriggerRef,
    pinOuterRef,
    viewportRef,
    trackRef,
    experiences.length,
    horizontalEnabled
  );

  const stackedActive = useAboutTimelineActiveStep(
    stackColumnRef,
    useStackedLayout ? experiences.length : 0
  );

  const stackedHeader = (
    <div className="relative mb-8 max-w-2xl px-4 md:mb-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-[-3rem] h-48 w-72 rounded-full bg-gradient-to-tr from-primary/18 via-fuchsia-600/10 to-transparent blur-3xl" />
      <h2 className="font-display bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-[2.25rem] md:leading-[1.15]">
        {t('timeline.title')}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
        {t('timeline.subtitle')}
      </p>
    </div>
  );

  if (useStackedLayout) {
    return (
      <div className="relative mt-10 w-full lg:mt-14">
        {stackedHeader}
        <div className="flex flex-col gap-10 px-4 md:px-6 lg:px-8">
          <div ref={stackColumnRef} className="flex flex-col gap-10">
            {experiences.map((exp, index) => (
              <AboutExperienceCard
                key={`${exp.company}-${exp.date}-${String(index)}`}
                exp={exp}
                index={index}
                revealDelay={index * 0.08}
              />
            ))}
          </div>
          {reduceMotion && isDesktop ? (
            <AboutJobsNav
              experiences={experiences}
              activeIndex={stackedActive}
              mode="stacked"
              onSelect={scrollToAboutExperienceCard}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-6 w-full lg:mt-8">
      <div ref={pinTriggerRef} className="pointer-events-none h-px w-full" aria-hidden />
      <div ref={pinOuterRef} className="relative h-[100svh] min-h-[100svh] w-full">
        <div className="relative flex h-full w-screen max-w-none flex-col items-center justify-center overflow-x-hidden ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
          <AboutJobsParallaxBackdrop
            experiences={experiences}
            scrollProgress={scrollProgress}
            activeIndex={activeIndex}
          />

          <div className="relative z-10 flex w-full max-w-[min(1400px,94vw)] flex-col gap-3 px-4 md:gap-4 md:px-8">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/45">
              {t('timeline.title')}
            </p>
            <AboutJobsProgress
              experiences={experiences}
              activeIndex={activeIndex}
              scrollProgress={scrollProgress}
              onSelect={scrollToIndex}
            />

            <div
              ref={viewportRef}
              className="relative h-[min(72svh,680px)] overflow-hidden rounded-3xl border border-white/[0.08] bg-background/20 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] backdrop-blur-sm"
            >
              <div
                ref={trackRef}
                className="flex h-full items-stretch gap-4 py-4 pl-4 pr-6 md:gap-5 md:py-5 md:pl-5 md:pr-8"
              >
                {experiences.map((exp, index) => (
                  <AboutJobScene
                    key={`${exp.company}-${exp.date}-${String(index)}`}
                    exp={exp}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
