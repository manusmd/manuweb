import { useMediaQuery } from './useMediaQuery';

export const useAnimationVariants = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Reduce animations for users who prefer reduced motion
  const getDistance = (desktop: number, mobile: number = desktop * 0.7) => {
    if (prefersReducedMotion) return 0;
    return isMobile ? mobile : desktop;
  };

  const getDuration = (desktop: number, mobile: number = desktop * 0.8) => {
    if (prefersReducedMotion) return 0;
    return isMobile ? mobile : desktop;
  };

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: getDistance(30, 20),
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: getDuration(0.6, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const fadeInDown = {
    hidden: {
      opacity: 0,
      y: getDistance(-30, -20),
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: getDuration(0.6, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const fadeInLeft = {
    hidden: {
      opacity: 0,
      x: getDistance(-50, -30),
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: getDuration(0.6, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const fadeInRight = {
    hidden: {
      opacity: 0,
      x: getDistance(50, 30),
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: getDuration(0.6, 0.4),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const scaleIn = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : isMobile ? 0.9 : 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: getDuration(0.5, 0.3),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const slideInUp = {
    hidden: {
      y: getDistance(100, 60),
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: getDuration(0.7, 0.5),
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: getDuration(0.1, 0.05),
        delayChildren: getDuration(0.1, 0.05),
      },
    },
  };

  const buttonHover = {
    scale: prefersReducedMotion ? 1 : isMobile ? 1.02 : 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  };

  const buttonTap = {
    scale: prefersReducedMotion ? 1 : 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  };

  const cardHover = {
    y: prefersReducedMotion ? 0 : isMobile ? -2 : -5,
    scale: prefersReducedMotion ? 1 : isMobile ? 1.01 : 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  };

  const floatingAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -10, 0],
        transition: {
          duration: isMobile ? 2 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  const glowPulse = prefersReducedMotion
    ? {}
    : {
        boxShadow: [
          '0 0 20px hsla(var(--accent-blue), 0.3)',
          '0 0 30px hsla(var(--accent-blue), 0.5)',
          '0 0 20px hsla(var(--accent-blue), 0.3)',
        ],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  return {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    slideInUp,
    stagger,
    buttonHover,
    buttonTap,
    cardHover,
    floatingAnimation,
    glowPulse,
    prefersReducedMotion,
    isMobile,
    isTablet,
  };
};
