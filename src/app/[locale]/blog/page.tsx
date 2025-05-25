import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import { BlogTransition } from '@/components/transitions/BlogTransition';
import { BackButton } from '@/components/blog/BackButton';
import { BlogListingClient } from '@/components/blog/BlogListingClient';

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const t = await getTranslations('blog');

  return (
    <BlogTransition>
      <div className="bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-4">
          <BackButton locale={locale} showOnBlogListing={true} />

          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold mb-4 text-foreground">{t('title')}</h1>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
          </div>

          {/* Posts Grid with Client-side filtering */}
          <BlogListingClient posts={posts} locale={locale} />
        </div>
      </div>
    </BlogTransition>
  );
}
