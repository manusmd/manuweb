import { notFound } from 'next/navigation';
import {
  getProjectSlugs,
  APPLYX_SLUG,
  FINGERMATCH_SLUG,
  PITCHLAB_SLUG,
  AFTERHIVE_SLUG,
} from '@/data/projects';
import { resolveProject } from '@/lib/resolveProject';
import { ProjectDetailClient } from './ProjectDetailClient';
import { ApplyxDetail } from '@/components/projects/applyx/ApplyxDetail';
import { FingermatchDetail } from '@/components/projects/fingermatch/FingermatchDetail';
import { PitchlabDetail } from '@/components/projects/pitchlab/PitchlabDetail';
import { AfterhiveDetail } from '@/components/projects/afterhive/AfterhiveDetail';

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params;
  const project = await resolveProject(locale, slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Manuel Schmid`,
    description: project.description,
    keywords: project.tags?.join(', ') || '',
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.thumbnail || project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params;
  const project = await resolveProject(locale, slug);

  if (!project) {
    notFound();
  }

  if (slug === APPLYX_SLUG) {
    return <ApplyxDetail project={project} locale={locale} />;
  }

  if (slug === FINGERMATCH_SLUG) {
    return <FingermatchDetail project={project} locale={locale} />;
  }

  if (slug === PITCHLAB_SLUG) {
    return <PitchlabDetail project={project} locale={locale} />;
  }

  if (slug === AFTERHIVE_SLUG) {
    return <AfterhiveDetail project={project} locale={locale} />;
  }

  return <ProjectDetailClient project={project} />;
}
