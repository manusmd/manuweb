'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

export function ContactSection() {
  const t = useTranslations('contact');

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@manu-web.de',
      href: 'mailto:info@manu-web.de',
      color: 'text-green-500',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@manusmd',
      href: 'https://github.com/manusmd',
      color: 'text-gray-500',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Manuel Schmid',
      href: 'https://www.linkedin.com/in/manusmd/',
      color: 'text-blue-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Germany',
      href: null,
      color: 'text-red-500',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <AnimatedWrapper>
        <div className="container mx-auto px-4 max-w-4xl">
          <StaggerContainer className="text-center space-y-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4">Get In Touch</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a project in mind? I'd love to hear from you and discuss how we can bring your
                ideas to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map(method => {
                const Icon = method.icon;
                const content = (
                  <div className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`p-3 rounded-full bg-muted group-hover:scale-110 transition-transform ${method.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-foreground">{method.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{method.value}</p>
                      </div>
                    </div>
                  </div>
                );

                return method.href ? (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? '_blank' : undefined}
                    rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={method.label}>{content}</div>
                );
              })}
            </div>

            <div className="pt-8">
              <Button size="lg" asChild>
                <a href="mailto:info@manu-web.de">
                  <Mail className="mr-2 h-5 w-5" />
                  Send me an email
                </a>
              </Button>
            </div>
          </StaggerContainer>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
