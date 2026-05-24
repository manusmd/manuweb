'use client';

import { NAV_SCROLL_OFFSET_PX } from '@/constants/scroll';
import { resolveTimelineMobileAccent } from '@/components/about/timeline.constants';
import type { ExperienceEntry } from '@/types/experience';

export const ABOUT_JOBS_PIN_START_OFFSET_PX = NAV_SCROLL_OFFSET_PX - 24;

function parseHex(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [232, 234, 237];
  return [Number.parseInt(m[1], 16), Number.parseInt(m[2], 16), Number.parseInt(m[3], 16)];
}

export function lerpHexColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t);
  const r = mix(r1, r2);
  const g = mix(g1, g2);
  const bl = mix(b1, b2);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function getBlendedJobAccent(
  experiences: ExperienceEntry[],
  scrollProgress: number
): string {
  const count = experiences.length;
  if (count <= 1) {
    return resolveTimelineMobileAccent(experiences[0]?.company ?? '');
  }
  const focused = scrollProgress * (count - 1);
  const i0 = Math.min(Math.floor(focused), count - 1);
  const i1 = Math.min(i0 + 1, count - 1);
  const t = focused - i0;
  const a0 = resolveTimelineMobileAccent(experiences[i0].company);
  const a1 = resolveTimelineMobileAccent(experiences[i1].company);
  return lerpHexColor(a0, a1, t);
}

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

export function getJobFocusWeight(
  index: number,
  scrollProgress: number,
  itemCount: number
): number {
  if (itemCount <= 1) return 1;
  const focused = scrollProgress * (itemCount - 1);
  return Math.max(0, 1 - Math.abs(focused - index));
}
