import { getTranslations } from 'next-intl/server';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'datenschutz' });
  return { title: `${t('title')} – Manuel Schmid` };
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'datenschutz' });
  const sections = t.raw('sections') as LegalSection[];

  return <LegalPage title={t('title')} updated={t('updated')} sections={sections} />;
}
