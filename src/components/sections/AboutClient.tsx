'use client';

import { AnimatedWrapper } from '@/components/animations';
import { Timeline } from '@/components/about/Timeline';
import { MobileTimeline } from '@/components/about/MobileTimeline';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { useEffect, useState } from 'react';

export function AboutClient() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <FullscreenSection id="about" centerContent={false}>
      <AnimatedWrapper>{isMobile ? <MobileTimeline /> : <Timeline />}</AnimatedWrapper>
    </FullscreenSection>
  );
}
