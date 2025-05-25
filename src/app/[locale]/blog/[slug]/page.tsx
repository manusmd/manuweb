import { getMDXContent } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/blog/BlogLayout';
import { MDXContent } from '@/components/MDXContent';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ReadingTime } from '@/components/blog/ReadingTime';
import { SocialShare } from '@/components/blog/SocialShare';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export const dynamic = 'force-dynamic';

// Function to get tag colors
function getTagColor(tag: string) {
  const tagColors: Record<string, string> = {
    // English tags
    ai: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    coding:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    llm: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    programming:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    automation:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',

    // German tags
    ki: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    programmierung:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    automatisierung:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  };

  return (
    tagColors[tag.toLowerCase()] ||
    'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700'
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;

  try {
    const { frontMatter, content } = await getMDXContent(slug, locale);
    const t = await getTranslations({ locale, namespace: 'blog.articleFooter' });

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const currentUrl = `${protocol}://${host}/${locale}/blog/${slug}`;

    return (
      <>
        {/* Floating Table of Contents */}
        <TableOfContents />

        <BlogLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Main Content - Full width */}
              <article>
                <header className="mb-8">
                  <h1 className="text-4xl font-display font-bold mb-4 text-foreground">
                    {frontMatter.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                    <time className="text-sm">
                      {new Date(frontMatter.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>

                    <ReadingTime content={content} />

                    <div className="flex gap-2">
                      {frontMatter.tags?.map(tag => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${getTagColor(
                            tag
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="border-t border-b border-border py-4">
                    <SocialShare title={frontMatter.title} url={currentUrl} />
                  </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <MDXContent source={content} />
                </div>

                {/* Footer with Social Share */}
                <footer className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('enjoyedTitle')}</h3>
                      <p className="text-sm text-muted-foreground">{t('enjoyedDescription')}</p>
                    </div>
                    <SocialShare title={frontMatter.title} url={currentUrl} />
                  </div>
                </footer>

                {/* Related Posts */}
                <RelatedPosts currentSlug={slug} locale={locale} tags={frontMatter.tags} />
              </article>
            </div>
          </div>
        </BlogLayout>
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
