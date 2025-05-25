'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface BlogReadingState {
  hasReadFirstBlog: boolean;
  currentBlogProgress: number;
  readingStartTime: number | null;
  isReading: boolean;
  completedBlogs: string[];
}

interface BlogReadingDetectionReturn {
  hasReadFirstBlog: boolean;
  currentProgress: number;
  isReading: boolean;
  readingTime: number;
  markBlogAsRead: (slug: string) => void;
  resetReadingState: () => void;
}

const STORAGE_KEY = 'blog-reading-state';
const READING_THRESHOLD = 0.9; // Consider 90% as "read"

export function useBlogReadingDetection(): BlogReadingDetectionReturn {
  const pathname = usePathname();
  const [readingState, setReadingState] = useState<BlogReadingState>({
    hasReadFirstBlog: false,
    currentBlogProgress: 0,
    readingStartTime: null,
    isReading: false,
    completedBlogs: [],
  });

  const [readingTime, setReadingTime] = useState(0);
  const readingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredCompletion = useRef(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored);
          setReadingState(prev => ({
            ...prev,
            ...parsedState,
            readingStartTime: null, // Reset reading session
            isReading: false,
            currentBlogProgress: 0,
          }));
        }
      } catch (error) {
        console.warn('Failed to load blog reading state:', error);
      }
    }
  }, []);

  // Save state to localStorage - fixed to avoid infinite loop
  const saveState = useCallback((newState: Partial<BlogReadingState>) => {
    if (typeof window !== 'undefined') {
      try {
        setReadingState(prev => {
          const updatedState = { ...prev, ...newState };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
          return updatedState;
        });
      } catch (error) {
        console.warn('Failed to save blog reading state:', error);
      }
    }
  }, []); // Remove readingState dependency

  // Check if current page is a blog post
  const isBlogPost = pathname.includes('/blog/') && !pathname.endsWith('/blog');
  const currentSlug = isBlogPost ? pathname.split('/blog/')[1] : null;

  // Mark blog as read
  const markBlogAsRead = useCallback(
    (slug: string) => {
      if (readingIntervalRef.current) {
        clearInterval(readingIntervalRef.current);
        readingIntervalRef.current = null;
      }

      setReadingState(prev => {
        const newCompletedBlogs = [...prev.completedBlogs, slug];
        const isFirstBlog = prev.completedBlogs.length === 0;

        const updatedState = {
          ...prev,
          hasReadFirstBlog: isFirstBlog || prev.hasReadFirstBlog,
          completedBlogs: newCompletedBlogs,
          isReading: false,
          currentBlogProgress: 1,
        };

        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        } catch (error) {
          console.warn('Failed to save blog reading state:', error);
        }

        // Trigger custom events
        setTimeout(() => {
          if (isFirstBlog) {
            window.dispatchEvent(
              new CustomEvent('firstBlogCompleted', {
                detail: { slug, readingTime },
              })
            );
          }
          window.dispatchEvent(
            new CustomEvent('blogCompleted', {
              detail: { slug, readingTime, isFirstBlog },
            })
          );
        }, 0);

        return updatedState;
      });
    },
    [readingTime]
  );

  // Start reading session when entering a blog post
  useEffect(() => {
    if (isBlogPost && currentSlug && !readingState.completedBlogs.includes(currentSlug)) {
      const startTime = Date.now();
      saveState({
        readingStartTime: startTime,
        isReading: true,
        currentBlogProgress: 0,
      });

      hasTriggeredCompletion.current = false;
      setReadingTime(0);

      // Start reading time counter
      readingIntervalRef.current = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (readingIntervalRef.current) {
        clearInterval(readingIntervalRef.current);
        readingIntervalRef.current = null;
      }
    };
  }, [isBlogPost, currentSlug, readingState.completedBlogs, saveState]);

  // Track scroll progress
  useEffect(() => {
    if (!isBlogPost || !readingState.isReading) return;

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const progress = Math.min(1, Math.max(0, scrollPercent));

      setReadingState(prev => ({
        ...prev,
        currentBlogProgress: progress,
      }));

      // Check if blog is considered "read"
      if (
        progress >= READING_THRESHOLD &&
        currentSlug &&
        !readingState.completedBlogs.includes(currentSlug) &&
        !hasTriggeredCompletion.current
      ) {
        hasTriggeredCompletion.current = true;
        markBlogAsRead(currentSlug);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, [
    isBlogPost,
    readingState.isReading,
    currentSlug,
    readingState.completedBlogs,
    markBlogAsRead,
  ]);

  // Reset reading state (for testing/debugging)
  const resetReadingState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setReadingState({
        hasReadFirstBlog: false,
        currentBlogProgress: 0,
        readingStartTime: null,
        isReading: false,
        completedBlogs: [],
      });
      setReadingTime(0);
      hasTriggeredCompletion.current = false;
    }
  }, []);

  return {
    hasReadFirstBlog: readingState.hasReadFirstBlog,
    currentProgress: readingState.currentBlogProgress,
    isReading: readingState.isReading,
    readingTime,
    markBlogAsRead,
    resetReadingState,
  };
}
