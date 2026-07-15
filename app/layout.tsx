import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from './components/Navbar';
import '@/app/api/cron/init/route';
import SearchBar from './components/SearchBar';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Mini-Project | Premium Profile & Map Dashboard',
  description: 'Manage your profile details, locate addresses via autocomplete on interactive maps, and purchase premium subscription plans.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
        <Providers>
          <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 bg-grid-pattern">
            <Navbar />
            <SearchBar />
            <div className="flex-1 flex flex-col">
              
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
