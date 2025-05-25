'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('navigation');

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="transition-all duration-200 hover:scale-105"
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
    </Button>
  );
}
