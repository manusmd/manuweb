'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const localeLabels: Record<Locale, { short: string; aria: string }> = {
  de: { short: 'DE', aria: 'Deutsch' },
  en: { short: 'EN', aria: 'English' },
};

export function LanguageSwitcher() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const currentLocale = params.locale as Locale;

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const thumbTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 38 };

  return (
    <div
      role="group"
      aria-label={t('language')}
      className="relative inline-flex rounded-full border border-white/12 bg-background/72 p-0.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
    >
      {locales.map(locale => {
        const isActive = locale === currentLocale;
        const { short, aria } = localeLabels[locale];

        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchLanguage(locale)}
            aria-label={aria}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'relative z-10 min-w-[2.75rem] rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="language-switcher-thumb"
                className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                transition={thumbTransition}
              />
            )}
            <span className="relative z-10">{short}</span>
          </button>
        );
      })}
    </div>
  );
}
