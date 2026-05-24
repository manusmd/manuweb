export const SECTION_IDS = ['home', 'about', 'projects', 'blog', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];
