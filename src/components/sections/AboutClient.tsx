'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { Timeline } from '@/components/about/Timeline';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';

export function AboutClient() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24">
      <AnimatedWrapper>
        <div className="container mx-auto px-4">
          <StaggerContainer className="space-y-16">
            <div className="text-center">
              <h2 className="text-4xl font-display font-bold mb-4">{t('title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('subtitle')}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:info@manu-web.de">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('buttons.email')}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/manusmd" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  {t('buttons.github')}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://www.linkedin.com/in/manusmd/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  {t('buttons.linkedin')}
                </a>
              </Button>
            </div>

            <Timeline />
          </StaggerContainer>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
