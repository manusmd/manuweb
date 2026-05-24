'use client';

import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TimelineIntroPanelProps {
  title: string;
  subtitle: string;
}

export function TimelineIntroPanel({ title, subtitle }: TimelineIntroPanelProps) {
  const tc = useTranslations('contact');
  const ta = useTranslations('about');
  return (
    <div
      className="flex items-center justify-center relative overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        minWidth: '100vw',
        flexShrink: 0,
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
        <div className="space-y-12 mb-16">
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-tight">
              {title}
            </h1>

            <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>

            <p className="text-2xl lg:text-3xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href="mailto:info@manu-web.de">
              <Mail className="mr-3 h-5 w-5" />
              {tc('getInTouch')}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-400 text-gray-200 hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            asChild
          >
            <a href="https://github.com/manusmd" target="_blank" rel="noopener noreferrer">
              <Github className="mr-3 h-5 w-5" />
              {ta('buttons.github')}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-400 text-gray-200 hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
            asChild
          >
            <a
              href="https://www.linkedin.com/in/manusmd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="mr-3 h-5 w-5" />
              {ta('buttons.linkedin')}
            </a>
          </Button>
        </div>

        <div className="pt-8">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto relative">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{ta('timelineIntro.scrollContinue')}</p>
        </div>
      </div>
    </div>
  );
}
