import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('Blog');

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-4xl font-display mb-4">{t('postNotFound')}</h2>
      <p className="text-muted-foreground mb-8">{t('postNotFoundDesc')}</p>
      <Link
        href="/blog"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        {t('backToBlog')}
      </Link>
    </div>
  );
}
