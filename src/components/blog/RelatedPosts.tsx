import { BlogLink } from '@/components/transitions/BlogLink';
import { getAllPosts } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';

interface RelatedPostsProps {
  currentSlug: string;
  locale: string;
  tags?: string[];
}

export async function RelatedPosts({ currentSlug, locale, tags = [] }: RelatedPostsProps) {
  try {
    const allPosts = await getAllPosts(locale);

    // Filter out current post and find related posts
    const otherPosts = allPosts.filter(post => post.slug !== currentSlug);

    // Score posts based on shared tags
    const scoredPosts = otherPosts.map(post => {
      const sharedTags = post.tags?.filter((tag: string) => tags.includes(tag)) || [];
      return {
        ...post,
        score: sharedTags.length,
      };
    });

    // Sort by score (shared tags) and take top 3
    const relatedPosts = scoredPosts.sort((a, b) => b.score - a.score).slice(0, 3);

    if (relatedPosts.length === 0) return null;

    return (
      <section className="mt-16 pt-8 border-t border-border">
        <h2 className="text-2xl font-display font-semibold mb-6 text-foreground">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map(post => (
            <BlogLink
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-200"
              title={post.title}
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                <div className="flex items-center justify-between">
                  <time className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </BlogLink>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading related posts:', error);
    return null;
  }
}
