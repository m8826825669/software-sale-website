import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import NavigationProgress from '@/components/NavigationProgress'

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://softcraft.in'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SoftCraft Solutions — Professional Desktop Software for India',
    template: '%s | SoftCraft Solutions',
  },
  description:
    'Premium offline-first desktop software for schools, clinics, medical stores, and businesses. One-time purchase, lifetime license. GST-compliant, Razorpay payments, built for India.',
  keywords: [
    'school management software India',
    'clinic management software',
    'medical store software India',
    'ERP software India',
    'offline desktop software',
    'GST billing software',
    'school ERP',
    'pharmacy management software',
    'accounting software India',
    'JavaFX application',
    'Spring Boot desktop app',
  ],
  authors: [{ name: 'SoftCraft Solutions', url: SITE_URL }],
  creator: 'SoftCraft Solutions',
  publisher: 'SoftCraft Solutions',
  formatDetection: { email: false, address: false, telephone: false },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'SoftCraft Solutions',
    title: 'SoftCraft Solutions — Professional Desktop Software for India',
    description:
      'Offline-first ERP software for schools, clinics, and businesses. One-time purchase. No subscriptions. Built for India.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SoftCraft Solutions — Desktop Software for India',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'SoftCraft Solutions — Professional Desktop Software',
    description: 'Offline-first ERP software for Indian schools, clinics, and businesses.',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@SoftCraftIn',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  alternates: { canonical: SITE_URL },

  verification: {
    // google: 'your-google-site-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
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
      className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="bg-surface-950 text-white antialiased min-h-screen">
        {/* Navigation progress bar — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>

        {children}

        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0e0f1e',
              color: '#e8eaf6',
              border: '1px solid rgba(90,95,255,0.25)',
              borderRadius: '12px',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#5a5fff', secondary: '#080916' },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: '#f44336', secondary: '#080916' },
              duration: 5000,
            },
          }}
        />
      </body>
    </html>
  )
}
