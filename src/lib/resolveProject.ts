import { getTranslations } from 'next-intl/server';
import { buildClubscanProject, CLUB_SCAN_SLUG } from '@/data/projects';
import type { Project } from '@/types/project';

export async function resolveProject(locale: string, slug: string): Promise<Project | null> {
  if (slug !== CLUB_SCAN_SLUG) {
    return null;
  }

  const t = await getTranslations({
    locale,
    namespace: 'projects.clubscan',
  });

  return buildClubscanProject({
    title: t('title'),
    subtitle: t('subtitle'),
    description: t('description'),
    longDescription: t('longDescription'),
  });
}
