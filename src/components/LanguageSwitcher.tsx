'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = params.locale as Locale;

  const switchLanguage = (newLocale: Locale) => {
    // Replace the locale in the pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex gap-2">
      {locales.map(locale => (
        <Button
          key={locale}
          variant={locale === currentLocale ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLanguage(locale)}
          className="text-xs"
        >
          {locale.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
