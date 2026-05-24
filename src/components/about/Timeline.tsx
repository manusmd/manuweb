'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin } from 'lucide-react';

let gsap: GSAP | null = null;
let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  description: string;
}

// Company themes with enhanced visuals
const companyThemes: Record<
  string,
  {
    background: string;
    textColor: string;
    accentColor: string;
    cardBg: string;
    icon: string;
    pattern?: string;
    visualElement: string;
    borderColor: string;
  }
> = {
  Syndikat7: {
    background: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
    textColor: 'text-gray-100',
    accentColor: 'text-red-400',
    cardBg: 'bg-gray-800/50 border-gray-700',
    icon: '',
    pattern: 'opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]',
    visualElement: 'matrix',
    borderColor: 'border-gray-700',
  },
  'T-Systems': {
    background: 'bg-gradient-to-br from-pink-900 via-purple-900 to-magenta-800',
    textColor: 'text-pink-100',
    accentColor: 'text-magenta-300',
    cardBg: 'bg-pink-800/30 border-magenta-500/30',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_30%_70%,rgba(255,0,255,0.2),transparent_50%)]',
    visualElement: 'tech',
    borderColor: 'border-magenta-400/50',
  },
  PRGH: {
    background: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-800',
    textColor: 'text-purple-100',
    accentColor: 'text-violet-300',
    cardBg: 'bg-purple-800/30 border-violet-500/30',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.3),transparent_50%)]',
    visualElement: 'medical',
    borderColor: 'border-violet-400/50',
  },
  'Neue Fische': {
    background: 'bg-gradient-to-br from-orange-800 via-orange-900 to-red-900',
    textColor: 'text-orange-50',
    accentColor: 'text-orange-300',
    cardBg: 'bg-orange-700/40 border-orange-400/40',
    icon: '',
    pattern:
      'opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(255,165,0,0.4),transparent_50%)]',
    visualElement: 'education',
    borderColor: 'border-orange-400/60',
  },
};

