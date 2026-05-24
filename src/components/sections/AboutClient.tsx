'use client';

import { useEffect, useState } from 'react';
import { Timeline } from '@/components/about/Timeline';
import { MobileTimeline } from '@/components/about/MobileTimeline';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { MQ } from '@/constants/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';

export function AboutClient() {
  const tc = useTranslations('common');
  const [isClient, setIsClient] = useState(false);
  const shouldUseMobileTimeline = useMediaQuery(MQ.tabletDown);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <FullscreenSection id="about" centerContent={false} overflow="visible">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">{tc('loading')}</div>
        </div>
      </FullscreenSection>
    );
  }

  return (
    <FullscreenSection id="about" centerContent={false} overflow="visible">
      {shouldUseMobileTimeline ? <MobileTimeline /> : <Timeline />}
    </FullscreenSection>
  );
}
