import type { Project } from '@/types/project';

export const APPLYX_SLUG = 'applyx';

const applyxBase: Omit<Project, 'title' | 'subtitle' | 'description' | 'longDescription'> = {
  id: 'applyx',
  slug: APPLYX_SLUG,
  image: '/applyxdashboard.png',
  thumbnail: '/applyxdashboard.png',
  liveUrl: 'https://applyx.projects.manu-web.de',
  githubUrl: 'https://github.com/manusmd/applyx',
  repository: 'https://github.com/manusmd/applyx',
  category: 'fullstack',
  status: 'completed',
  featured: true,
  priority: 1,
  isApp: true,
  tags: ['TypeScript', 'React', 'Fastify', 'PostgreSQL', 'Ollama'],
  tech: ['TypeScript', 'React', 'Fastify', 'PostgreSQL', 'Ollama', 'IMAP'],
  technologies: [
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Fastify', category: 'backend' },
    { name: 'PostgreSQL', category: 'database' },
    { name: 'Ollama', category: 'tools' },
  ],
  startDate: '2026-06-01',
  lastUpdated: '2026-07-01',
};

export type ApplyxCopy = {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
};

export function buildApplyxProject(copy: ApplyxCopy): Project {
  return {
    ...applyxBase,
    ...copy,
  };
}

export function getProjectSlugs(): string[] {
  return [APPLYX_SLUG];
}
