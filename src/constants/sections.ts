import { PROJECTS_SECTION_ENABLED } from '@/constants/features';

const SECTION_IDS_WITH_PROJECTS = ['home', 'about', 'projects', 'blog', 'contact'] as const;
const SECTION_IDS_WITHOUT_PROJECTS = ['home', 'about', 'blog', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS_WITH_PROJECTS)[number];

export const SECTION_IDS: readonly SectionId[] = PROJECTS_SECTION_ENABLED
  ? SECTION_IDS_WITH_PROJECTS
  : SECTION_IDS_WITHOUT_PROJECTS;
