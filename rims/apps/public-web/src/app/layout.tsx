import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { apiFetch } from '@/lib/api';

interface SiteInfo {
  name?: string;
  defaultLocale?: string;
  branding?: {
    tagline?: string | null;
    copyrightStatement?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    address?: string | null;
    socialLinksJson?: Record<string, string> | null;
  } | null;
}

export const metadata: Metadata = {
  title: {
    default: 'Research Institute',
    template: '%s | Research Institute',
  },
  description: 'A multidisciplinary research institution advancing pharmaceutical science, regulatory knowledge, and global health outcomes.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteInfo = await apiFetch<SiteInfo>('');
  const lang = siteInfo?.defaultLocale ?? 'en';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-slate-800 font-sans antialiased">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer branding={siteInfo?.branding} />
      </body>
    </html>
  );
}
