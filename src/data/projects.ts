import type { Project } from '@/types/project';

export const CLUB_SCAN_SLUG = 'clubscan';

const clubscanBase: Omit<Project, 'title' | 'subtitle' | 'description' | 'longDescription'> = {
  id: 'clubscan',
  slug: CLUB_SCAN_SLUG,
  image: '/clubscandashboard.png',
  thumbnail: '/clubscandashboard.png',
  liveUrl: 'https://www.clubscan.app',
  category: 'fullstack',
  status: 'completed',
  featured: true,
  priority: 1,
  isApp: true,
  tags: ['Next.js', 'TypeScript', 'PWA', 'Offline'],
  tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PWA', 'Offline-First'],
  technologies: [
    { name: 'Next.js', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'PWA', category: 'frontend' },
  ],
  startDate: '2024-01-01',
  lastUpdated: '2025-05-01',
};

export type ClubscanCopy = {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
};

export function buildClubscanProject(copy: ClubscanCopy): Project {
  return {
    ...clubscanBase,
    ...copy,
  };
}

export function getProjectSlugs(): string[] {
  return [CLUB_SCAN_SLUG];
}
