'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, FolderOpen, FileText, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const t = useTranslations('navigation');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Check if we're on the homepage
  const isHomePage = pathname === `/${locale}`;

  const navigation = [
    { 
      name: t('home'), 
      href: `/${locale}`, 
      section: 'home',
      icon: Home
    },
    { 
      name: t('about'), 
      href: `/${locale}#about`, 
      section: 'about',
      icon: User
    },
    { 
      name: t('projects'), 
      href: `/${locale}#projects`, 
      section: 'projects',
      icon: FolderOpen
    },
    { 
      name: t('blog'), 
      href: `/${locale}#blog`, 
      section: 'blog',
      icon: FileText
    },
    { 
      name: t('contact'), 
      href: `/${locale}#contact`, 
      section: 'contact',
      icon: Mail
    },
  ];

  // Track active section for better UX
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(section);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80;

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

  // Animation variants
  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const settingsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center space-x-2 font-bold text-gradient hover:scale-105 transition-transform"
              onClick={() => setIsMobileMenuOpen(false)}
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
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileMenu}
                className="md:hidden transition-all duration-200 hover:scale-105 active:scale-95 relative z-[60]"
                aria-label="Toggle mobile menu"
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

      {/* Full Screen Mobile Navigation - Outside header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[55] md:hidden bg-black/80 backdrop-blur-md"
          >
            <div className="flex flex-col h-screen justify-between items-center py-20 px-8">
              {/* Top Spacer */}
              <div className="flex-1" />

              {/* Navigation Items */}
              <nav className="flex flex-col items-center space-y-6">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.section;
                  
                  return (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <Link
                        href={item.href}
                        onClick={e => handleNavClick(e, item.section)}
                        className={`
                          group flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 min-w-[160px]
                          ${isActive 
                            ? 'text-white' 
                            : 'text-white/70 hover:text-white'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div className={`
                          flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
                          ${isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white'
                          }
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Text */}
                        <span className={`
                          font-medium text-lg transition-all duration-300 text-center
                          ${isActive ? 'text-white' : 'group-hover:text-white'}
                        `}>
                          {item.name}
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="fullscreenActiveIndicator"
                            className="w-1.5 h-1.5 bg-white rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Spacer */}
              <div className="flex-1" />

              {/* Settings Section */}
              <motion.div
                variants={settingsVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Language</span>
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
