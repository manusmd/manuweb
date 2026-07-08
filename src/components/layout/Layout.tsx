'use client';

import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollProgress } from '@/components/scroll/ScrollProgress';
import { SmoothScroll } from '@/components/scroll/SmoothScroll';
import { BlogTransitionProvider } from '@/components/transitions/BlogTransitionProvider';
import { PageTransition } from '@/components/transitions/PageTransition';
import { NavigationTracker } from '@/components/transitions/NavigationTracker';
import { FirstBlogNotification } from '@/components/easter-eggs/FirstBlogNotification';
import { SimpleEasterEggs } from '@/components/easter-eggs/SimpleEasterEggs';
import { PersistentGameButton } from '@/components/easter-eggs/PersistentGameButton';
import { BugHuntGame } from '@/components/easter-eggs/BugHuntGame';
import type {
  HeaderFeaturedProject,
  HeaderPostPreview,
} from '@/components/layout/headerNavPreview.types';

interface LayoutProps {
  children: React.ReactNode;
  latestPosts?: HeaderPostPreview[];
  featuredProject?: HeaderFeaturedProject;
}

export function Layout({ children, latestPosts, featuredProject }: LayoutProps) {
  return (
    <BlogTransitionProvider>
      <SmoothScroll>
        <div className="relative min-h-screen bg-background text-foreground">
          <NavigationTracker />
          <Header latestPosts={latestPosts} featuredProject={featuredProject} />
          <ScrollProgress />
          <main className="relative pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <FirstBlogNotification />
          <SimpleEasterEggs />
          <PersistentGameButton />
          <BugHuntGame />
        </div>
      </SmoothScroll>
    </BlogTransitionProvider>
  );
}
