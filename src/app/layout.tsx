import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

const calSans = localFont({
  src: '../../node_modules/cal-sans/fonts/webfonts/CalSans-SemiBold.woff2',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'Manuel Schmid - Fullstack Developer',
    template: '%s | Manuel Schmid',
  },
  description:
    'Building modern web applications with a focus on exceptional user experiences and cutting-edge technologies. Fullstack Developer specializing in React, Next.js, and modern web development.',
  keywords: [
    'Manuel Schmid',
    'Fullstack Developer',
    'Web Developer',
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Frontend',
    'Backend',
    'Portfolio',
    'Web Development',
    'Software Engineer',
  ],
  authors: [{ name: 'Manuel Schmid', url: 'https://manu-web.de' }],
  creator: 'Manuel Schmid',
  publisher: 'Manuel Schmid',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://manu-web.de'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'de-DE': '/de',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://manu-web.de',
    title: 'Manuel Schmid - Fullstack Developer',
    description:
      'Building modern web applications with a focus on exceptional user experiences and cutting-edge technologies.',
    siteName: 'Manuel Schmid Portfolio',
    images: [
      {
        url: '/manu.png',
        width: 1200,
        height: 630,
        alt: 'Manuel Schmid - Fullstack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manuel Schmid - Fullstack Developer',
    description:
      'Building modern web applications with a focus on exceptional user experiences and cutting-edge technologies.',
    images: ['/manu.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.png',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
  category: 'technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.className, calSans.variable)}>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
