'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper } from '@/components/animations';
import { Timeline } from '@/components/about/Timeline';
import { MobileTimeline } from '@/components/about/MobileTimeline';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { useEffect, useState } from 'react';

export function AboutClient() {
  const t = useTranslations('about');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <FullscreenSection id="about" centerContent={false}>
      <AnimatedWrapper>
        {isMobile ? <MobileTimeline /> : <Timeline />}
      </AnimatedWrapper>
    </FullscreenSection>
  );
}
