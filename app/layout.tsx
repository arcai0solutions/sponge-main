import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import GlobalLayoutWrapper from '@/components/GlobalLayoutWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Global defaults — individual pages override title, description, and OG.
// Do NOT add og:image or twitter:image here; each page sets its own.
export const metadata: Metadata = {
  metadataBase: new URL('https://sponge-global.com'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-32x32.png',
  },
  openGraph: {
    siteName: 'Sponge Global',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
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
        {/* noscript fallback for crawlers and users with JS disabled */}
        <noscript>
          <div style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#111', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Sponge Global — Learning &amp; Capability Partner</h1>
            <p>
              Sponge Global is a learning and capability partner building stronger leaders and teams
              for 200+ clients worldwide. We deliver corporate training, leadership development,
              eLearning, and talent solutions across industries and geographies.
            </p>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/clients">Our Clients</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </div>
        </noscript>
        <SmoothScroll>
          <GlobalLayoutWrapper>
            {children}
          </GlobalLayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
