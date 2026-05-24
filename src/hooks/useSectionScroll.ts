'use client';

import { useEffect, useState } from 'react';
import { ACTIVE_SECTION_SCROLL_OFFSET_PX, SHOW_BACK_TO_TOP_SCROLL_PX } from '@/constants/scroll';
import { SECTION_IDS, type SectionId } from '@/constants/sections';

export type SectionTrackingAlgorithm = 'midpoint' | 'headerContainment';

export function useActiveHomeSection(enabled: boolean, algorithm: SectionTrackingAlgorithm) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeId, setActiveId] = useState<SectionId>(SECTION_IDS[0]);

  useEffect(() => {
    if (!enabled) return;

    const sync = () => {
      if (algorithm === 'midpoint') {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
          const id = SECTION_IDS[i];
          const element = document.getElementById(id);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveIndex(i);
            setActiveId(id);
            break;
          }
        }
      } else {
        const scrollPosition = window.scrollY + ACTIVE_SECTION_SCROLL_OFFSET_PX;

        for (let i = 0; i < SECTION_IDS.length; i++) {
          const id = SECTION_IDS[i];
          const element = document.getElementById(id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveId(id);
              setActiveIndex(i);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    sync();
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [enabled, algorithm]);

  return { activeIndex, activeId };
}

export function useBackToTopVisible(enabled: boolean, thresholdPx = SHOW_BACK_TO_TOP_SCROLL_PX) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const toggle = () => {
      setVisible(window.pageYOffset > thresholdPx);
    };

    window.addEventListener('scroll', toggle);
    toggle();
    return () => window.removeEventListener('scroll', toggle);
  }, [enabled, thresholdPx]);

  return visible;
}
