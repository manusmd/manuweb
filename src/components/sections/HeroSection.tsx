'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { Blob3D } from '@/components/three/Blob3D';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useSpotlight } from '@/hooks/useSpotlight';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { use3DSceneReady } from '@/hooks/use3DSceneReady';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the 3D scene to avoid SSR issues
const DynamicScene3D = dynamic(
  () => import('@/components/three/Scene3D').then(mod => ({ default: mod.Scene3D })),
  {
    ssr: false,
    loading: () => null,
  }
);

// Preload 3D components for faster loading
if (typeof window !== 'undefined') {
  import('@/components/three/Scene3D');
  import('@/components/three/Blob3D');
}

export function HeroSection() {
  const t = useTranslations('hero');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Track 3D scene loading state
  const { isSceneReady, markSphereReady, progress } = use3DSceneReady({
    sphereCount: 3,
    minLoadTime: 800,
  });

  const { spotlightStyle } = useSpotlight({
    size: isMobile ? 200 : 400,
    opacity: 0.2,
    color: 'rgba(59, 130, 246, 0.15)',
    enabled: !prefersReducedMotion && !isMobile && isSceneReady,
  });

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen isVisible={!isSceneReady} progress={progress} />

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Spotlight Effect */}
        {!prefersReducedMotion && !isMobile && isSceneReady && <div style={spotlightStyle} />}

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />

        {/* 3D Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSceneReady ? 0.4 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <DynamicScene3D>
            <Blob3D
              position={[2, 0, -2]}
              scale={isMobile ? 1.5 : 2}
              color="#3b82f6"
              onReady={markSphereReady}
            />
            <Blob3D
              position={[-2, 1, -3]}
              scale={isMobile ? 1 : 1.5}
              color="#8b5cf6"
              onReady={markSphereReady}
            />
            <Blob3D
              position={[0, -2, -4]}
              scale={isMobile ? 0.8 : 1.2}
              color="#10b981"
              onReady={markSphereReady}
            />
          </DynamicScene3D>
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 container mx-auto px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSceneReady ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 lg:pr-12">
              <StaggerContainer>
                <AnimatedWrapper animation="fadeInLeft" delay={0.2}>
                  <div className="space-y-4">
                    <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
                      <span className="text-gradient">{t('name')}</span>
                    </h1>
                    <h2 className="text-2xl lg:text-3xl font-medium text-muted-foreground/80">
                      {t('title')}
                    </h2>
                  </div>
                </AnimatedWrapper>

                <AnimatedWrapper animation="fadeInLeft" delay={0.4}>
                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mt-8">
                    {t('description')}
                  </p>
                </AnimatedWrapper>

                <AnimatedWrapper animation="fadeInLeft" delay={0.6}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                    <AnimatedButton
                      size="lg"
                      enableGlow
                      glowColor="blue"
                      onClick={scrollToProjects}
                      className="text-lg px-10 py-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 rounded-2xl font-medium"
                    >
                      {t('cta.projects')}
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="lg"
                      onClick={scrollToContact}
                      className="text-lg px-10 py-6 border-2 hover:bg-accent/10 rounded-2xl font-medium backdrop-blur-sm hover:scale-[1.02] transition-all duration-200"
                    >
                      {t('cta.contact')}
                    </AnimatedButton>
                  </div>
                </AnimatedWrapper>

                <AnimatedWrapper animation="fadeInLeft" delay={0.8}>
                  <div className="flex gap-4 justify-center lg:justify-start mt-8">
                    <a
                      href="https://github.com/manusmd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full glass hover:scale-110 transition-all hover:text-accent-blue"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/manusmd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full glass hover:scale-110 transition-all hover:text-accent-blue"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a
                      href="mailto:info@manu-web.de"
                      className="p-3 rounded-full glass hover:scale-110 transition-all hover:text-accent-green"
                    >
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                </AnimatedWrapper>
              </StaggerContainer>
            </div>
          </div>

          {/* Scroll Indicator */}
          <AnimatedWrapper
            animation="fadeInUp"
            delay={1.2}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={scrollToNext}
              className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors group"
              aria-label="Scroll to next section"
            >
              <span className="text-sm font-medium">{t('scrollDown')}</span>
              <ArrowDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </AnimatedWrapper>
        </motion.div>

        {/* Floating Particles Effect */}
        {!prefersReducedMotion && isSceneReady && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent-blue/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
