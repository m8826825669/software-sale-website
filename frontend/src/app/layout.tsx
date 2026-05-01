import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import NavigationProgress from '@/components/NavigationProgress'
import ToasterProvider from '@/components/ToasterProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vexenlabs.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vexen Labs — Professional Desktop Software for India',
    template: '%s | Vexen Labs',
  },
  description:
    'Premium offline-first desktop software for schools, clinics, medical stores, and businesses. One-time purchase, lifetime license. GST-compliant, built for India.',
  keywords: [
    'school management software India',
    'clinic management software',
    'medical store software India',
    'ERP software India',
    'offline desktop software',
    'GST billing software',
  ],
  authors: [{ name: 'Vexen Labs', url: SITE_URL }],
  creator: 'Vexen Labs',
  publisher: 'Vexen Labs',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Vexen Labs',
    title: 'Vexen Labs — Professional Desktop Software for India',
    description: 'Offline-first ERP software for schools, clinics, and businesses. One-time purchase. No subscriptions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vexen Labs — Professional Desktop Software',
    description: 'Offline-first ERP software for Indian schools, clinics, and businesses.',
    creator: '@VexenLabs',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#080916',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body
        className="bg-surface-950 text-white antialiased min-h-screen"
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>

        {children}

        <ToasterProvider />
      </body>
    </html>
  )
}