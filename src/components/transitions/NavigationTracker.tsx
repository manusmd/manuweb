'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function NavigationTracker() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = pathname;
      const previousPath = previousPathRef.current;

      // If we're navigating TO a blog page, store where we came FROM
      if (currentPath.includes('/blog/') && previousPath && !previousPath.includes('/blog/')) {
        localStorage.setItem('previousPath', previousPath);
      }
      // If we're navigating TO the blog listing page, store where we came FROM
      else if (currentPath.endsWith('/blog') && previousPath && !previousPath.endsWith('/blog')) {
        localStorage.setItem('previousPath', previousPath);
      }

      // Update the previous path for next navigation
      previousPathRef.current = currentPath;
    }
  }, [pathname]);

  return null;
}
