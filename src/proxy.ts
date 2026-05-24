import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/',
    '/(de|en)/:path*',
    '/((?!_next|_vercel|favicon\\.ico|robots\\.txt|site\\.webmanifest|.*\\..*).*)',
  ],
};
