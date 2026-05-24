'use client';

import { AboutSection } from '@/components/about/AboutSection';
import { FullscreenSection } from '@/components/layout/FullscreenSection';

export function AboutClient() {
  return (
    <FullscreenSection id="about" centerContent={false} overflow="visible">
      <AboutSection />
    </FullscreenSection>
  );
}
