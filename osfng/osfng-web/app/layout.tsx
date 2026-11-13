import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://osfng.org'),
  title: {
    default:  'Operation Smile Foundation Nigeria | Empowering Communities',
    template: '%s | Operation Smile Foundation Nigeria',
  },
  description:
    'Operation Smile Foundation Nigeria provides savings, loans and development programmes to empower women, youth and underserved communities in Owerri and across Nigeria.',
  keywords: [
    'microfinance Nigeria', 'savings account Owerri', 'loans for women Nigeria',
    'youth empowerment Nigeria', 'Operation Smile Foundation', 'OSFNG',
    'poverty alleviation Nigeria', 'financial inclusion Imo State',
  ],
  openGraph: {
    type:     'website',
    locale:   'en_NG',
    url:      'https://osfng.org',
    siteName: 'Operation Smile Foundation Nigeria',
    title:    'Operation Smile Foundation Nigeria | Empowering Communities',
    description: 'Savings, loans and development programmes for underserved communities in Nigeria.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type':    ['NGO', 'LocalBusiness'],
              name:        'Operation Smile Foundation Nigeria',
              alternateName: 'OSFNG',
              description: 'Developmental organisation working to alleviate poverty through financial and non-financial programmes for disadvantaged groups in Nigeria.',
              url:         'https://osfng.org',
              email:       'support@osfng.org',
              telephone:   '+234-913-997-3419',
              foundingDate:'2020',
              address: {
                '@type':         'PostalAddress',
                streetAddress:   '132 Wetheral Road',
                addressLocality: 'Owerri',
                addressRegion:   'Imo State',
                addressCountry:  'NG',
              },
            }),
          }}
        />
      </head>
      <body className="bg-bg-base text-text-primary antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
