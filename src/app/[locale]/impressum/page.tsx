import { getTranslations } from 'next-intl/server';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'impressum' });
  return { title: `${t('title')} – Manuel Schmid` };
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'impressum' });
  const sections = t.raw('sections') as LegalSection[];

  return <LegalPage title={t('title')} sections={sections} />;
}
