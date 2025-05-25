'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const t = useTranslations('blog');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Only include h2 headings for main structure
    const headings = document.querySelectorAll('h2');
    const tocItems: TocItem[] = [];

    // Filter out sub-headings that are numbered or are sub-sections
    const excludePatterns = [
      /^\d+\.\s/, // Numbered items like "1. Natural Language Description"
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

    headings.forEach((heading, index) => {
      const text = heading.textContent || '';

      // Skip if it matches any exclude pattern
      const shouldExclude = excludePatterns.some(pattern => pattern.test(text));
      if (shouldExclude) return;

      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      tocItems.push({
        id,
        text,
        level: 2,
      });
    });

    setToc(tocItems);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 80; // 80px offset for navbar

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="hidden 2xl:block fixed left-4 top-1/2 transform -translate-y-1/2 z-30 w-64">
      <div className="bg-gradient-to-br from-card/95 to-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-2xl shadow-black/10 max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/30">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground">{t('contents')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('sectionsCount', { count: toc.length })}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {toc.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    w-full text-left transition-all duration-300 rounded-lg p-3 group relative overflow-hidden
                    ${
                      activeId === item.id
                        ? 'text-primary font-medium bg-gradient-to-r from-primary/15 to-primary/5 border-l-3 border-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground border-l-3 border-transparent hover:border-primary/30 hover:bg-muted/30'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {activeId === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg" />
                  )}

                  {/* Content */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                        text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                        ${
                          activeId === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted-foreground/20 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        }
                      `}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed font-medium">{item.text}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
