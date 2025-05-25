import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

const calSans = localFont({
  src: '../../node_modules/cal-sans/fonts/webfonts/CalSans-SemiBold.woff2',
  variable: '--font-display',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.className, calSans.variable)}>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>{children}</body>
    </html>
  );
}
