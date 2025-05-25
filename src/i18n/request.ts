import { getRequestConfig } from 'next-intl/server';
import { Locale, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['de', 'en'].includes(locale as Locale)) {
    locale = defaultLocale;
  }

  try {
    let messages;

    if (locale === 'de') {
      messages = (await import('../messages/de.json')).default;
    } else {
      messages = (await import('../messages/en.json')).default;
    }

    return {
      locale,
      messages,
    };
  } catch (error) {
    // Fallback to default locale
    const fallbackMessages = (await import('../messages/en.json')).default;
    console.error('Error loading messages:', error);
    return {
      locale: defaultLocale,
      messages: fallbackMessages,
    };
  }
});
