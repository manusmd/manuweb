'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Github, Linkedin, MapPin, Send } from 'lucide-react';
import Image from 'next/image';

export function ContactSection() {
  const t = useTranslations('contact');

  return (
    <FullscreenSection
      id="contact"
      centerContent={false}
      minHeight="auto"
      className="border-t border-border/30 py-20 md:py-28"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            label={t('letsConnect')}
            title={t('getInTouch')}
            description={t('description')}
            className="mb-10 md:mb-12"
          />

          <div className="rounded-3xl border border-border/40 bg-card/55 p-6 shadow-[0_22px_64px_-32px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-white/[0.06] md:p-10">
            <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background md:h-28 md:w-28">
                <Image
                  src="/manu.png"
                  alt="Manuel Schmid"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  Manuel Schmid
                </h3>
                <p className="font-medium text-primary">Fullstack Developer</p>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t('profileDescription')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="h-12 w-full rounded-xl text-base font-semibold sm:max-w-sm"
                asChild
              >
                <a href="mailto:info@manu-web.de">
                  <Send className="mr-2 h-5 w-5" />
                  {t('sendEmail')}
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">{t('responseTime')}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border/30 pt-8">
              <a
                href="https://github.com/manusmd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/manusmd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {t('location')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </FullscreenSection>
  );
}
