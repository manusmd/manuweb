'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Calendar } from 'lucide-react';
import type {
  HeaderProjectPreview,
  HeaderPostPreview,
} from '@/components/layout/headerNavPreview.types';

function formatPostDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** A compact list row: thumbnail + title + secondary line. */
function NavRow({
  href,
  image,
  title,
  meta,
  onNavigate,
}: {
  href: string;
  image?: string;
  title: string;
  meta: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/8"
    >
      <div className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-muted/40">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="72px"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <span className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
          {title}
        </span>
        <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{meta}</span>
      </div>
    </Link>
  );
}

interface HeaderNavDropdownProps {
  kind: 'blog' | 'projects';
  latestPosts?: HeaderPostPreview[];
  projects?: HeaderProjectPreview[];
  onNavigate: () => void;
}

/** Glassmorphism hover-card content shown beneath the Blog / Projects nav items. */
export function HeaderNavDropdown({
  kind,
  latestPosts,
  projects,
  onNavigate,
}: HeaderNavDropdownProps) {
  const locale = useLocale();
  const tBlog = useTranslations('blog');
  const tProjects = useTranslations('projects');

  if (kind === 'blog') {
    const posts = latestPosts ?? [];
    if (posts.length === 0) return null;

    return (
      <div className="w-80 rounded-2xl border border-white/10 bg-background/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tBlog('latestArticles')}
        </p>
        <div className="flex flex-col">
          {posts.map(post => (
            <NavRow
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              image={post.image}
              title={post.title}
              meta={
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatPostDate(post.date, locale)}
                </span>
              }
              onNavigate={onNavigate}
            />
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

  const items = projects ?? [];
  if (items.length === 0) return null;

  return (
    <div className="w-80 rounded-2xl border border-white/10 bg-background/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {tProjects('homeSection.featuredBadge')}
      </p>
      <div className="flex flex-col">
        {items.map(project => (
          <NavRow
            key={project.slug}
            href={`/${locale}/projects/${project.slug}`}
            image={project.image}
            title={project.title}
            meta={project.subtitle}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <Link
        href={`/${locale}#projects`}
        onClick={onNavigate}
        className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-white/8"
      >
        {tProjects('homeSection.viewAllGithub')}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
