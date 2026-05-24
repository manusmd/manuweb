'use client';

import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AboutIntroProps {
  title: string;
  subtitle: string;
}

export function AboutIntro({ title, subtitle }: AboutIntroProps) {
  const tc = useTranslations('contact');
  const ta = useTranslations('about');

  return (
    <div className="relative min-h-[65vh] overflow-hidden rounded-3xl rounded-b-none border border-border/50 border-b-0 bg-gradient-to-br from-slate-950 via-purple-950/90 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          data-about-parallax="0.12"
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        />
        <div data-about-parallax="0.32" className="absolute inset-0 opacity-40">
          <div
            data-about-parallax="0.18"
            className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/25 via-transparent to-transparent"
          />
          <div
            data-about-parallax="0.22"
            className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/25 via-transparent to-transparent"
          />
          <div
            data-about-parallax="0.2"
            className="absolute bottom-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent"
          />
        </div>
        <div
          data-about-parallax="0.08"
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[65vh] max-w-5xl flex-col justify-center px-4 py-16 text-center md:px-8">
        <div className="mb-12 space-y-8 md:mb-16">
          <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>

          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />

          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-200 md:text-2xl lg:text-3xl">
            {subtitle}
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-4 md:gap-6">
          <Button
            size="lg"
            className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-2xl hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/25 md:px-8 md:text-lg"
            asChild
          >
            <a href="mailto:info@manu-web.de">
              <Mail className="mr-2 h-5 w-5 md:mr-3" />
              {tc('getInTouch')}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-400 px-6 py-4 text-base font-semibold text-gray-200 hover:bg-white hover:text-gray-900 md:px-8 md:text-lg"
            asChild
          >
            <a href="https://github.com/manusmd" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5 md:mr-3" />
              {ta('buttons.github')}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-400 px-6 py-4 text-base font-semibold text-gray-200 hover:bg-white hover:text-gray-900 md:px-8 md:text-lg"
            asChild
          >
            <a
              href="https://www.linkedin.com/in/manusmd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-2 h-5 w-5 md:mr-3" />
              {ta('buttons.linkedin')}
            </a>
          </Button>
        </div>

        <div className="pt-4">
          <div className="relative mx-auto h-10 w-6 rounded-full border-2 border-gray-400">
            <div className="absolute left-1/2 top-2 h-3 w-1 -translate-x-1/2 animate-bounce rounded-full bg-gradient-to-b from-blue-400 to-purple-400" />
          </div>
          <p className="mt-2 text-sm text-gray-400">{ta('timelineIntro.scrollContinue')}</p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-950/90"
        aria-hidden
      />
    </div>
  );
}
