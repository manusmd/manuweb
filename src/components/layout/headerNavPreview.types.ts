import type { Project } from '@/types/project';

/** Lean shape for a blog post preview in the header's "Blog" hover card. */
export interface HeaderPostPreview {
  slug: string;
  title: string;
  date: string;
}

export type HeaderFeaturedProject = Project | null;
