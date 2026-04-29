'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, Star, ArrowRight, Package, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TryDemoButton from '@/components/TryDemoButton'
import { productsAPI } from '@/lib/api'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [p, c] = await Promise.all([productsAPI.list(), productsAPI.categories()])
        setProducts(p.data.results || p.data)
        setCategories(c.data)
      } catch {
        // Use sample data on API failure
        setProducts(SAMPLE_PRODUCTS)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline?.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || p.category?.slug === catFilter)
  )

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28">
        {/* Hero banner */}
        <div className="relative overflow-hidden border-b border-white/[0.05] pb-16">
          <div className="absolute inset-0 bg-grid-ink opacity-100" />
          <div className="container-xl relative z-10 text-center">
            <span className="badge-blue mb-5 inline-block font-mono">Our Software</span>
            <h1 className="font-display text-5xl font-extrabold text-white mb-4">
              All <span className="gradient-text">Products</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Professional desktop software for every type of business. One-time purchase. No subscriptions.
            </p>
          </div>
        </div>

        <div className="container-xl py-12">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-11" placeholder="Search software..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setCatFilter('')}
                className={`badge text-sm px-4 py-2 cursor-pointer transition-all ${!catFilter ? 'badge-blue' : 'text-gray-500 bg-white/[0.04] border border-white/[0.08] hover:text-gray-300'}`}>
                All
              </button>
              {categories.map((c: any) => (
                <button key={c.slug} onClick={() => setCatFilter(c.slug)}
                  className={`badge text-sm px-4 py-2 cursor-pointer transition-all ${catFilter === c.slug ? 'badge-blue' : 'text-gray-500 bg-white/[0.04] border border-white/[0.08] hover:text-gray-300'}`}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 text-ink-400 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-500">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p: any, i: number) => (
                <motion.div key={p.id || p.slug}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group card relative overflow-hidden hover:border-ink-500/30 transition-all"
                  whileHover={{ y: -4 }}
                >
                  {p.is_featured && (
                    <div className="absolute top-4 right-4 badge-gold text-[10px]">Featured</div>
                  )}
                  <div className="text-5xl mb-5">{p.emoji || '📦'}</div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-ink-300 transition-colors">{p.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{p.tagline || p.description}</p>

                  {/* Tags */}
                  {p.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map((t: string) => (
                        <span key={t} className="badge-blue text-[10px]">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  {p.rating > 0 && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                      <span className="text-xs text-gray-400">{parseFloat(p.rating).toFixed(1)} ({p.rating_count} reviews)</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div>
                      <div className="font-display font-bold text-white text-xl">
                        {p.starting_price ? `₹${parseFloat(p.starting_price).toLocaleString('en-IN')}` : p.price}
                        <span className="text-xs font-normal text-gray-600 ml-1">+GST</span>
                      </div>
                      <div className="text-[10px] text-gray-600">one-time · lifetime</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TryDemoButton
                        demo={{
                          type: (p.demo_type as any) || 'request',
                          url: p.demo_url || '',
                          trialDays: p.trial_days || 15,
                          productName: p.name,
                          productSlug: p.slug,
                          productEmoji: p.emoji,
                        }}
                        variant="card"
                      />
                      <Link href={`/products/${p.slug}`}
                        className="btn-primary text-sm py-2 px-4 gap-1.5">
                        Buy Now <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Sample data for when API is not running
const SAMPLE_PRODUCTS = [
  { id: '1', slug: 'school-erp',    name: 'School Management ERP',    emoji: '🏫', tagline: 'Complete school administration — students, attendance, fees, exams, library and more.', tags: ['Students', 'Attendance', 'Fees', 'Library'], price: '₹4,999', is_featured: true,  rating: 4.9, rating_count: 87, demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '2', slug: 'clinic-manager',name: 'Clinic Manager Pro',        emoji: '🏥', tagline: 'Patient records, SOAP notes, prescriptions, appointments, and billing in one app.',       tags: ['OPD', 'ABHA', 'Billing', 'Prescriptions'], price: '₹7,999', is_featured: false, rating: 4.8, rating_count: 54, demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '3', slug: 'medical-store', name: 'Medical Store ERP',         emoji: '💊', tagline: 'FEFO inventory, GST billing, expiry alerts, barcode scanning, and POS interface.',        tags: ['Inventory', 'GST', 'POS', 'FEFO'],         price: '₹3,499', is_featured: false, rating: 4.7, rating_count: 43, demo_type: 'online',  demo_url: 'https://demo.softcraft.in/medical-store', trial_days: 0 },
  { id: '4', slug: 'accounting',    name: 'BharatBooks Accounting',    emoji: '📊', tagline: 'GST-compliant accounting for small businesses — invoicing, expenses, P&L, balance sheet.', tags: ['GST', 'Invoicing', 'Tally Alternative'],   price: '₹2,999', is_featured: false, rating: 4.6, rating_count: 31, demo_type: 'trial',   demo_url: '', trial_days: 15 },
  { id: '5', slug: 'hrms',          name: 'HRMS Pro',                  emoji: '👥', tagline: 'Complete HR management — recruitment, payroll, attendance, leaves, and appraisals.',      tags: ['Payroll', 'Recruitment', 'Leaves'],        price: '₹5,999', is_featured: false, rating: 4.5, rating_count: 22, demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '6', slug: 'fantasy-sports',name: 'Fantasy Sports Platform',   emoji: '🏏', tagline: 'Full-stack fantasy sports platform with real-time scoring, wallets, and KYC.',           tags: ['Real-time', 'Wallet', 'KYC', 'UPI'],       price: '₹29,999',is_featured: false, rating: 4.8, rating_count: 12, demo_type: 'request', demo_url: '', trial_days: 0 },
]