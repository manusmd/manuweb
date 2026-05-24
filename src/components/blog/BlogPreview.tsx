import Image from 'next/image';
import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import { BlogLink } from '@/components/transitions/BlogLink';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { calculateReadingTime, getBlogTagColor } from '@/lib/blogTagColors';
import { resolveBlogCoverImage } from '@/lib/blogPost';
import type { BlogPost } from '@/lib/mdx';

interface BlogPreviewProps {
  locale: string;
}

function formatPostDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function BlogPreviewCard({
  post,
  locale,
  readTimeLabel,
  readArticleLabel,
}: {
  post: BlogPost;
  locale: string;
  readTimeLabel: string;
  readArticleLabel: string;
}) {
  const coverImage = resolveBlogCoverImage(post);

  return (
    <BlogLink href={`/${locale}/blog/${post.slug}`} className="group block h-full" title={post.title}>
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/55 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-border/70 hover:shadow-[0_28px_72px_-36px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/30 bg-muted/30">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-blue-500/10" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          {post.tags && post.tags.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium md:text-xs ${getBlogTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl">
            {post.title}
          </h3>

          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.description}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground md:text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <time>{formatPostDate(post.date, locale)}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>
                  {calculateReadingTime(post.content || '')} {readTimeLabel}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {readArticleLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </BlogLink>
  );
}

export async function BlogPreview({ locale }: BlogPreviewProps) {
  const t = await getTranslations('blog');
  const posts = await getAllPosts(locale);

  if (posts.length === 0) {
    return null;
  }

  const previewPosts = posts.slice(0, 3);

  return (
    <FullscreenSection
      id="blog"
      centerContent={false}
      minHeight="auto"
      className="border-t border-border/30 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-12">
          <SectionHeader
            label={t('latestArticles')}
            title={t('title')}
            description={t('description')}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {previewPosts.map(post => (
              <BlogPreviewCard
                key={post.slug}
                post={post}
                locale={locale}
                readTimeLabel={t('readTime')}
                readArticleLabel={t('readArticle')}
              />
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 border-t border-border/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground md:text-base">
              {t('articlesCount', { count: posts.length })}
            </p>
            <BlogLink
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-accent/40"
              title={t('viewAllPosts')}
            >
              <span>{t('viewAllPosts')}</span>
              <ArrowRight className="h-4 w-4" />
            </BlogLink>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
}
