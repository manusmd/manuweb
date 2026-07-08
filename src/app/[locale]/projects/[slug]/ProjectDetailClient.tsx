'use client';

import { Project, ProjectTech } from '@/types/project';
import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Archive,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const t = useTranslations('projects');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [imageLoaded, setImageLoaded] = useState(false);

  const statusMessageKey =
    project.status === 'in-progress' ? 'inProgress' : (project.status ?? 'completed');

  const getStatusIcon = () => {
    switch (project.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'archived':
        return <Archive className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <AnimatedWrapper>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push(`/${locale}#projects`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToProjects')}
        </Button>

        <StaggerContainer className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={project.thumbnail || project.image || '/placeholder-project.jpg'}
              alt={project.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setImageLoaded(true)}
              priority
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <p className="text-xl text-muted-foreground">{project.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <Badge variant="outline">{t(`status.${statusMessageKey}`)}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: ProjectTech) => (
                <Badge key={tech.name} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {project.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.startDate)}</span>
                </div>
              )}
              {project.featured && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{t('featured')}</span>
                </div>
              )}
            </div>

            <p className="text-lg">{project.longDescription || project.description}</p>

            <div className="flex flex-wrap gap-4">
              {project.repository && (
                <Button asChild>
                  <Link href={project.repository} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t('viewGithub')}
                  </Link>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="outline">
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('viewLive')}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </StaggerContainer>

        {project.features && project.features.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">{t('features')}</h2>
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-6 transition-colors hover:bg-muted/50"
                >
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
}