export function Timeline() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const experiences = t.raw('experience') as ExperienceItem[];

  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 1024);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;

        gsap = gsapModule.gsap;
        ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        setGsapReady(true);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Intersection Observer to track when Timeline section is visible
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '-10% 0px -10% 0px', // Add some margin to prevent flickering
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isClient]);

  // Mobile scroll detection for panel tracking
  useEffect(() => {
    if (!isMobile || !isClient) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Only track panels if we're in the Timeline section
      if (sectionTop <= 0 && sectionTop + sectionHeight > 0) {
        const scrollProgress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        const totalPanels = experiences.length + 1;
        const panelIndex = Math.floor(scrollProgress * totalPanels);
        const clampedIndex = Math.max(0, Math.min(panelIndex, totalPanels - 1));
        setCurrentPanel(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isClient, experiences.length]);

  useEffect(() => {
    if (
      !isClient ||
      !gsapReady ||
      isMobile ||
      !gsap ||
      !ScrollTrigger ||
      !containerRef.current ||
      !horizontalRef.current
    ) {
      return;
    }

    const container = containerRef.current;
    const horizontal = horizontalRef.current;

    // Calculate total width needed for horizontal scroll
    const totalPanels = experiences.length + 1; // +1 for intro panel
    const panelWidth = window.innerWidth;
    const totalWidth = totalPanels * panelWidth;
    const maxTranslate = -(totalWidth - panelWidth);

    // Kill any existing ScrollTriggers first
    ScrollTrigger.getAll().forEach((trigger: unknown) => (trigger as { kill: () => void }).kill());

    // Set initial state without any transforms
    gsap.set([container, horizontal], {
      clearProps: 'all',
    });

    // Set proper dimensions
    gsap.set(horizontal, {
      width: totalWidth,
      x: 0,
    });

    // Ensure all panels are properly sized and prevent any scaling
    const panels = horizontal.children;
    Array.from(panels).forEach(panel => {
      gsap!.set(panel, {
        width: panelWidth,
        height: '100vh',
        scale: 1,
        opacity: 1,
        clearProps: 'transform',
      });
    });

    // Calculate snap positions
    const snapPoints: number[] = [];
    const totalTranslateDistance = Math.abs(maxTranslate);

    for (let i = 0; i < totalPanels; i++) {
      const targetX = -i * panelWidth;
      const progress = Math.abs(targetX) / totalTranslateDistance;
      snapPoints.push(progress);
    }

    // Create ScrollTrigger with proper boundaries
    if (gsap && ScrollTrigger) {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${totalPanels * window.innerHeight}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.3, max: 0.7 },
          delay: 0.1,
          ease: 'power2.out',
          directional: false,
        },
        animation: gsap!.to(horizontal, {
          x: maxTranslate,
          ease: 'none',
        }),
        onUpdate: () => {
          let currentX = 0;
          currentX = gsap!.getProperty(horizontal, 'x') as number;
          const expectedPanel = Math.round(Math.abs(currentX) / panelWidth);
          if (expectedPanel >= 0 && expectedPanel < totalPanels) {
            setCurrentPanel(expectedPanel);
          }
          Array.from(panels).forEach(panel => {
            gsap!.set(panel, {
              scale: 1,
              opacity: 1,
              force3D: false,
            });
          });
        },
        onRefresh: () => {
          const newPanelWidth = window.innerWidth;
          const newTotalWidth = totalPanels * newPanelWidth;
          gsap!.set(horizontal, { width: newTotalWidth });
          Array.from(panels).forEach(panel => {
            gsap!.set(panel, {
              width: newPanelWidth,
              scale: 1,
              opacity: 1,
            });
          });
        },
      });
    }

    // Style enforcement for desktop only
    let rafId: number;
    const enforceStyles = () => {
      if ((ScrollTrigger as unknown as { isActive: boolean }).isActive) {
        Array.from(panels).forEach(panel => {
          const element = panel as HTMLElement;
          element.style.transform = 'none';
          element.style.opacity = '1';
          element.style.scale = 'none';
        });
      }
      rafId = requestAnimationFrame(enforceStyles);
    };
    rafId = requestAnimationFrame(enforceStyles);

    // Cleanup
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: unknown) =>
          (trigger as { kill: () => void }).kill()
        );
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      setCurrentPanel(0);
    };
  }, [experiences.length, isMobile, isClient, gsapReady]);

  // Function to navigate to a specific panel
  const navigateToPanel = (panelIndex: number) => {
    if (isMobile) {
      // Simple mobile navigation - just scroll to section
      const sectionHeight = window.innerHeight;
      const targetY = panelIndex * sectionHeight;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      setCurrentPanel(panelIndex);
      return;
    }

    // Desktop GSAP navigation
    if (!gsap || !horizontalRef.current) return;

    const panelWidth = window.innerWidth;
    const targetX = -panelIndex * panelWidth;

    gsap.to(horizontalRef.current, {
      x: targetX,
      duration: 1,
      ease: 'power2.out',
    });

    setCurrentPanel(panelIndex);
  };

  const getCompanyTheme = (company: string) => {
    const themeKey = Object.keys(companyThemes).find(key =>
      company.toLowerCase().includes(key.toLowerCase())
    );
    return themeKey ? companyThemes[themeKey] : companyThemes['T-Systems'];
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Desktop Version - Complex GSAP Animation */}
      {!isMobile && (
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            ref={horizontalRef}
            className="flex"
            style={{
              height: '100vh',
              width: 'fit-content',
            }}
          >
            {/* Redesigned Intro Panel */}
            <div
              className="flex items-center justify-center relative overflow-hidden"
              style={{
                width: '100vw',
                height: '100vh',
                minWidth: '100vw',
                flexShrink: 0,
              }}
            >
              {/* Modern Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent"></div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
                <div className="space-y-12 mb-16">
                  <div className="space-y-8">
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-tight">
                      {t('title')}
                    </h1>

                    <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>

                    <p className="text-2xl lg:text-3xl text-gray-200 font-light max-w-4xl mx-auto leading-relaxed">
                      {t('subtitle')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-6 mb-16">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <a href="mailto:info@manu-web.de">
                      <Mail className="mr-3 h-5 w-5" />
                      Get In Touch
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
                      GitHub
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
                      LinkedIn
                    </a>
                  </Button>
                </div>

                {/* Scroll Indicator */}
                <div className="pt-8">
                  <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto relative">
                    <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Scroll to continue</p>
                </div>
              </div>
            </div>

            {/* Experience Panels */}
            {experiences.map((exp, index) => {
              const theme = getCompanyTheme(exp.company);
              const isSecret = exp.company.toLowerCase().includes('syndikat7');

              return (
                <div
                  key={index}
                  className={`flex items-center justify-center relative ${theme.background}`}
                  style={{
                    width: '100vw',
                    height: '100vh',
                    minWidth: '100vw',
                    flexShrink: 0,
                  }}
                >
                  <div className={`absolute inset-0 ${theme.pattern}`} />

                  <div className="max-w-4xl w-full relative z-10 px-8">
                    <div className="text-center space-y-8">
                      <div className="space-y-6">
                        <span
                          className={`text-sm font-medium px-4 py-2 rounded-full inline-block ${theme.cardBg} ${theme.textColor} ${theme.borderColor}`}
                        >
                          {exp.date}
                        </span>
                        <h3
                          className={`text-5xl lg:text-7xl font-display font-bold leading-tight ${theme.textColor}`}
                        >
                          {exp.title}
                        </h3>
                        <p className={`text-3xl lg:text-4xl font-semibold ${theme.accentColor}`}>
                          {exp.company}
                        </p>
                      </div>

                      {!isSecret && (
                        <div className="mt-12">
                          <p
                            className={`text-xl ${theme.textColor} leading-relaxed max-w-3xl mx-auto opacity-90`}
                          >
                            {exp.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Version - Simple Vertical Layout */}
      {isMobile && (
        <div ref={containerRef} className="min-h-screen">
          {/* Mobile Intro Section */}
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 text-center px-6 py-20">
              <div className="space-y-8 mb-12">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {t('title')}
                </h1>

                <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>

                <p className="text-lg sm:text-xl text-gray-200 font-light leading-relaxed">
                  {t('subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-3 font-semibold shadow-xl"
                  asChild
                >
                  <a href="mailto:info@manu-web.de">
                    <Mail className="mr-2 h-4 w-4" />
                    Get In Touch
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-400 text-gray-200 hover:bg-white hover:text-gray-900 px-6 py-3 font-semibold"
                  asChild
                >
                  <a href="https://github.com/manusmd" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Experience Cards */}
          {experiences.map((exp, index) => {
            const theme = getCompanyTheme(exp.company);
            const isSecret = exp.company.toLowerCase().includes('syndikat7');

            return (
              <div
                key={index}
                className={`min-h-screen flex items-center justify-center ${theme.background} relative`}
              >
                <div className={`absolute inset-0 ${theme.pattern}`} />

                <div className="relative z-10 px-6 py-20 text-center max-w-lg mx-auto">
                  <div className="space-y-6">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${theme.cardBg} ${theme.textColor} ${theme.borderColor}`}
                    >
                      {exp.date}
                    </span>
                    <h3
                      className={`text-3xl sm:text-4xl font-bold leading-tight ${theme.textColor}`}
                    >
                      {exp.title}
                    </h3>
                    <p className={`text-xl sm:text-2xl font-semibold ${theme.accentColor}`}>
                      {exp.company}
                    </p>

                    {!isSecret && (
                      <div className="mt-8">
                        <p className={`text-base ${theme.textColor} leading-relaxed opacity-90`}>
                          {exp.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop Navigation - Only show when Timeline section is in view */}
      {!isMobile && isInView && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            <div className="bg-black/95 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-600/30 shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/20 hover:border-gray-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4">
                  {/* About Me section */}
                  <div className="flex flex-col items-center space-y-1 group">
                    <div className="relative">
                      <button
                        onClick={() => navigateToPanel(0)}
                        className={`relative w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                          currentPanel === 0
                            ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50 scale-110'
                            : 'bg-gray-500 hover:bg-gray-400 hover:shadow-md hover:shadow-gray-400/30'
                        }`}
                        title="About Me"
                      >
                        {currentPanel === 0 && (
                          <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping"></div>
                        )}
                        <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                      </button>
                    </div>
                    <span
                      className={`text-[10px] font-medium transition-all duration-300 ${
                        currentPanel === 0
                          ? 'text-blue-300 font-semibold transform scale-105'
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    >
                      About
                    </span>
                  </div>

                  <div className="relative h-px w-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500"></div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 ${
                        currentPanel > 0 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                    ></div>
                  </div>

                  {/* Company panels */}
                  {experiences.map((exp, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex flex-col items-center space-y-1 group">
                        <div className="relative">
                          <button
                            onClick={() => navigateToPanel(index + 1)}
                            className={`relative w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                              currentPanel === index + 1
                                ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50 scale-110'
                                : 'bg-gray-500 hover:bg-gray-400 hover:shadow-md hover:shadow-gray-400/30'
                            }`}
                            title={exp.company}
                          >
                            {currentPanel === index + 1 && (
                              <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping"></div>
                            )}
                            <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>

                            {currentPanel === index + 1 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </button>
                        </div>
                        <span
                          className={`text-[10px] font-medium transition-all duration-300 whitespace-nowrap ${
                            currentPanel === index + 1
                              ? 'text-blue-300 font-semibold transform scale-105'
                              : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                        >
                          {exp.company.split(' ')[0]}
                        </span>
                      </div>

                      {index < experiences.length - 1 && (
                        <div className="relative h-px w-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500"></div>
                          <div
                            className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 delay-${(index + 1) * 100} ${
                              currentPanel > index + 1
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0'
                            }`}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-center">
                  <div className="relative h-1 w-24 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800"></div>

                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-blue-400/30"
                      style={{
                        width: `${((currentPanel + 1) / (experiences.length + 1)) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
                    </div>

                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg transition-all duration-700 ease-out"
                      style={{
                        left: `calc(${((currentPanel + 1) / (experiences.length + 1)) * 100}% - 4px)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <div className="relative overflow-hidden">
                    <span className="inline-block text-xs text-gray-200 font-semibold transition-all duration-500 transform">
                      {currentPanel === 0
                        ? 'About Me'
                        : `${experiences[currentPanel - 1]?.company || ''}`}
                    </span>
                    {currentPanel > 0 && (
                      <span className="text-[10px] text-gray-400 ml-1 transition-all duration-500">
                        • {experiences[currentPanel - 1]?.date || ''}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex justify-center">
                    <div className="h-0.5 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 transform scale-x-100 opacity-100"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-blue-400/30 rounded-full animate-ping"
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${15 + (i % 2) * 70}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: '3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
