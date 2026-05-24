'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  headerNavItemVariants,
  headerOverlayVariants,
  headerSettingsVariants,
} from '@/components/layout/headerVariants';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type HeaderNavItem = {
  name: string;
  href: string;
  section: string;
  icon: LucideIcon;
};

interface HeaderMobileMenuProps {
  isOpen: boolean;
  navigation: HeaderNavItem[];
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, section: string) => void;
}

export function HeaderMobileMenu({
  isOpen,
  navigation,
  activeSection,
  onNavClick,
}: HeaderMobileMenuProps) {
  const t = useTranslations('navigation');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={headerOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[55] md:hidden bg-black/80 backdrop-blur-md"
          style={{
            paddingTop: 'var(--safe-area-inset-top)',
            paddingBottom: 'var(--mobile-safe-bottom)',
          }}
        >
          <div className="flex flex-col h-full justify-center items-center px-8 py-8">
            <nav className="flex flex-col items-center space-y-3 flex-1 justify-center max-h-[70vh] overflow-y-auto w-full max-w-xs">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;

                return (
                  <motion.div
                    key={item.name}
                    variants={headerNavItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={e => onNavClick(e, item.section)}
                      className={`
                          group flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 w-full
                          ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}
                        `}
                    >
                      <div
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 flex-shrink-0
                          ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <span
                        className={`
                          font-medium text-lg transition-all duration-300 flex-1 text-left
                          ${isActive ? 'text-white' : 'group-hover:text-white'}
                        `}
                      >
                        {item.name}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="fullscreenActiveIndicator"
                          className="w-2 h-2 bg-white rounded-full flex-shrink-0"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              variants={headerSettingsVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 mt-6 mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">{t('theme')}</span>
                <div className="[&_button]:bg-white/10 [&_button]:border-white/20 [&_button]:text-white [&_button:hover]:bg-white/20 [&_button[data-state=on]]:bg-white/30">
                  <ThemeToggle />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">{t('language')}</span>
                <div className="[&_button]:bg-white/10 [&_button]:border-white/20 [&_button]:text-white [&_button:hover]:bg-white/20 [&_button[data-variant=default]]:bg-white/30 [&_button[data-variant=default]]:text-black">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
