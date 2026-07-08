import { HeroSection } from '@/components/sections/HeroSection';
import { BlogPreview } from '@/components/blog/BlogPreview';
import { HashScrollHandler } from '@/components/scroll/HashScrollHandler';
import { PROJECTS_SECTION_ENABLED } from '@/constants/features';
import dynamic from 'next/dynamic';

// Lazy load below-the-fold sections for better performance
const AboutClient = dynamic(
  () => import('@/components/sections/AboutClient').then(mod => ({ default: mod.AboutClient })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

const ProjectsSection = dynamic(
  () =>
    import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })),
  { loading: () => null }
);

const ContactSection = dynamic(
  () =>
    import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  }
);

interface HomeProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;

  return (
    <main className="overflow-x-hidden">
      <HashScrollHandler />
      <HeroSection />
      <AboutClient />
      {PROJECTS_SECTION_ENABLED ? <ProjectsSection /> : null}
      <BlogPreview locale={locale} />
      <ContactSection />
    </main>
  );
}
