'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

function restoreNativeScrollProxy(): void {
  void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && typeof value === 'number') {
            window.scrollTo(0, value);
          }
          return window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });
      ScrollTrigger.refresh();
    }
  );
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<InstanceType<(typeof import('lenis'))['default']> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let disposed = false;
    let tickerFn: ((time: number) => void) | null = null;
    let onResize: (() => void) | undefined;
    let onPageshowSync: (() => void) | undefined;

    const setup = async () => {
      const [{ default: LenisCtor }, gsapMod, stMod] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (disposed) return;

      const gsapLib = gsapMod.gsap;
      const ScrollTriggerLib = stMod.ScrollTrigger;
      gsapLib.registerPlugin(ScrollTriggerLib);

      const lenis = new LenisCtor({
        lerp: 0.09,
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      window.__lenis = lenis;

      const syncLenisFromNativeScroll = () => {
        const nativeScroll =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        if (Math.abs(lenis.scroll - nativeScroll) > 1) {
          lenis.scrollTo(nativeScroll, { immediate: true });
        }
        ScrollTriggerLib.update();
      };

      syncLenisFromNativeScroll();
      requestAnimationFrame(syncLenisFromNativeScroll);
      requestAnimationFrame(() => requestAnimationFrame(syncLenisFromNativeScroll));
      window.addEventListener('load', syncLenisFromNativeScroll, { once: true });
      onPageshowSync = syncLenisFromNativeScroll;
      window.addEventListener('pageshow', syncLenisFromNativeScroll);

      ScrollTriggerLib.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && typeof value === 'number') {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: 'transform',
      });

      lenis.on('scroll', () => {
        ScrollTriggerLib.update();
        window.dispatchEvent(new Event('scroll'));
      });

      tickerFn = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsapLib.ticker.add(tickerFn);
      gsapLib.ticker.lagSmoothing(0);

      onResize = () => {
        lenis.resize();
        ScrollTriggerLib.refresh();
      };
      window.addEventListener('resize', onResize);
      onResize();
    };

    void setup();

    return () => {
      disposed = true;
      if (onPageshowSync) {
        window.removeEventListener('pageshow', onPageshowSync);
      }
      if (onResize) {
        window.removeEventListener('resize', onResize);
      }
      void import('gsap').then(({ gsap }) => {
        if (tickerFn) {
          gsap.ticker.remove(tickerFn);
        }
      });
      lenisRef.current?.destroy();
      lenisRef.current = null;
      delete window.__lenis;
      restoreNativeScrollProxy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = requestAnimationFrame(() => {
      lenisRef.current?.resize();
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
        ([{ gsap }, { ScrollTrigger }]) => {
          gsap.registerPlugin(ScrollTrigger);
          ScrollTrigger.refresh();
        }
      );
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
