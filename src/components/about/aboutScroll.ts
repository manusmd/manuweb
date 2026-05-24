'use client';

import { NAV_SCROLL_OFFSET_PX } from '@/constants/scroll';

export function getAboutExperienceAnchorId(index: number): string {
  return `about-exp-${index}`;
}

export function scrollToAboutExperienceCard(index: number): void {
  const id = getAboutExperienceAnchorId(index);
  const el = document.getElementById(id);
  if (!el || typeof window === 'undefined') return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET_PX;
  window.scrollTo({ top, behavior: 'smooth' });
}
