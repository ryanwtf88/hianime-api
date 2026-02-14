import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HiAnime API Documentation',
  description:
    'Comprehensive documentation for the HiAnime API - Scrape anime data, episodes, streaming links, and more',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'HiAnime API Documentation',
    description: 'Comprehensive documentation for the HiAnime API',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 w-full lg:ml-64">
            {/* Mobile: account for hamburger button */}
            <div className="pt-16 lg:pt-0 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10">
              <div className="max-w-4xl mx-auto w-full">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
