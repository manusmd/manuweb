import { Header } from './Header';
import { Footer } from './Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScrollProgress } from '@/components/scroll/ScrollProgress';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <ScrollProgress />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
