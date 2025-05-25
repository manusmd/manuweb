export interface ProjectTech {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'cloud' | 'testing';
  icon?: string;
}

export interface ProjectLink {
  type: 'live' | 'github' | 'npm' | 'docs' | 'figma' | 'other';
  url: string;
  label: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface Project {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  excerpt?: string;
  image?: string;
  thumbnail?: string;
  images?: ProjectImage[];
  liveUrl?: string;
  githubUrl?: string;
  repository?: string;
  tech?: string[];
  technologies?: ProjectTech[];
  category: 'frontend' | 'fullstack' | 'mobile' | 'library' | 'tool';
  status?: 'completed' | 'in-progress' | 'archived';
  featured?: boolean;
  priority?: number;
  isApp?: boolean;
  slug?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  lastUpdated?: string;
  features?: ProjectFeature[];
  challenges?: string[];
  learnings?: string[];
  links?: ProjectLink[];
}
