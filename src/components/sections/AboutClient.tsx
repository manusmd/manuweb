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
          <StaggerContainer className="space-y-12">
            <div>
              <h3 className="mb-8 text-2xl font-semibold">{t('timeline.title')}</h3>
              <Timeline />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:info@manu-web.de">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/manusmd" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://www.linkedin.com/in/manusmd/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </StaggerContainer>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
