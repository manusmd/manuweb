'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Linkedin, MapPin, MessageCircle, Send } from 'lucide-react';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import Image from 'next/image';

export function ContactSection() {
  const t = useTranslations('contact');

  const contactMethods = [
    {
      icon: Github,
      label: t('labels.github'),
      value: '@manusmd',
      href: 'https://github.com/manusmd',
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      hoverColor: 'hover:bg-gray-500/20',
      description: t('contactDescriptions.github'),
    },
    {
      icon: Linkedin,
      label: t('labels.linkedin'),
      value: 'Manuel Schmid',
      href: 'https://www.linkedin.com/in/manusmd/',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:bg-blue-500/20',
      description: t('contactDescriptions.linkedin'),
    },
    {
      icon: MapPin,
      label: t('labels.location'),
      value: t('location'),
      href: null,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      hoverColor: 'hover:bg-red-500/20',
      description: t('contactDescriptions.location'),
    },
  ];

  return (
    <FullscreenSection id="contact" className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>

      <AnimatedWrapper>
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <StaggerContainer className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16 md:mb-20">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                  <MessageCircle className="w-4 h-4" />
                  {t('letsConnect')}
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  {t('getInTouch')}
                </h2>

                <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full"></div>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t('description')}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left Side - Profile & CTA */}
              <div className="space-y-8">
                {/* Profile Section */}
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
                        <Image
                          src="/manu.png"
                          alt="Manuel Schmid"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
                        Manuel Schmid
                      </h3>
                      <p className="text-primary font-medium mb-2">Fullstack Developer</p>
                      <p className="text-sm text-muted-foreground">{t('profileDescription')}</p>
                    </div>
                  </div>
                </div>

                {/* Email CTA */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 group"
                    asChild
                  >
                    <a href="mailto:info@manu-web.de">
                      <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      {t('sendEmail')}
                    </a>
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">{t('responseTime')}</p>
                </div>
              </div>

              {/* Right Side - Contact Methods */}
              <div className="space-y-6">
                <div className="grid gap-4">
                  {contactMethods.map(method => {
                    const Icon = method.icon;
                    const content = (
                      <div
                        className={`group p-6 rounded-xl border bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${method.bgColor} ${method.hoverColor}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-full ${method.bgColor} group-hover:scale-110 transition-transform ${method.color}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{method.label}</h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {method.description}
                            </p>
                            <p className="text-sm font-medium text-foreground">{method.value}</p>
                          </div>
                          {method.href && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          )}
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
              </div>
            </div>
          </StaggerContainer>
        </div>
      </AnimatedWrapper>
    </FullscreenSection>
  );
}
