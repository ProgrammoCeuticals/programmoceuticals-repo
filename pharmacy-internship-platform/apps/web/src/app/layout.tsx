import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | PharmIntern NG',
    default: 'PharmIntern NG — Pharmacy Internship Platform',
  },
  description:
    'Connect pharmacy graduates with verified internship centres across Nigeria.',
  // Note: platform is not affiliated with, endorsed by, or operated by the PCN.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-brand-gray-dark antialiased">
        {children}
      </body>
    </html>
  );
}
