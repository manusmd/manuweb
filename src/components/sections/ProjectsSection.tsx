'use client';

import { useTranslations } from 'next-intl';
import { AnimatedWrapper, StaggerContainer } from '@/components/animations';
import { motion } from 'framer-motion';
import type { Project } from '@/types/project';
import { FullscreenSection } from '@/components/layout/FullscreenSection';
import { Github, Star, Code2, Zap } from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { MQ } from '@/constants/breakpoints';
import { buildClubscanProject } from '@/data/projects';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ProjectsSection() {
  const t = useTranslations('projects');
  const tc = useTranslations('projects.clubscan');
  const isDesktop = useMediaQuery(MQ.desktop);

  const projects: Project[] = [
    buildClubscanProject({
      title: tc('title'),
      subtitle: tc('subtitle'),
      description: tc('description'),
      longDescription: tc('longDescription'),
    }),
  ];

  return (
    <FullscreenSection id="projects" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background"></div>

        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-muted-foreground/20"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 12}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              >
                {i % 3 === 0 ? (
                  <Code2 size={24} />
                ) : i % 3 === 1 ? (
                  <Zap size={20} />
                ) : (
                  <Star size={18} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>

      <AnimatedWrapper className="w-full relative z-10">
        <div className="w-full px-4 py-8 md:py-16">
          <StaggerContainer className="space-y-8 md:space-y-16">
            <motion.div
              className="text-center space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3 md:space-y-4">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Star className="w-3 h-3 md:w-4 md:h-4" />
                  {t('homeSection.featuredBadge')}
                </motion.div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  {t('title')}
                </h2>

                <div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                {t('subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="w-full max-w-6xl mx-auto px-2 md:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.title} project={project} delay={index * 0.1} />
              ))}
            </motion.div>

            <motion.div
              className="text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                {t('homeSection.moreProjects')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <motion.a
                  href="https://github.com/manusmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium text-sm md:text-base"
                  whileHover={{ scale: isDesktop ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4" />
                  {t('homeSection.viewAllGithub')}
                </motion.a>
                <motion.a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-border hover:bg-accent transition-colors font-medium text-sm md:text-base"
                  whileHover={{ scale: isDesktop ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('homeSection.getInTouch')}
                </motion.a>
              </div>
            </motion.div>
          </StaggerContainer>
        </div>
      </AnimatedWrapper>
    </FullscreenSection>
  );
}
