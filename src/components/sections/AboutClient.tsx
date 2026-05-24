'use client';

import { Timeline } from '@/components/about/Timeline';
import { MobileTimeline } from '@/components/about/MobileTimeline';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { useEffect, useState } from 'react';

export function AboutClient() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isClient) {
    return (
      <FullscreenSection id="about" centerContent={false} overflow="visible">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </FullscreenSection>
    );
  }

  const shouldUseMobileTimeline = screenSize === 'mobile' || screenSize === 'tablet';

  return (
    <FullscreenSection id="about" centerContent={false} overflow="visible">
      {shouldUseMobileTimeline ? <MobileTimeline /> : <Timeline />}
    </FullscreenSection>
  );
}
