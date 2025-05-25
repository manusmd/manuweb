'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { BlogLink } from '@/components/transitions/BlogLink';
import { Calendar, Clock, Tag, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/mdx';

interface BlogListingClientProps {
  posts: BlogPost[];
  locale: string;
}

function getTagColor(tag: string) {
  const tagColors: Record<string, string> = {
    ai: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    coding:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    llm: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    programming:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    automation:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',

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

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function BlogListingClient({ posts, locale }: BlogListingClientProps) {
  const t = useTranslations('blog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === null || post.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
          <Tag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">{t('noArticles')}</h3>
        <p className="text-muted-foreground">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {posts.length > 3 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button
                variant={selectedTag === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                {t('filter.all')}
              </Button>
              {allTags.slice(0, 5).map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      {(searchQuery || selectedTag) && (
        <div className="text-sm text-muted-foreground">
          {t('search.resultsCount', { count: filteredPosts.length })}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('search.noResults')}</h3>
          <p className="text-muted-foreground">{t('search.noResultsDescription')}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedTag(null);
            }}
            className="mt-4"
          >
            {t('search.clearFilters')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-4">
          {filteredPosts.map(post => (
            <BlogLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
              title={post.title}
            >
              <article className="h-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2">
                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${getTagColor(
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
                  <h2 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <span>{calculateReadingTime(post.content)} min read</span>
                    </div>
                  </div>
                </div>

                {/* Read More Indicator */}
                <div className="px-6 pb-6">
                  <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all duration-200">
                    <span>{t('readMore')}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </BlogLink>
          ))}
        </div>
      )}
    </div>
  );
}
