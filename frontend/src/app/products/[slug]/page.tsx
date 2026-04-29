'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Star, Download, ArrowRight, Monitor, Cpu, HardDrive,
         ChevronLeft, Loader2, Play, Shield, RefreshCw, Users, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TryDemoButton from '@/components/TryDemoButton'
import { productsAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

const FALLBACK: Record<string, any> = {
  'school-erp': {
    name: 'School Management ERP', emoji: '🏫', version: '1.0.0', platform: 'all',
    file_size: '48 MB', total_purchases: 320, rating: 4.9, rating_count: 87,
    tagline: 'Complete school administration built for Indian schools.',
    description: `School Management ERP is a comprehensive, offline-first desktop application designed to digitise and streamline all administrative operations of a school. Built with Spring Boot 3 and JavaFX 21, it runs entirely on your local machine with no internet connection required.\n\nManage students, attendance, fees, examinations, library, timetables, notices, and staff — all in one application with a beautiful, easy-to-use interface.`,
    features: [
      { icon: '👨‍🎓', title: 'Student Management', desc: 'Full student lifecycle — admissions, profiles, transfers, and alumni tracking with auto-generated roll numbers.' },
      { icon: '✅', title: 'Attendance Tracking', desc: 'Daily class-wise attendance with 5 status types (Present/Absent/Late/Half-Day/Leave) and monthly reports.' },
      { icon: '💰', title: 'Fee Management', desc: 'Collect fees, generate receipts, track pending payments, manage fee structures with GST support.' },
      { icon: '📝', title: 'Examinations & Results', desc: 'Schedule exams, enter marks, auto-calculate grades (A+ to F), generate PDF report cards.' },
      { icon: '📚', title: 'Library Management', desc: 'Book catalog, issue/return tracking, auto-fine calculation (₹2/day), overdue alerts.' },
      { icon: '📢', title: 'Notice Board', desc: 'Publish announcements to students, teachers, parents, or all — with audience targeting.' },
    ],
    tech_stack: ['Java 21', 'Spring Boot 3.2', 'JavaFX 21', 'H2 Database', 'Maven', 'Apache POI', 'iText PDF'],
    requirements: { os: 'Windows 10/11, macOS 12+, Ubuntu 20.04+', ram: '4 GB minimum', disk: '500 MB', java: 'Java 21+' },
    plans: [
      { id: 'school-starter', name: 'Starter', price: '4999', original_price: '6999', billing_cycle: 'one_time', max_users: 1, max_devices: 1, is_popular: false, discount_percent: 28,
        features_included: ['1 device activation', 'All modules included', '1 year free updates', 'Email support', 'PDF report generation', 'GST invoice'] },
      { id: 'school-pro', name: 'Professional', price: '7999', original_price: '11999', billing_cycle: 'one_time', max_users: 5, max_devices: 3, is_popular: true, discount_percent: 33,
        features_included: ['3 device activations', 'All modules included', '2 years free updates', 'Priority email + WhatsApp', 'Custom school logo', 'Data import/export', 'GST invoice'] },
      { id: 'school-ent', name: 'Enterprise', price: '14999', original_price: null, billing_cycle: 'one_time', max_users: 999, max_devices: 10, is_popular: false, discount_percent: 0,
        features_included: ['10 device activations', 'All modules included', 'Lifetime updates', 'Dedicated support', 'On-site training', 'Custom development', 'Source code access'] },
    ],
    testimonials: [
      { author_name: 'Dr. Priya Sharma', author_role: 'Principal', author_company: 'DPS Noida', content: 'SchoolERP transformed our administration. Fee collection now takes 10 minutes instead of 3 hours.', rating: 5, initials: 'PS' },
      { author_name: 'Ramesh Kumar', author_role: 'School Admin', author_company: 'St. Marys School, Lucknow', content: 'The library module alone saved us ₹80,000 in lost book tracking. Excellent software.', rating: 5, initials: 'RK' },
    ],
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const slug = params.slug as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'requirements' | 'reviews'>('overview')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await productsAPI.detail(slug)
        setProduct(data)
        setSelectedPlan(data.plans?.find((p: any) => p.is_popular) || data.plans?.[0])
      } catch {
        const fallback = FALLBACK[slug]
        if (fallback) {
          setProduct(fallback)
          setSelectedPlan(fallback.plans?.find((p: any) => p.is_popular) || fallback.plans?.[0])
        } else {
          router.push('/products')
        }
      }
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  const handleBuy = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/checkout/${slug}?plan=${selectedPlan?.id}`)
      return
    }
    router.push(`/checkout/${slug}?plan=${selectedPlan?.id}`)
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-ink-400 animate-spin" />
    </div>
  )
  if (!product) return null

  const price = selectedPlan ? parseFloat(selectedPlan.price) : 0
  const tax = Math.round(price * 18) / 100
  const total = price + tax

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-20">

        {/* ── Hero band ── */}
        <div className="relative border-b border-white/[0.05] overflow-hidden">
          <div className="absolute inset-0 bg-grid-ink" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 100% at 50% -20%, rgba(90,95,255,0.12) 0%, transparent 70%)' }} />
          <div className="container-xl relative z-10 py-16">
            <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
              <ChevronLeft className="w-4 h-4" /> All Products
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left info */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{product.emoji || '📦'}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-blue text-xs font-mono">v{product.version}</span>
                      <span className="badge-green text-xs">{product.platform === 'all' ? 'All Platforms' : product.platform}</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">{product.name}</h1>
                  </div>
                </div>
                <p className="text-lg text-gray-400 leading-relaxed mb-6">{product.tagline}</p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 mb-8 text-sm">
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                      <span className="text-white font-semibold">{parseFloat(product.rating).toFixed(1)}</span>
                      <span className="text-gray-500">({product.rating_count} reviews)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Users className="w-4 h-4 text-ink-400" />
                    {product.total_purchases}+ users
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <HardDrive className="w-4 h-4 text-ink-400" />
                    {product.file_size}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    7-day refund guarantee
                  </div>
                </div>

                {/* Tech stack */}
                {product.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tech_stack.map((t: string) => (
                      <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-surface-800 border border-white/[0.06] text-gray-400">{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Right — pricing card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-28">
                {/* Plan selector */}
                {product.plans?.length > 0 && (
                  <div className="glass rounded-3xl p-6 border border-white/[0.07]">
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Choose a Plan</p>
                    <div className="space-y-3 mb-6">
                      {product.plans.map((plan: any) => (
                        <button key={plan.id} onClick={() => setSelectedPlan(plan)}
                          className={`w-full rounded-2xl p-4 text-left transition-all border ${
                            selectedPlan?.id === plan.id
                              ? 'border-ink-500/60 bg-ink-900/60 shadow-glow-ink'
                              : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]'
                          }`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedPlan?.id === plan.id ? 'border-ink-400' : 'border-gray-600'
                              }`}>
                                {selectedPlan?.id === plan.id && <div className="w-2 h-2 rounded-full bg-ink-400" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white text-sm">{plan.name}</span>
                                  {plan.is_popular && <span className="badge-gold text-[10px]">Popular</span>}
                                </div>
                                <span className="text-xs text-gray-500">{plan.max_devices} device{plan.max_devices > 1 ? 's' : ''} · {plan.billing_cycle === 'one_time' ? 'Lifetime' : plan.billing_cycle}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-display font-bold text-white">₹{parseFloat(plan.price).toLocaleString('en-IN')}</div>
                              {plan.original_price && (
                                <div className="text-xs text-gray-600 line-through">₹{parseFloat(plan.original_price).toLocaleString('en-IN')}</div>
                              )}
                              {plan.discount_percent > 0 && (
                                <div className="text-xs text-emerald-400">{plan.discount_percent}% off</div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Plan features */}
                    {selectedPlan?.features_included?.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {selectedPlan.features_included.map((f: string) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Price breakdown */}
                    <div className="border-t border-white/[0.06] pt-4 mb-5 space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>License price</span><span>₹{price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white text-base pt-1.5 border-t border-white/[0.06]">
                        <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button onClick={handleBuy} className="btn-gold w-full justify-center py-4 text-base font-bold mb-3">
                      Buy Now — ₹{total.toLocaleString('en-IN')} <ArrowRight className="w-5 h-5" />
                    </button>
                    <TryDemoButton
                      demo={{
                        type: (product.demo_type as any) || 'request',
                        url:  product.demo_url || '',
                        trialDays: product.trial_days || 15,
                        productName: product.name,
                        productSlug: slug,
                        productEmoji: product.emoji,
                      }}
                      variant="outline"
                      className="w-full justify-center py-3"
                    />
                    <p className="text-center text-xs text-gray-600">
                      Secure payment via Razorpay · Instant license delivery · GST invoice included
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.05]">
                      {[
                        { icon: Shield, label: '7-Day Refund' },
                        { icon: RefreshCw, label: '1-Year Updates' },
                        { icon: Zap, label: 'Instant Delivery' },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="text-center">
                          <Icon className="w-4 h-4 text-ink-400 mx-auto mb-1" />
                          <span className="text-[10px] text-gray-600">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="sticky top-16 z-30 border-b border-white/[0.05] bg-surface-950/90 backdrop-blur-xl">
          <div className="container-xl">
            <div className="flex gap-0">
              {(['overview', 'features', 'requirements', 'reviews'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition-all ${
                    activeTab === t
                      ? 'text-white border-ink-400'
                      : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="container-xl py-16">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="max-w-3xl">
                <h2 className="font-display text-2xl font-bold text-white mb-6">About this software</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {product.description?.split('\n\n').map((para: string, i: number) => (
                    <p key={i} className="text-gray-400 leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
                {product.demo_video_url && (
                  <a href={product.demo_video_url} target="_blank" rel="noopener noreferrer"
                    className="btn-secondary mt-8 w-fit gap-2">
                    <Play className="w-4 h-4" /> Watch Demo Video
                  </a>
                )}
              </div>
            )}

            {/* FEATURES */}
            {activeTab === 'features' && (
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-8">Everything you need</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {product.features?.map((f: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }} className="card group">
                      <div className="text-3xl mb-4">{f.icon}</div>
                      <h3 className="font-display font-semibold text-white mb-2 group-hover:text-ink-300 transition-colors">{f.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* REQUIREMENTS */}
            {activeTab === 'requirements' && (
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold text-white mb-8">System Requirements</h2>
                <div className="space-y-4">
                  {product.requirements && Object.entries(product.requirements).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-4 p-4 glass rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center shrink-0">
                        {key === 'os' && <Monitor className="w-4 h-4 text-ink-400" />}
                        {key === 'ram' && <Cpu className="w-4 h-4 text-ink-400" />}
                        {key === 'disk' && <HardDrive className="w-4 h-4 text-ink-400" />}
                        {!['os','ram','disk'].includes(key) && <Zap className="w-4 h-4 text-ink-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-white text-sm">{val as string}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 glass rounded-xl border border-gold-500/20 bg-amber-500/[0.04]">
                    <p className="text-sm text-amber-300 font-medium mb-1">⚡ Installation Note</p>
                    <p className="text-xs text-gray-500">Requires Java 21. Our installer checks for Java and provides a download link if not found. Maven is only needed for building from source.</p>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center gap-6 mb-10">
                  <div className="text-center">
                    <div className="font-display text-6xl font-bold text-white">{product.rating ? parseFloat(product.rating).toFixed(1) : '—'}</div>
                    <div className="flex gap-1 justify-center mt-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-700'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.rating_count} reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(product.testimonials || []).map((t: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
                      <div className="flex gap-1 mb-3">
                        {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed mb-4">"{t.content}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink-700 flex items-center justify-center text-ink-200 font-bold text-xs">
                          {t.initials || t.author_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{t.author_name}</p>
                          <p className="text-xs text-gray-500">{t.author_role}{t.author_company ? ` · ${t.author_company}` : ''}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!product.testimonials || product.testimonials.length === 0) && (
                    <p className="text-gray-600 text-sm">No reviews yet. Be the first to review this product.</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}