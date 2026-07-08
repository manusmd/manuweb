'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HeaderMobileMenu } from '@/components/layout/HeaderMobileMenu';
import { HeaderNavDropdown } from '@/components/layout/HeaderNavDropdown';
import { NAV_SCROLL_OFFSET_PX } from '@/constants/scroll';
import { PROJECTS_SECTION_ENABLED } from '@/constants/features';
import { useActiveHomeSection } from '@/hooks/useSectionScroll';
import { Menu, X, Home, User, FolderOpen, FileText, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type {
  HeaderFeaturedProject,
  HeaderPostPreview,
} from '@/components/layout/headerNavPreview.types';

const DROPDOWN_SECTIONS = new Set(['blog', 'projects']);
const DROPDOWN_CLOSE_DELAY_MS = 150;

interface HeaderProps {
  latestPosts?: HeaderPostPreview[];
  featuredProject?: HeaderFeaturedProject;
}

export function Header({ latestPosts, featuredProject }: HeaderProps) {
  const t = useTranslations('navigation');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isHomePage = pathname === `/${locale}`;

  const { activeId: activeSection } = useActiveHomeSection(isHomePage, 'headerContainment');

  // The nav highlight follows the cursor, falling back to the active section.
  const highlightedSection = hoveredSection ?? activeSection;

  const navigation = [
    {
      name: t('home'),
      href: `/${locale}`,
      section: 'home',
      icon: Home,
    },
    {
      name: t('about'),
      href: `/${locale}#about`,
      section: 'about',
      icon: User,
    },
    ...(PROJECTS_SECTION_ENABLED
      ? [
          {
            name: t('projects'),
            href: `/${locale}#projects`,
            section: 'projects',
            icon: FolderOpen,
          },
        ]
      : []),
    {
      name: t('blog'),
      href: `/${locale}#blog`,
      section: 'blog',
      icon: FileText,
    },
    {
      name: t('contact'),
      href: `/${locale}#contact`,
      section: 'contact',
      icon: Mail,
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(section);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - NAV_SCROLL_OFFSET_PX;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cancelDropdownClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  };

  const openDropdownNow = (section: string) => {
    cancelDropdownClose();
    setOpenDropdown(section);
  };

  const scheduleDropdownClose = () => {
    cancelDropdownClose();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, DROPDOWN_CLOSE_DELAY_MS);
  };

  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  // Close menu on escape key and prevent background scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close any open dropdown whenever the route changes.
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => cancelDropdownClose, []);

  // Tighten the glass as soon as the page scrolls (Lenis-aware).
  useEffect(() => {
    const onScroll = () => setScrolled((window.__lenis?.scroll ?? window.scrollY) > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-2">
        <div
          className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl px-3 ring-1 ring-white/5 transition-[background-color,box-shadow,border-color] duration-300 ${
            scrolled
              ? 'border border-border/60 bg-background/70 shadow-xl shadow-black/25 backdrop-blur-xl'
              : 'border border-border/40 bg-background/40 shadow-lg shadow-black/10 backdrop-blur-xl'
          }`}
        >
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 pl-2 font-bold text-gradient transition-transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
            data-logo
          >
            <span className="text-2xl font-display tracking-tight">manu</span>
          </Link>

          <nav className="relative hidden items-center md:flex">
            {navigation.map(item => {
              const isHighlighted = highlightedSection === item.section;
              const hasDropdown = DROPDOWN_SECTIONS.has(item.section);

              const link = (
                <Link
                  href={item.href}
                  onClick={e => handleNavClick(e, item.section)}
                  onMouseEnter={() => setHoveredSection(item.section)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="relative rounded-full px-4 py-2 text-sm font-medium"
                >
                  {isHighlighted && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/10 shadow-sm backdrop-blur-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={`transition-colors ${
                      isHighlighted
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );

              if (!hasDropdown) {
                return <div key={item.name}>{link}</div>;
              }

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => openDropdownNow(item.section)}
                  onMouseLeave={scheduleDropdownClose}
                  onFocus={() => openDropdownNow(item.section)}
                  onBlur={handleDropdownBlur}
                >
                  {link}
                  <AnimatePresence>
                    {openDropdown === item.section && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2"
                      >
                        <HeaderNavDropdown
                          kind={item.section as 'blog' | 'projects'}
                          latestPosts={latestPosts}
                          featuredProject={featuredProject}
                          onNavigate={() => setOpenDropdown(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3 pr-1">
            <div className="hidden md:flex items-center space-x-3">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="relative z-[60] flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-foreground shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white/15 active:scale-95 md:hidden"
              aria-label={t('toggleMenu')}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.div>
            </button>
          </div>
        </div>
      </header>

      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        navigation={navigation}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}
