'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Shield, Download, Zap, Star, CheckCircle2, ChevronDown,
         ArrowRight, Users, Award, Globe, Lock, Cpu, HeadphonesIcon, ChevronUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { productsAPI } from '@/lib/api'

/* ── Animated counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const FEATURES = [
  { icon: Shield,  title: 'Bank-Grade Security', desc: 'AES-256 encryption, JWT auth, signed download tokens. Your data never leaves your server.' },
  { icon: Zap,     title: 'Offline First', desc: 'Works completely without internet. No monthly subscriptions. One-time purchase, lifetime use.' },
  { icon: Cpu,     title: 'Desktop Native', desc: 'Built with Spring Boot + JavaFX — fast, native performance on Windows, macOS, and Linux.' },
  { icon: Download,title: 'Instant Delivery', desc: 'Pay once, get a license key immediately and a secure download link in your dashboard.' },
  { icon: Globe,   title: 'India Ready', desc: 'GST compliant, Razorpay payments, Hindi UI support, Indian date/currency formats built in.' },
  { icon: HeadphonesIcon, title: 'Priority Support', desc: 'Email and WhatsApp support from our India-based team. Free updates for 1 year.' },
]

const PRODUCTS_PREVIEW = [
  { id: '1', slug: 'school-erp',     name: 'School ERP',      emoji: '🏫', tagline: 'Complete school management: admissions, attendance, fees, exams, library, and more.', tags: ['Students', 'Attendance', 'Fees', 'Library'], price: '₹4,999', is_featured: false, demo_type: 'request' as const },
  { id: '2', slug: 'clinic-manager', name: 'Clinic Manager',  emoji: '🏥', tagline: 'Patient records, SOAP notes, prescriptions, appointment scheduling, and billing.',     tags: ['OPD', 'ABHA', 'Billing', 'WhatsApp'],      price: '₹7,999', is_featured: true,  demo_type: 'request' as const },
  { id: '3', slug: 'medical-store',  name: 'Medical Store',   emoji: '💊', tagline: 'FEFO inventory, GST billing, barcode scanning, expiry alerts, and POS interface.',    tags: ['Inventory', 'GST', 'POS', 'FEFO'],         price: '₹3,499', is_featured: false, demo_type: 'online'  as const },
]

const TESTIMONIALS_FALLBACK = [
  {
    author_name: 'Dr. Priya Sharma', author_role: 'Principal', author_company: 'DPS Noida',
    content: 'SchoolERP transformed our administration. What used to take 3 hours now takes 20 minutes. The fee collection module is excellent.',
    rating: 5, initials: 'PS',
  },
  {
    author_name: 'Rajesh Agarwal', author_role: 'Pharmacist', author_company: 'Agarwal Medicals, Lucknow',
    content: 'The Medical Store app paid for itself in the first week. Expiry tracking alone saved us ₹40,000 in wastage.',
    rating: 5, initials: 'RA',
  },
  {
    author_name: 'Dr. Meena Joshi', author_role: 'General Physician', author_company: 'Joshi Clinic, Kanpur',
    content: 'My patients love the WhatsApp prescription feature. The SOAP note generator saves 10 minutes per patient.',
    rating: 5, initials: 'MJ',
  },
]

const FAQS = [
  { q: 'Do I need internet to use the software?', a: 'No! All our software is 100% offline. The database is embedded in the app. No internet required for day-to-day use. Internet is only needed during initial download and for optional updates.' },
  { q: 'How many computers can I install on?', a: 'Starter licenses allow 1 device. Professional allows 3 devices. Enterprise allows unlimited devices. You can manage activations from your dashboard.' },
  { q: 'What if I need support?', a: 'All licenses include 1 year of email and WhatsApp support from our India-based team. We typically respond within 4 hours during business hours (9AM–6PM IST).' },
  { q: 'Can I get a refund?', a: 'Yes — we offer a 7-day refund guarantee. If the software doesn\'t work on your system or doesn\'t meet your needs, contact us within 7 days for a full refund.' },
  { q: 'Is this a subscription?', a: 'No subscriptions! You pay once and own the software. Free updates are included for 1 year. After that, you can continue using the software indefinitely or buy an upgrade at a discounted rate.' },
  { q: 'Do you provide GST invoice?', a: 'Yes, a GST-compliant invoice is emailed immediately after purchase. You can also download it anytime from your dashboard.' },
]

export default function HomePage() {
  const [faqs, setFaqs] = useState<number | null>(null)
  const [heroProducts, setHeroProducts] = useState<any[]>(PRODUCTS_PREVIEW)
  const [siteStats, setSiteStats] = useState({ customers: 0, sales: 0, products: 3 })
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS_FALLBACK)
  const heroRef = useRef(null)

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  useEffect(() => {
    // Fetch hero products
    productsAPI.list({ page_size: 3 })
      .then(res => {
        const data = res.data.results || res.data
        if (Array.isArray(data) && data.length > 0) setHeroProducts(data.slice(0, 3))
      })
      .catch(() => {})

    // Fetch site stats
    productsAPI.stats()
      .then(res => {
        const d = res.data
        setSiteStats({
          customers: d.total_customers || 0,
          sales:     d.total_orders    || 0,
          products:  d.total_products  || 3,
        })
      })
      .catch(() => {})

    // Fetch featured testimonials
    productsAPI.testimonials(true)
      .then(res => {
        const data = res.data.results || res.data
        if (Array.isArray(data) && data.length > 0) setTestimonials(data.slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* BG mesh */}
        <div className="absolute inset-0 bg-grid-ink opacity-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #5a5fff 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-[100px] opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #f6c84b 0%, transparent 70%)' }} />

        <div className="container-xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 badge-gold mb-8 animate-pulse-slow">
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              <span>Trusted by 500+ businesses across India</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-extrabold leading-[1.06] tracking-tight mb-6"
            >
              <span className="text-white">Desktop Software</span>{' '}
              <br className="hidden md:block" />
              <span className="gradient-text">Built for India</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Offline-first ERP applications for schools, clinics, medical stores, and businesses.
              One-time purchase. Lifetime license. No subscriptions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products" className="btn-gold text-base px-8 py-4 font-bold gap-2">
                Browse All Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/#features" className="btn-secondary text-base px-8 py-4">
                See Features
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs text-gray-600"
            >
              {['🔒 SSL Secured', '🇮🇳 GST Invoices', '💳 Razorpay Payments', '↩️ 7-Day Refund', '📞 WhatsApp Support'].map(t => (
                <span key={t} className="flex items-center gap-1.5">{t}</span>
              ))}
            </motion.div>
          </div>

          {/* Floating product cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {heroProducts.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} showRating={false} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/[0.05]">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Happy Customers',   value: siteStats.customers, suffix: siteStats.customers > 0 ? '+' : '' },
              { label: 'Licenses Sold',     value: siteStats.sales,     suffix: siteStats.sales > 0 ? '+' : '' },
              { label: 'Products',          value: siteStats.products,  suffix: '' },
              { label: 'Uptime (Offline!)', value: 100,                 suffix: '%' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl font-extrabold gradient-text-blue mb-1">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="container-xl">
          <div className="text-center mb-16">
            <span className="badge-blue mb-4 inline-block">Why Choose Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Software that just <span className="gradient-text">works</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">No cloud dependency. No per-user pricing. No hidden fees. Buy it, own it, run it forever.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card group"
              >
                <div className="w-12 h-12 rounded-xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mb-5 group-hover:border-ink-500/60 group-hover:bg-ink-800 transition-all">
                  <f.icon className="w-5 h-5 text-ink-400 group-hover:text-ink-300 transition-colors" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section bg-surface-900/50">
        <div className="container-xl">
          <div className="text-center mb-14">
            <span className="badge-gold mb-4 inline-block">Customer Stories</span>
            <h2 className="font-display text-4xl font-bold text-white">Loved by businesses across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author_name || t.name || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card"
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.rating || 5).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center text-ink-200 font-bold text-sm">
                    {t.initials || (t.author_name || t.name || '?')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.author_name || t.name}</p>
                    <p className="text-xs text-gray-500">
                      {t.author_role || t.role}
                      {(t.author_company || t.company) ? ` · ${t.author_company || t.company}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container-xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Get started in <span className="gradient-text">4 simple steps</span></h2>
            <p className="text-gray-500">From purchase to running software in under 10 minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Browse & Choose', desc: 'Pick the software that fits your business. Review features, screenshots, and pricing.' },
              { step: '02', title: 'Secure Checkout', desc: 'Pay safely via Razorpay — UPI, cards, net banking. Instant GST invoice.' },
              { step: '03', title: 'Get License Key', desc: 'License key arrives in your dashboard instantly. Download secure installer.' },
              { step: '04', title: 'Install & Run', desc: 'Install on your computer. Enter license key. Full software ready in minutes.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mx-auto mb-5">
                  <span className="font-display font-bold text-2xl gradient-text-blue">{s.step}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-surface-900/30" id="faq">
        <div className="container-xl max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Have more questions? Email us at support@softcraft.in</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setFaqs(faqs === i ? null : i)}
                >
                  <span className="font-medium text-white pr-4">{f.q}</span>
                  {faqs === i
                    ? <ChevronUp className="w-5 h-5 text-ink-400 shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                </button>
                {faqs === i && (
                  <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/[0.05]">
                    <p className="pt-4">{f.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
            style={{ background: 'linear-gradient(135deg, #1a1b3c 0%, #0e0f1e 50%, #1a1245 100%)' }}
          >
            <div className="absolute inset-0 bg-grid-ink opacity-100 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(90,95,255,0.18) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="badge-gold inline-block mb-6">🎉 Launch Offer — 20% off all products</div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-5">
                Ready to transform your business?
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                Join hundreds of schools, clinics, and businesses across India already running SoftCraft software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn-gold text-base px-10 py-4 font-bold">
                  Browse Products <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/register" className="btn-secondary text-base px-10 py-4">
                  Create Free Account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}