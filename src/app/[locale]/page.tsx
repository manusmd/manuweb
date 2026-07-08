import { HeroSection } from '@/components/sections/HeroSection';
import { BlogPreview } from '@/components/blog/BlogPreview';
import { HashScrollHandler } from '@/components/scroll/HashScrollHandler';
import { PROJECTS_SECTION_ENABLED } from '@/constants/features';
import dynamic from 'next/dynamic';

// Below-the-fold sections are code-split but SSR-rendered, so their content
// streams into the initial HTML. Using a spinner as the Suspense fallback made
// it flash on screen (visible whenever the hero loading screen isn't covering,
// e.g. client-side navigation to home), so render nothing until content resolves.
const AboutClient = dynamic(
  () => import('@/components/sections/AboutClient').then(mod => ({ default: mod.AboutClient })),
  { loading: () => null }
);

const ProjectsSection = dynamic(
  () =>
    import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })),
  { loading: () => null }
);

const ContactSection = dynamic(
  () =>
    import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })),
  { loading: () => null }
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
