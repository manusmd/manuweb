import type { ExperienceEntry } from '@/types/experience';

export function experienceIsSecretProject(exp: { company: string; title?: string }): boolean {
  const c = exp.company.toLowerCase();
  const t = (exp.title ?? '').toLowerCase();
  return c.includes('secret') || c.includes('geheim') || t.includes('geheim');
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
