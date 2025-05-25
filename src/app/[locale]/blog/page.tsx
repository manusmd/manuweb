import { getAllPosts } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import { BlogLink } from '@/components/transitions/BlogLink';
import { BlogTransition } from '@/components/transitions/BlogTransition';

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display mb-8">{t('title')}</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <BlogLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-2xl font-display mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.description}</p>
                <div className="flex items-center justify-between">
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <div className="flex gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </BlogLink>
          ))}
        </div>
      </div>
    </BlogTransition>
  );
}
