import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { Layout } from '@/components/layout/Layout';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { getAllPosts } from '@/lib/mdx';
import { resolveProject } from '@/lib/resolveProject';
import { APPLYX_SLUG } from '@/data/projects';
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
  const [posts, featuredProject] = await Promise.all([
    getAllPosts(locale),
    resolveProject(locale, APPLYX_SLUG),
  ]);
  const latestPosts = posts.slice(0, 2).map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
  }));

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Layout latestPosts={latestPosts} featuredProject={featuredProject}>
        {children}
        <PerformanceMonitor />
      </Layout>
    </NextIntlClientProvider>
  );
}
