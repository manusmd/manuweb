import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProgress } from '@/components/scroll/ScrollProgress';
import { PageTransition } from '@/components/transitions/PageTransition';
import { NavigationTracker } from '@/components/transitions/NavigationTracker';

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
        <PageTransition>
          <main className="relative">{children}</main>
        </PageTransition>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
