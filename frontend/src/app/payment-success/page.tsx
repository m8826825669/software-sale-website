'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Key, Download, LayoutDashboard, ArrowRight, Mail, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import confetti from 'canvas-confetti'

// Minimal confetti — loaded inline to avoid npm dep
declare const confetti: any

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const orderNumber  = searchParams.get('order')
  const productName  = searchParams.get('product') || 'Your Software'
  const licenseKey   = searchParams.get('key')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Trigger confetti on mount
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
    script.onload = () => {
      const fire = (w: number, opts: any) =>
        (window as any).confetti?.({
          ...opts, particleCount: Math.floor(200 * w), spread: 70 * w,
          colors: ['#5a5fff', '#f6c84b', '#34d399', '#f472b6'],
        })
      setTimeout(() => {
        fire(0.25, { origin: { y: 0.7 }, angle: 55 })
        fire(0.2,  { origin: { y: 0.7 }, angle: 125 })
        fire(0.35, { origin: { y: 0.7 } })
      }, 200)
    }
    document.head.appendChild(script)
    return () => document.head.removeChild(script)
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

          {/* Success card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="card text-center py-14 px-8 relative overflow-hidden"
          >
            {/* BG glow */}
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
                🎉 You're all set!
              </h1>
              <p className="text-gray-400 text-lg mb-2">{productName}</p>
              <p className="text-sm text-gray-600 mb-8">Order #{orderNumber}</p>
            </motion.div>

            {/* License key display */}
            {licenseKey && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Your License Key</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="font-mono text-lg md:text-xl text-ink-300 bg-ink-950/80 px-5 py-3 rounded-2xl border border-ink-700/50 tracking-widest">
                    {licenseKey}
                  </code>
                  <button onClick={copyKey}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      copied ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'glass-light hover:border-ink-500/40 text-gray-400'
                    }`}>
                    {copied ? '✓' : '⎘'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {copied ? '✓ Copied to clipboard!' : 'Click to copy — also emailed to you'}
                </p>
              </motion.div>
            )}

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left"
            >
              {[
                { icon: Key,      step: '01', title: 'Key saved',      desc: 'Your license key is in your dashboard, always accessible.' },
                { icon: Download, step: '02', title: 'Download ready',  desc: 'Click Download in My Licenses to get the installer.' },
                { icon: Mail,     step: '03', title: 'Email sent',      desc: 'Check your inbox for receipt + install instructions.' },
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

            {/* CTAs */}
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
              Need help? Email <a href="mailto:support@softcraft.in" className="text-gray-600 hover:text-gray-400">support@softcraft.in</a> or WhatsApp +91 98765 43210
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
