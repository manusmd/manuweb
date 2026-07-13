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

export const FINGERMATCH_SLUG = 'fingermatch';

const fingermatchBase: Omit<Project, 'title' | 'subtitle' | 'description' | 'longDescription'> = {
  id: 'fingermatch',
  slug: FINGERMATCH_SLUG,
  image: '/projects/fingermatch/card.png',
  thumbnail: '/projects/fingermatch/card.png',
  liveUrl: 'https://fingermatch.projects.manu-web.de',
  githubUrl: 'https://github.com/manusmd/fingermatch',
  repository: 'https://github.com/manusmd/fingermatch',
  category: 'fullstack',
  status: 'completed',
  featured: true,
  priority: 2,
  isApp: true,
  tags: ['Python', 'FastAPI', 'OpenCV', 'React', 'TypeScript'],
  tech: ['Python', 'FastAPI', 'OpenCV', 'scikit-image', 'React', 'TypeScript'],
  technologies: [
    { name: 'Python', category: 'backend' },
    { name: 'FastAPI', category: 'backend' },
    { name: 'OpenCV', category: 'tools' },
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
  ],
  startDate: '2026-06-15',
  lastUpdated: '2026-07-10',
};

export type ProjectCopy = {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
};

export function buildFingermatchProject(copy: ProjectCopy): Project {
  return {
    ...fingermatchBase,
    ...copy,
  };
}

export function getProjectSlugs(): string[] {
  return [APPLYX_SLUG, FINGERMATCH_SLUG];
}
