import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import StaggeredMenu from '@/components/StaggeredMenu';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sponge Global | Learning & Capability Partner',
  description: 'Sponge Global is a trusted learning partner building stronger leaders and teams for 200+ clients worldwide through expert facilitation and transformational training.',
  keywords: ['corporate training', 'leadership development', 'organizational capability', 'Sponge Global', 'transformational learning', 'employee training'],
  icons: {
    icon: '/sponge-favicon.png',
    shortcut: '/sponge-favicon.png',
    apple: '/sponge-favicon.png',
  },
  openGraph: {
    title: 'Sponge Global | Learning & Capability Partner',
    description: 'Practical learning solutions for organizations across industries and countries.',
    url: 'https://sponge-global.com',
    siteName: 'Sponge Global',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponge Global | Learning & Capability Partner',
    description: 'Building stronger leaders and teams for 200+ clients worldwide.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${inter.className} ${inter.variable}`}>
        <SmoothScroll>
          <StaggeredMenu isFixed={true} menuButtonColor="#ffffff" />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
