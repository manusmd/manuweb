import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';

interface ReadingTimeProps {
  content: string;
}

export function ReadingTime({ content }: ReadingTimeProps) {
  const t = useTranslations('blog');
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span>{t('readingTime', { time: readingTime })}</span>
    </div>
  );
}
