'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, type Transition } from 'framer-motion';
import { List, PanelLeftClose } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

const WIDE_LAYOUT_MQ = '(min-width: 1680px)';
const PANEL_WIDTH = 320;

const shellTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 36,
  mass: 0.88,
};

const listContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035, delayChildren: 0.08 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 480, damping: 32 },
  },
};

export function TableOfContents() {
  const pathname = usePathname();
  const t = useTranslations('blog');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [shellOpen, setShellOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(116);
  const collapsedWidthRef = useRef(116);
  const navRef = useRef<HTMLElement>(null);
  const userPrefRef = useRef<boolean | null>(null);
  const shellOpenRef = useRef(false);
  const contentOpenRef = useRef(false);

  useEffect(() => {
    shellOpenRef.current = shellOpen;
    contentOpenRef.current = contentOpen;
  }, [shellOpen, contentOpen]);

  const transition = reduceMotion ? { duration: 0 } : shellTransition;
  const contentTransition = reduceMotion
    ? { duration: 0 }
    : contentOpen
      ? { ...shellTransition, delay: 0.04 }
      : { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

  useEffect(() => {
    userPrefRef.current = null;
    const mq = window.matchMedia(WIDE_LAYOUT_MQ);
    const sync = () => {
      if (userPrefRef.current !== null) return;
      setShellOpen(mq.matches);
      setContentOpen(mq.matches);
      if (mq.matches) setLayoutOpen(true);
      else setLayoutOpen(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [pathname]);

  useLayoutEffect(() => {
    if (shellOpen || !navRef.current) return;
    const measured = Math.ceil(navRef.current.getBoundingClientRect().width);
    if (measured > 0 && measured < PANEL_WIDTH - 8) {
      collapsedWidthRef.current = measured;
      setCollapsedWidth(measured);
    }
  }, [shellOpen, t, toc.length]);

  const syncCollapsedWidth = () => {
    const nav = navRef.current;
    if (!nav || shellOpen) return;
    const measured = Math.ceil(nav.getBoundingClientRect().width);
    if (measured > 0 && measured < PANEL_WIDTH - 8) {
      collapsedWidthRef.current = measured;
      setCollapsedWidth(measured);
    }
  };

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

  const openPanel = () => {
    userPrefRef.current = true;
    if (reduceMotion) {
      setShellOpen(true);
      setLayoutOpen(true);
      setContentOpen(true);
      return;
    }
    setShellOpen(true);
  };

  const closePanel = () => {
    userPrefRef.current = false;
    if (reduceMotion) {
      setContentOpen(false);
      setShellOpen(false);
      setLayoutOpen(false);
      return;
    }
    setContentOpen(false);
  };

  const handleContentAnimationComplete = () => {
    if (!contentOpenRef.current && shellOpenRef.current) {
      setLayoutOpen(false);
      setShellOpen(false);
    }
  };

  const handleShellAnimationComplete = () => {
    if (shellOpenRef.current && !contentOpenRef.current) {
      setLayoutOpen(true);
      setContentOpen(true);
      return;
    }
    if (!shellOpenRef.current) {
      syncCollapsedWidth();
    }
  };

  if (toc.length === 0) return null;

  return (
    <aside
      className="hidden xl:block fixed left-5 top-[calc(50vh-180px)] z-30"
      aria-label={t('contents')}
    >
      <motion.nav
        ref={navRef}
        initial={false}
        animate={{
          width: shellOpen ? PANEL_WIDTH : collapsedWidth,
          borderRadius: shellOpen ? 16 : 9999,
        }}
        style={{ maxWidth: 'min(20rem, calc(100vw - 2.5rem))' }}
        transition={transition}
        onAnimationComplete={handleShellAnimationComplete}
        aria-expanded={shellOpen || contentOpen}
        className={cn(
          'overflow-hidden border border-border/50 bg-background/75 shadow-lg shadow-black/[0.04] backdrop-blur-2xl',
          'dark:border-white/[0.08] dark:bg-background/35 dark:shadow-[0_24px_80px_-32px_rgb(0_0_0/0.85)]'
        )}
      >
        <div
          className={cn(
            'max-h-[min(420px,calc(100vh-220px))] overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.25)_transparent]',
            layoutOpen ? 'px-4 py-3' : 'px-3 py-2.5'
          )}
        >
          <div
            className={cn(
              'flex items-start justify-between gap-2',
              !layoutOpen && 'cursor-pointer items-center',
              layoutOpen && 'mb-3 border-b border-border/30 pb-2.5'
            )}
            onClick={!shellOpen ? openPanel : undefined}
            onKeyDown={
              !shellOpen
                ? event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openPanel();
                    }
                  }
                : undefined
            }
            role={!shellOpen ? 'button' : undefined}
            tabIndex={!shellOpen ? 0 : undefined}
            aria-label={!shellOpen ? t('showContents') : undefined}
          >
            <div className="flex min-w-0 items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  width: layoutOpen ? 0 : 16,
                  opacity: layoutOpen ? 0 : 1,
                  marginRight: layoutOpen ? 0 : 8,
                }}
                transition={transition}
                className="flex shrink-0 items-center overflow-hidden"
                aria-hidden={layoutOpen}
              >
                <List className="h-4 w-4 text-muted-foreground" />
              </motion.div>

              <div className="min-w-0">
                <motion.p
                  initial={false}
                  animate={{
                    fontSize: layoutOpen ? '0.875rem' : '0.75rem',
                    color: layoutOpen ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  }}
                  transition={transition}
                  className="whitespace-nowrap px-1 font-semibold tracking-tight"
                >
                  {t('contents')}
                </motion.p>

                <motion.p
                  initial={false}
                  animate={{
                    opacity: contentOpen ? 1 : 0,
                    maxHeight: contentOpen ? 20 : 0,
                    marginTop: contentOpen ? 2 : 0,
                  }}
                  transition={contentTransition}
                  className="overflow-hidden px-1 text-[11px] font-normal tabular-nums text-muted-foreground/75"
                  aria-hidden={!contentOpen}
                >
                  {t('sectionsCount', { count: toc.length })}
                </motion.p>
              </div>
            </div>

            <motion.button
              type="button"
              initial={false}
              animate={{
                opacity: contentOpen ? 1 : 0,
                scale: contentOpen ? 1 : 0.85,
              }}
              transition={contentTransition}
              style={{ pointerEvents: contentOpen ? 'auto' : 'none' }}
              onClick={event => {
                event.stopPropagation();
                closePanel();
              }}
              aria-label={t('collapseContents')}
              aria-hidden={!contentOpen}
              tabIndex={contentOpen ? 0 : -1}
              whileHover={contentOpen ? { scale: 1.06 } : undefined}
              whileTap={contentOpen ? { scale: 0.94 } : undefined}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PanelLeftClose className="h-4 w-4" />
            </motion.button>
          </div>

          <motion.div
            initial={false}
            animate={{
              opacity: contentOpen ? 1 : 0,
              maxHeight: contentOpen ? 420 : 0,
            }}
            transition={contentTransition}
            onAnimationComplete={handleContentAnimationComplete}
            className="overflow-hidden"
            style={{ pointerEvents: contentOpen ? 'auto' : 'none' }}
            aria-hidden={!contentOpen}
          >
            <motion.ul
              variants={reduceMotion || !contentOpen ? undefined : listContainerVariants}
              initial={false}
              animate={reduceMotion || !contentOpen ? undefined : 'visible'}
              className="relative space-y-0 pl-1"
            >
              <span
                className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-border/80 via-border/40 to-border/80"
                aria-hidden
              />
              {toc.map(item => {
                const active = activeId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    variants={reduceMotion || !contentOpen ? undefined : listItemVariants}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                      aria-current={active ? 'location' : undefined}
                      tabIndex={contentOpen ? 0 : -1}
                      className="group flex w-full gap-2 rounded-md py-1 pl-[3px] pr-1.5 text-left transition-[color,transform] duration-200 ease-out hover:bg-muted/40 dark:hover:bg-white/[0.04]"
                    >
                      <span className="relative z-[1] flex h-4 shrink-0 items-center">
                        <span
                          className={cn(
                            'mx-px block size-2 rounded-full transition-all duration-200 ease-out',
                            active
                              ? 'scale-125 bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2),0_0_14px_hsl(var(--primary)/0.35)]'
                              : 'bg-muted-foreground/30 group-hover:scale-110 group-hover:bg-muted-foreground/55'
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          'min-w-0 flex-1 text-[12px] leading-tight tracking-[-0.01em]',
                          active
                            ? 'font-medium text-foreground'
                            : 'font-normal text-muted-foreground group-hover:text-foreground/85'
                        )}
                      >
                        {item.text}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </motion.nav>
    </aside>
  );
}
