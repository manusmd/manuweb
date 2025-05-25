import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

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

export async function BlogPreview({ locale }: BlogPreviewProps) {
  const t = await getTranslations('Blog');
  const posts = await getAllPosts(locale);
  const latestPosts = posts.slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">{t('title')}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map(post => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
            >
              <div className="p-6">
                <h3 className="text-xl font-display mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${getTagColor(
                        tag
                      )}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <time className="text-xs text-muted-foreground block">
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
