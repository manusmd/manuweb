import type { ExperienceEntry } from '@/types/experience';

export type TimelineDesktopTheme = {
  background: string;
  textColor: string;
  accentColor: string;
  cardBg: string;
  icon: string;
  pattern?: string;
  visualElement: string;
  borderColor: string;
};

export const TIMELINE_DESKTOP_THEMES: Record<string, TimelineDesktopTheme> = {
  SecretProject: {
    background: 'bg-gradient-to-br from-slate-950 via-violet-950/90 to-slate-900',
    textColor: 'text-slate-100',
    accentColor: 'text-violet-300',
    cardBg: 'bg-violet-950/40 border-violet-500/25',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(ellipse_at_70%_30%,rgba(139,92,246,0.22),transparent_55%)]',
    visualElement: 'secret',
    borderColor: 'border-violet-400/40',
  },
  Syndikat7: {
    background: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
    textColor: 'text-gray-100',
    accentColor: 'text-red-400',
    cardBg: 'bg-gray-800/50 border-gray-700',
    icon: '',
    pattern: 'opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]',
    visualElement: 'matrix',
    borderColor: 'border-gray-700',
  },
  'T-Systems': {
    background: 'bg-gradient-to-br from-pink-900 via-purple-900 to-magenta-800',
    textColor: 'text-pink-100',
    accentColor: 'text-magenta-300',
    cardBg: 'bg-pink-800/30 border-magenta-500/30',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_30%_70%,rgba(255,0,255,0.2),transparent_50%)]',
    visualElement: 'tech',
    borderColor: 'border-magenta-400/50',
  },
  PRGH: {
    background: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-800',
    textColor: 'text-purple-100',
    accentColor: 'text-violet-300',
    cardBg: 'bg-purple-800/30 border-violet-500/30',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.3),transparent_50%)]',
    visualElement: 'medical',
    borderColor: 'border-violet-400/50',
  },
  'Neue Fische': {
    background: 'bg-gradient-to-br from-orange-800 via-orange-900 to-red-900',
    textColor: 'text-orange-50',
    accentColor: 'text-orange-300',
    cardBg: 'bg-orange-700/40 border-orange-400/40',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(255,165,0,0.4),transparent_50%)]',
    visualElement: 'education',
    borderColor: 'border-orange-400/60',
  },
};

export const TIMELINE_MOBILE_THEME_ACCENTS: Record<string, string> = {
  SecretProject: '#a78bfa',
  Syndikat7: '#f87171',
  'T-Systems': '#f472b6',
  PRGH: '#a78bfa',
  'Neue Fische': '#fdba74',
};

export const DEFAULT_MOBILE_THEME_ACCENT = '#a78bfa';

export function experienceIsSecretProject(exp: { company: string; title?: string }): boolean {
  const c = exp.company.toLowerCase();
  const t = (exp.title ?? '').toLowerCase();
  return c.includes('secret') || c.includes('geheim') || t.includes('geheim');
}

export function resolveTimelineDesktopTheme(company: string): TimelineDesktopTheme {
  const lc = company.toLowerCase();
  if (lc.includes('secret') || lc.includes('geheim')) {
    return TIMELINE_DESKTOP_THEMES.SecretProject;
  }
  const key = Object.keys(TIMELINE_DESKTOP_THEMES).find(k => lc.includes(k.toLowerCase()));
  return key ? TIMELINE_DESKTOP_THEMES[key] : TIMELINE_DESKTOP_THEMES['T-Systems'];
}

export function resolveTimelineMobileAccent(company: string): string {
  const lc = company.toLowerCase();
  if (lc.includes('secret') || lc.includes('geheim')) {
    return TIMELINE_MOBILE_THEME_ACCENTS.SecretProject;
  }
  const key = Object.keys(TIMELINE_MOBILE_THEME_ACCENTS).find(k => lc.includes(k.toLowerCase()));
  return key ? TIMELINE_MOBILE_THEME_ACCENTS[key] : DEFAULT_MOBILE_THEME_ACCENT;
}

export function getExperienceHighlights(exp: ExperienceEntry): string[] {
  if (experienceIsSecretProject(exp)) return [];
  if (exp.highlights?.length) return exp.highlights;
  if (exp.description) return [exp.description];
  return [];
}

export function getExperienceSkills(exp: ExperienceEntry): string[] {
  if (experienceIsSecretProject(exp)) return [];
  return exp.skills ?? [];
}

export function getExperienceLocation(exp: ExperienceEntry): string | undefined {
  if (experienceIsSecretProject(exp)) return undefined;
  return exp.location;
}
