import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { title: 'FX Pro Travel Gold', description: 'An intelligent travel companion with currency, nearby places, phrases, events and a situational travel feed.', manifest: '/manifest.json', appleWebApp: { capable: true, title: 'FX Pro', statusBarStyle: 'black-translucent' } };
export const viewport: Viewport = { themeColor: '#020617', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={inter.className}>{children}</body></html>; }
