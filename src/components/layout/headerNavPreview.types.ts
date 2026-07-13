/** Lean shape for a blog post preview in the header's "Blog" hover card. */
export interface HeaderPostPreview {
  slug: string;
  title: string;
  date: string;
  image?: string;
}

/** Lean shape for a project preview in the header's "Projects" hover card. */
export interface HeaderProjectPreview {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;
}
