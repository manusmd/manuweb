'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Calendar } from 'lucide-react';
import type {
  HeaderFeaturedProject,
  HeaderPostPreview,
} from '@/components/layout/headerNavPreview.types';

function formatPostDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface HeaderNavDropdownProps {
  kind: 'blog' | 'projects';
  latestPosts?: HeaderPostPreview[];
  featuredProject?: HeaderFeaturedProject;
  onNavigate: () => void;
}

/** Glassmorphism hover-card content shown beneath the Blog / Projects nav items. */
export function HeaderNavDropdown({
  kind,
  latestPosts,
  featuredProject,
  onNavigate,
}: HeaderNavDropdownProps) {
  const locale = useLocale();
  const tBlog = useTranslations('blog');
  const tProjects = useTranslations('projects');

  if (kind === 'blog') {
    const posts = latestPosts ?? [];
    if (posts.length === 0) return null;

    return (
      <div className="w-72 rounded-2xl border border-white/10 bg-background/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tBlog('latestArticles')}
        </p>
        <div className="flex flex-col">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              onClick={onNavigate}
              className="group flex flex-col gap-0.5 rounded-xl px-3 py-2 transition-colors hover:bg-white/8"
            >
              <span className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                {post.title}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatPostDate(post.date, locale)}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href={`/${locale}/blog`}
          onClick={onNavigate}
          className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-white/8"
        >
          {tBlog('viewAllPosts')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  if (!featuredProject) return null;
  const image = featuredProject.thumbnail || featuredProject.image;

  return (
    <div className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-background/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <Link
        href={`/${locale}/projects/${featuredProject.slug}`}
        onClick={onNavigate}
        className="group block"
      >
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
            <Image
              src={image}
              alt={featuredProject.title}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="320px"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
        ) : null}
        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {tProjects('homeSection.featuredBadge')}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
            {featuredProject.title}
          </p>
          {featuredProject.subtitle ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {featuredProject.subtitle}
            </p>
          ) : null}
        </div>
      </Link>
      <Link
        href={`/${locale}#projects`}
        onClick={onNavigate}
        className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-white/8"
      >
        {tProjects('viewProject')}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
