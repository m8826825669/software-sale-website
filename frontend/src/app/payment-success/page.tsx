'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Key, Download, LayoutDashboard, ArrowRight, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const orderNumber  = searchParams.get('order')
  const productName  = searchParams.get('product') || 'Your Software'
  const licenseKey   = searchParams.get('key')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
    script.async = true
    const cleanup = (): void => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
    script.onload = () => {
      const c = (window as { confetti?: (opts: object) => void }).confetti
      if (!c) return
      setTimeout(() => {
        c({ particleCount: 60, spread: 70, origin: { y: 0.7 }, angle: 55,  colors: ['#5a5fff', '#f6c84b', '#34d399'] })
        c({ particleCount: 50, spread: 70, origin: { y: 0.7 }, angle: 125, colors: ['#5a5fff', '#f6c84b', '#f472b6'] })
        c({ particleCount: 80, spread: 70, origin: { y: 0.7 },             colors: ['#5a5fff', '#34d399', '#f6c84b'] })
      }, 200)
    }
    document.head.appendChild(script)
    return cleanup
  }, [])

  const copyKey = () => {
    if (!licenseKey) return
    navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (!orderNumber) {
    router.replace('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="card text-center py-14 px-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(52,211,153,0.1) 0%, transparent 70%)' }} />

            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="badge-green inline-block mb-4">Payment Confirmed</div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-3">
                🎉 You&apos;re all set!
              </h1>
              <p className="text-gray-400 text-lg mb-2">{productName}</p>
              <p className="text-sm text-gray-600 mb-8">Order #{orderNumber}</p>
            </motion.div>

            {licenseKey && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Your License Key</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <code className="font-mono text-base md:text-xl text-ink-300 bg-ink-950/80 px-5 py-3 rounded-2xl border border-ink-700/50 tracking-widest break-all">
                    {licenseKey}
                  </code>
                  <button onClick={copyKey}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      copied ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'glass-light hover:border-ink-500/40 text-gray-400'
                    }`}>
                    {copied ? '✓' : '⎘'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {copied ? '✓ Copied!' : 'Click to copy — also emailed to you'}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left"
            >
              {[
                { icon: Key,      step: '01', title: 'Key saved',      desc: 'License key is in your dashboard, always accessible.' },
                { icon: Download, step: '02', title: 'Download ready',  desc: 'Go to My Licenses and click Download to get the installer.' },
                { icon: Mail,     step: '03', title: 'Email sent',      desc: 'Check your inbox for receipt and install instructions.' },
              ].map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-ink-500">{step}</span>
                    <Icon className="w-4 h-4 text-ink-400" />
                    <span className="text-sm font-semibold text-white">{title}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/dashboard" className="btn-primary gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
              <Link href="/products" className="btn-secondary gap-2">
                Browse More <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <p className="text-xs text-gray-700 mt-6">
              Need help? Email{' '}
              <a href="mailto:support@softcraft.in" className="text-gray-600 hover:text-gray-400">support@softcraft.in</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  )
}