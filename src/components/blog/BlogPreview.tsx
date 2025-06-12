import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import { BlogLink } from '@/components/transitions/BlogLink';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { FullscreenSection } from '@/components/layout/FullscreenSection';

interface BlogPreviewProps {
  locale: string;
}

// Function to get tag colors (same as in blog post page)
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

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function BlogPreview({ locale }: BlogPreviewProps) {
  const t = await getTranslations('blog');
  const posts = await getAllPosts(locale);
  const latestPosts = posts.slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <FullscreenSection id="blog" className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/50"></div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Enhanced Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              {t('latestArticles')}
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              {t('title')}
            </h2>

            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full"></div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Enhanced Blog Cards Grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12 md:mb-16">
          {latestPosts.map((post, index) => (
            <BlogLink
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block"
              title={post.title}
            >
              <article className="h-full bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative">
                {/* Card number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold z-10">
                  {index + 1}
                </div>

                {/* Gradient overlay for visual interest */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-6 md:p-8 h-full flex flex-col">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 hover:scale-105 ${getTagColor(
                            tag
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs px-3 py-1.5 rounded-full border bg-muted text-muted-foreground font-medium">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight flex-grow-0">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed text-sm md:text-base flex-grow">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <time>
                          {new Date(post.date).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {calculateReadingTime(post.content || '')} {t('readTime')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Indicator */}
                  <div className="flex items-center text-primary font-medium text-sm mt-4 group-hover:gap-3 gap-2 transition-all duration-300">
                    <span>{t('readArticle')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </BlogLink>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-muted-foreground text-lg">{t('discoverMore')}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <BlogLink
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 group"
                title="All Blog Posts"
              >
                <BookOpen className="w-5 h-5" />
                <span>{t('viewAllPosts')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </BlogLink>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t('articlesCount', { count: posts.length })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
}
