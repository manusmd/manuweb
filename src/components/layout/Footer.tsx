'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const params = useParams();
  const locale = params.locale as string;
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: t('social.github'),
      href: 'https://github.com/manusmd',
      icon: Github,
      className: 'hover:text-accent-blue',
    },
    {
      name: t('social.linkedin'),
      href: 'https://www.linkedin.com/in/manusmd/',
      icon: Linkedin,
      className: 'hover:text-accent-blue',
    },
    {
      name: t('social.email'),
      href: 'mailto:info@manu-web.de',
      icon: Mail,
      className: 'hover:text-accent-green',
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="text-xl font-bold text-gradient">
              Manuel Schmid
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">{t('description')}</p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{t('connect')}</h3>
            <div className="flex space-x-4">
              {socialLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`p-2 rounded-md text-muted-foreground transition-all hover:scale-110 ${link.className}`}
                    aria-label={link.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">{t('copyright', { year: currentYear })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
