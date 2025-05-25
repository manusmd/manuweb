'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const t = useTranslations('navigation');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're on the homepage
  const isHomePage = pathname === `/${locale}`;

  const navigation = [
    { name: t('home'), href: `/${locale}`, section: 'home' },
    { name: t('about'), href: `/${locale}#about`, section: 'about' },
    { name: t('projects'), href: `/${locale}#projects`, section: 'projects' },
    { name: t('blog'), href: `/${locale}#blog`, section: 'blog' },
    { name: t('contact'), href: `/${locale}#contact`, section: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (isHomePage) {
      // If we're on the homepage, scroll to the section
      e.preventDefault();
      const element = document.getElementById(section);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80; // 80px offset for navbar

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    // If we're not on the homepage, let the Link handle navigation normally
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 font-bold text-gradient hover:scale-105 transition-transform"
          >
            <span className="text-2xl font-display tracking-tight">manu</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/40">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.section)}
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
