'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const excludePatterns = [
  /^\d+\.\s/,
  /^Rapid Prototyping$/,
  /^Accessibility for Non-Programmers$/,
  /^Speed of Development$/,
  /^Security Concerns$/,
  /^Code Quality$/,
  /^Debugging Challenges$/,
  /^Startup Ecosystem$/,
  /^Enterprise Applications$/,
  /^Educational Impact$/,
];

export function TableOfContents() {
  const pathname = usePathname();
  const t = useTranslations('blog');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    let intersectionObserver: IntersectionObserver | null = null;
    let debounce: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      intersectionObserver?.disconnect();
      intersectionObserver = null;

      const headings = document.querySelectorAll<HTMLHeadingElement>('article .prose h2');
      const tocItems: TocItem[] = [];
      const observed: HTMLHeadingElement[] = [];

      headings.forEach((heading, index) => {
        const text = heading.textContent || '';
        if (excludePatterns.some(pattern => pattern.test(text))) return;

        const id = heading.id?.trim() || `heading-${String(index)}`;
        if (!heading.id?.trim()) {
          heading.id = id;
        }

        tocItems.push({ id, text, level: 2 });
        observed.push(heading);
      });

      setToc(tocItems);

      if (observed.length === 0) {
        return;
      }

      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-20% 0% -35% 0%' }
      );

      observed.forEach(h => intersectionObserver?.observe(h));
    };

    refresh();

    const articleRoot = document.querySelector('article');
    const mo =
      articleRoot &&
      new MutationObserver(() => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(refresh, 60);
      });
    if (articleRoot && mo) {
      mo.observe(articleRoot, { childList: true, subtree: true });
    }

    const t0 = window.setTimeout(refresh, 0);
    const t1 = window.setTimeout(refresh, 200);

    return () => {
      if (debounce) clearTimeout(debounce);
      clearTimeout(t0);
      clearTimeout(t1);
      mo?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [pathname]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <aside
      className="hidden xl:block fixed left-5 top-[calc(50vh-180px)] z-30 w-80 max-w-[min(20rem,calc(100vw-2rem))]"
      aria-label={t('contents')}
    >
      <nav className="rounded-2xl border border-border/50 bg-background/75 shadow-lg shadow-black/[0.04] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-background/35 dark:shadow-[0_24px_80px_-32px_rgb(0_0_0/0.85)]">
        <div className="max-h-[min(420px,calc(100vh-220px))] overflow-y-auto overflow-x-hidden px-4 py-3 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.25)_transparent]">
          <header className="mb-3 space-y-0 border-b border-border/30 pb-2.5">
            <p className="px-1 text-sm font-semibold tracking-tight text-foreground">
              {t('contents')}
            </p>
            <p className="px-1 text-[11px] font-normal tabular-nums text-muted-foreground/75">
              {t('sectionsCount', { count: toc.length })}
            </p>
          </header>
          <ul className="relative space-y-0 pl-1">
            <span
              className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-border/80 via-border/40 to-border/80"
              aria-hidden
            />
            {toc.map(item => {
              const active = activeId === item.id;
              return (
                <li key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    aria-current={active ? 'location' : undefined}
                    className="group flex w-full gap-2 rounded-md py-1 pl-[3px] pr-1.5 text-left transition-[color,transform] duration-200 ease-out hover:bg-muted/40 dark:hover:bg-white/[0.04]"
                  >
                    <span className="relative z-[1] flex h-4 shrink-0 items-center">
                      <span
                        className={[
                          'mx-px block size-2 rounded-full transition-all duration-200 ease-out',
                          active
                            ? 'scale-125 bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2),0_0_14px_hsl(var(--primary)/0.35)]'
                            : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/55 group-hover:scale-110',
                        ].join(' ')}
                      />
                    </span>
                    <span
                      className={[
                        'min-w-0 flex-1 text-[12px] leading-tight tracking-[-0.01em]',
                        active
                          ? 'font-medium text-foreground'
                          : 'font-normal text-muted-foreground group-hover:text-foreground/85',
                      ].join(' ')}
                    >
                      {item.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
