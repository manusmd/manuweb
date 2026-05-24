'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { TimelineIntroPanel } from '@/components/about/TimelineIntroPanel';
import { TimelineExperiencePanel } from '@/components/about/TimelineExperiencePanel';
import { TimelineBottomNav } from '@/components/about/TimelineBottomNav';
import { resolveTimelineDesktopTheme } from '@/components/about/timeline.constants';
import type { ExperienceEntry } from '@/types/experience';
import {
  timelineAnimateToPanel,
  useTimelineGsapReady,
  useTimelinePinnedHorizontalScroll,
} from '@/hooks/useTimelineScroll';

export function Timeline() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const gsapReady = useTimelineGsapReady();
  const [isInView, setIsInView] = useState(false);

  const experiences = t.raw('experience') as ExperienceEntry[];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isClient]);

  useTimelinePinnedHorizontalScroll(
    containerRef,
    horizontalRef,
    isClient,
    gsapReady,
    experiences.length,
    setCurrentPanel
  );

  const navigateToPanel = (panelIndex: number) => {
    timelineAnimateToPanel(panelIndex, horizontalRef.current);
    setCurrentPanel(panelIndex);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={horizontalRef}
          className="flex"
          style={{
            height: '100vh',
            width: 'fit-content',
          }}
        >
          <TimelineIntroPanel title={t('title')} subtitle={t('subtitle')} />

          {experiences.map((exp, index) => (
            <TimelineExperiencePanel
              key={`${exp.company}-${exp.date}-${String(index)}`}
              exp={exp}
              theme={resolveTimelineDesktopTheme(exp.company)}
            />
          ))}
        </div>
      </div>

      <TimelineBottomNav
        visible={isInView}
        currentPanel={currentPanel}
        experiences={experiences}
        onNavigatePanel={navigateToPanel}
      />
    </>
  );
}
