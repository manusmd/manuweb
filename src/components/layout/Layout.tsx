import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProgress } from '@/components/scroll/ScrollProgress';
import { PageTransition } from '@/components/transitions/PageTransition';
import { NavigationTracker } from '@/components/transitions/NavigationTracker';
import { FirstBlogNotification } from '@/components/easter-eggs/FirstBlogNotification';
import { SimpleEasterEggs } from '@/components/easter-eggs/SimpleEasterEggs';
import { PersistentGameButton } from '@/components/easter-eggs/PersistentGameButton';
import { BugHuntGame } from '@/components/easter-eggs/BugHuntGame';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <NavigationTracker />
        <Header />
        <ScrollProgress />
        <main className="relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <FirstBlogNotification />
        <SimpleEasterEggs />
        <PersistentGameButton />
        <BugHuntGame />
      </div>
    </ThemeProvider>
  );
}
