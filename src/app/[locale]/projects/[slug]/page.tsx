import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/data/projects';
import { ProjectDetailClient } from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map(project => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
