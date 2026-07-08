import { getTranslations } from 'next-intl/server';
import { buildApplyxProject, APPLYX_SLUG } from '@/data/projects';
import type { Project } from '@/types/project';

export async function resolveProject(locale: string, slug: string): Promise<Project | null> {
  if (slug !== APPLYX_SLUG) {
    return null;
  }

  const t = await getTranslations({
    locale,
    namespace: 'projects.applyx',
  });

  return buildApplyxProject({
    title: t('title'),
    subtitle: t('subtitle'),
    description: t('description'),
    longDescription: t('longDescription'),
  });
}
