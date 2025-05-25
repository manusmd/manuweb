'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
              console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
            }
            break;
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            console.log(`🖼️ Largest Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
            break;
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime;
            console.log(`⚡ First Input Delay: ${metrics.fid?.toFixed(2)}ms`);
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
              console.log(`📐 Cumulative Layout Shift: ${metrics.cls?.toFixed(4)}`);
            }
            break;
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
            console.log(`🌐 Time to First Byte: ${metrics.ttfb.toFixed(2)}ms`);
            break;
        }
      }
    });

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['paint'] });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      observer.observe({ entryTypes: ['first-input'] });
      observer.observe({ entryTypes: ['layout-shift'] });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance Observer not fully supported:', error);
    }

    // Monitor bundle sizes and loading performance
    const logBundleInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        console.log(`📶 Network: ${connection.effectiveType} (${connection.downlink}Mbps)`);
      }

      // Log resource loading times
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      console.log(`📦 JS Resources: ${jsResources.length} files`);
      console.log(`🎨 CSS Resources: ${cssResources.length} files`);
      
      // Find largest resources
      const largestJS = jsResources.sort((a, b) => b.transferSize - a.transferSize)[0];
      const largestCSS = cssResources.sort((a, b) => b.transferSize - a.transferSize)[0];
      
      if (largestJS) {
        console.log(`📦 Largest JS: ${(largestJS.transferSize / 1024).toFixed(2)}KB - ${largestJS.name.split('/').pop()}`);
      }
      if (largestCSS) {
        console.log(`🎨 Largest CSS: ${(largestCSS.transferSize / 1024).toFixed(2)}KB - ${largestCSS.name.split('/').pop()}`);
      }
    };

    // Log bundle info after page load
    if (document.readyState === 'complete') {
      logBundleInfo();
    } else {
      window.addEventListener('load', logBundleInfo);
    }

    // Performance recommendations
    const logRecommendations = () => {
      console.group('🚀 Performance Recommendations');
      
      if (metrics.fcp && metrics.fcp > 2000) {
        console.warn('⚠️ First Contentful Paint is slow (>2s). Consider optimizing critical resources.');
      }
      
      if (metrics.lcp && metrics.lcp > 2500) {
        console.warn('⚠️ Largest Contentful Paint is slow (>2.5s). Optimize images and critical resources.');
      }
      
      if (metrics.fid && metrics.fid > 100) {
        console.warn('⚠️ First Input Delay is high (>100ms). Consider code splitting and reducing main thread work.');
      }
      
      if (metrics.cls && metrics.cls > 0.1) {
        console.warn('⚠️ Cumulative Layout Shift is high (>0.1). Add size attributes to images and reserve space for dynamic content.');
      }
      
      console.groupEnd();
    };

    // Log recommendations after a delay to collect metrics
    setTimeout(logRecommendations, 5000);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', logBundleInfo);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 