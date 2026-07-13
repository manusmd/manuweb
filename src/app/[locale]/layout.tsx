import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Layout } from '@/components/layout/Layout';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { getAllPosts } from '@/lib/mdx';
import { resolveProject } from '@/lib/resolveProject';
import { getProjectSlugs } from '@/data/projects';
import 'lenis/dist/lenis.css';
import '../globals.css';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as 'de' | 'en')) {
    notFound();
  }

  const messages = await getMessages({ locale });

  // Lean preview data for the header's nav hover cards — fetched once here
  // (server-side) rather than per-render on the client.
  const [posts, resolvedProjects] = await Promise.all([
    getAllPosts(locale),
    Promise.all(getProjectSlugs().map(slug => resolveProject(locale, slug))),
  ]);

  // Blog cover: frontmatter coverImage, else the first inline markdown image.
  const firstImage = (content: string) => content.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];
  const latestPosts = posts.slice(0, 4).map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    image: post.coverImage ?? firstImage(post.content),
  }));

  const projects = resolvedProjects
    .filter((p): p is NonNullable<typeof p> => p !== null && !!p.slug)
    .map(p => ({
      slug: p.slug as string,
      title: p.title,
      subtitle: p.subtitle,
      image: p.thumbnail || p.image,
    }));

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Layout latestPosts={latestPosts} projects={projects}>
        {children}
        <PerformanceMonitor />
      </Layout>
    </NextIntlClientProvider>
  );
}
