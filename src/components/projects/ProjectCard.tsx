'use client';

import { Project } from '@/types/project';
import { AnimatedCard } from '@/components/animations/AnimatedCard';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  delay?: number;
  featured?: boolean;
}

export function ProjectCard({ project, delay = 0, featured = false }: ProjectCardProps) {
  const t = useTranslations('projects');

  const getCategoryColor = (category: Project['category']) => {
    const colors = {
      frontend: 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
      fullstack: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10',
      mobile: 'text-accent-green border-accent-green/30 bg-accent-green/10',
      library: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
      tool: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
    };
    return colors[category] || colors.frontend;
  };

  return (
    <AnimatedCard
      delay={delay}
      animation="fadeInUp"
      className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 ${
        featured ? 'lg:col-span-2' : ''
      }`}
      enableHover
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || project.thumbnail || '/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
          priority={featured}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              aria-label={t('viewLiveAria')}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              aria-label={t('viewSourceAria')}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <Badge variant="outline" className={getCategoryColor(project.category)}>
            {t(`categories.${project.category}`)}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">{t('techStack')}</h4>
          <div className="flex flex-wrap gap-1">
            {(project.tech || project.technologies?.map(t => t.name) || [])
              .slice(0, featured ? 8 : 6)
              .map(tech => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            {(project.tech || project.technologies?.map(t => t.name) || []).length >
              (featured ? 8 : 6) && (
              <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted/50">
                +
                {(project.tech || project.technologies?.map(t => t.name) || []).length -
                  (featured ? 8 : 6)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              {project.isApp ? t('viewApp') : t('liveDemo')}
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors text-sm font-medium"
            >
              {t('viewCode')}
            </a>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
}
