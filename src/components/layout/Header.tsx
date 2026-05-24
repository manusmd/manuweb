'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HeaderMobileMenu } from '@/components/layout/HeaderMobileMenu';
import { Button } from '@/components/ui/button';
import { NAV_SCROLL_OFFSET_PX } from '@/constants/scroll';
import { useActiveHomeSection } from '@/hooks/useSectionScroll';
import { Menu, X, Home, User, FolderOpen, FileText, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Header() {
  const t = useTranslations('navigation');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === `/${locale}`;

  const { activeId: activeSection } = useActiveHomeSection(isHomePage, 'headerContainment');

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
    {
      name: t('projects'),
      href: `/${locale}#projects`,
      section: 'projects',
      icon: FolderOpen,
    },
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
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu on escape key and prevent background scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-2 font-bold text-gradient hover:scale-105 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
              data-logo
            >
              <span className="text-2xl font-display tracking-tight">manu</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.section)}
                  className="text-sm font-medium transition-colors hover:text-primary relative group"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <LanguageSwitcher />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileMenu}
                className="md:hidden transition-all duration-200 hover:scale-105 active:scale-95 relative z-[60]"
                aria-label={t('toggleMenu')}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.div>
              </Button>
            </div>
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
