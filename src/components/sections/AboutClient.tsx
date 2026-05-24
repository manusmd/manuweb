'use client';

import { useEffect, useState } from 'react';
import { AboutSection } from '@/components/about/AboutSection';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { useTranslations } from 'next-intl';

export function AboutClient() {
  const tc = useTranslations('common');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <FullscreenSection id="about" centerContent={false} overflow="visible">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="animate-pulse text-muted-foreground">{tc('loading')}</div>
        </div>
      </FullscreenSection>
    );
  }

  return (
    <FullscreenSection id="about" centerContent={false} overflow="visible">
      <AboutSection />
    </FullscreenSection>
  );
}
