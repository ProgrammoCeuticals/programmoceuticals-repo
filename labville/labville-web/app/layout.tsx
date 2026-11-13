import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://labvillediagnostic.com'),
  title: {
    default: 'Labville Diagnostic Centre | Precision Diagnostics in Lagos',
    template: '%s | Labville Diagnostic Centre',
  },
  description:
    'Advanced laboratory diagnostics, medical imaging, health screening and specialized testing at Labville Diagnostic Centre, Ikorodu, Lagos. Accurate results, compassionate care.',
  keywords: [
    'diagnostic centre Lagos',
    'laboratory testing Ikorodu',
    'blood test Lagos',
    'medical imaging Lagos',
    'health screening Lagos',
    'CT scan Ikorodu',
    'ultrasound Lagos',
    'home sample collection Lagos',
  ],
  authors: [{ name: 'Labville Diagnostic Centre' }],
  creator: 'Labville Diagnostic Centre',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://labvillediagnostic.com',
    siteName: 'Labville Diagnostic Centre',
    title: 'Labville Diagnostic Centre | Precision Diagnostics in Lagos',
    description:
      'Advanced laboratory diagnostics, medical imaging and health screening in Ikorodu, Lagos.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Labville Diagnostic Centre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Labville Diagnostic Centre',
    description: 'Precision diagnostics, imaging and health screening in Lagos.',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured data — Organization / LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['MedicalOrganization', 'LocalBusiness'],
              name: 'Labville Diagnostic Centre',
              description:
                'Advanced diagnostic services including laboratory testing, medical imaging, health screening and specialized diagnostics.',
              url: 'https://labvillediagnostic.com',
              telephone: '07034888629',
              email: 'enquiries@labvillediagnostic.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress:
                  'No 10, AMUSA Arowolo Street, off Muniratu Alaje Street, Behind BRT Bus Terminal, Ikorodu Garage',
                addressLocality: 'Ikorodu',
                addressRegion: 'Lagos',
                addressCountry: 'NG',
              },
              geo: {
                '@type': 'GeoCoordinates',
                // Placeholder — update with verified coordinates
                latitude: '6.6018',
                longitude: '3.5007',
              },
              medicalSpecialty: [
                'Pathology',
                'Radiology',
                'Preventive Medicine',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-bg-primary text-white antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
