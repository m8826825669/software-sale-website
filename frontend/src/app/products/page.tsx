'use client'
import { useEffect, useState } from 'react'
import { Search, Package, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard, { Product } from '@/components/ProductCard'
import { productsAPI } from '@/lib/api'

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [p, c] = await Promise.all([productsAPI.list(), productsAPI.categories()])
        const prods = p.data.results || p.data
        const cats  = c.data.results || c.data
        setProducts(Array.isArray(prods) ? prods : [])
        setCategories(Array.isArray(cats) ? cats : [])
      } catch {
        setProducts(SAMPLE_PRODUCTS)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.tagline?.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || (p as any).category?.slug === catFilter)
  )

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28">

        {/* ── Hero banner ── */}
        <div className="relative overflow-hidden border-b border-white/[0.05] pb-16">
          <div className="absolute inset-0 bg-grid-ink" />
          <div className="container-xl relative z-10 text-center">
            <span className="badge-blue mb-5 inline-block font-mono">Our Software</span>
            <h1 className="font-display text-5xl font-extrabold text-white mb-4">
              All <span className="gradient-text">Products</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Professional desktop software for every type of business.
              One-time purchase. No subscriptions.
            </p>
          </div>
        </div>

        <div className="container-xl py-12">

          {/* ── Filters ── */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
                placeholder="Search software..."
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCatFilter('')}
                className={`badge text-sm px-4 py-2 cursor-pointer transition-all ${
                  !catFilter ? 'badge-blue' : 'text-gray-500 bg-white/[0.04] border border-white/[0.08] hover:text-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((c: any) => (
                <button
                  key={c.slug}
                  onClick={() => setCatFilter(c.slug)}
                  className={`badge text-sm px-4 py-2 cursor-pointer transition-all ${
                    catFilter === c.slug ? 'badge-blue' : 'text-gray-500 bg-white/[0.04] border border-white/[0.08] hover:text-gray-300'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Product grid ── */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 text-ink-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-500">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={(p as any).id || p.slug} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

// ── Fallback sample data ──────────────────────────────────────────────────────
const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', slug: 'school-erp',     name: 'School Management ERP',  emoji: '🏫', tagline: 'Complete school administration — students, attendance, fees, exams, library and more.', tags: ['Students', 'Attendance', 'Fees', 'Library'], price: '₹4,999',  is_featured: true,  rating: 4.9, rating_count: 87,  demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '2', slug: 'clinic-manager', name: 'Clinic Manager Pro',     emoji: '🏥', tagline: 'Patient records, SOAP notes, prescriptions, appointments, and billing in one app.',       tags: ['OPD', 'ABHA', 'Billing'],                  price: '₹7,999',  is_featured: false, rating: 4.8, rating_count: 54,  demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '3', slug: 'medical-store',  name: 'Medical Store ERP',      emoji: '💊', tagline: 'FEFO inventory, GST billing, expiry alerts, barcode scanning, and POS interface.',        tags: ['Inventory', 'GST', 'POS', 'FEFO'],         price: '₹3,499',  is_featured: false, rating: 4.7, rating_count: 43,  demo_type: 'online',  demo_url: '', trial_days: 0  },
  { id: '4', slug: 'accounting',     name: 'BharatBooks Accounting', emoji: '📊', tagline: 'GST-compliant accounting for small businesses — invoicing, expenses, P&L, balance sheet.', tags: ['GST', 'Invoicing', 'Tally Alt'],           price: '₹2,999',  is_featured: false, rating: 4.6, rating_count: 31,  demo_type: 'trial',   demo_url: '', trial_days: 15 },
  { id: '5', slug: 'hrms',           name: 'HRMS Pro',               emoji: '👥', tagline: 'Complete HR management — recruitment, payroll, attendance, leaves, and appraisals.',      tags: ['Payroll', 'Recruitment', 'Leaves'],        price: '₹5,999',  is_featured: false, rating: 4.5, rating_count: 22,  demo_type: 'request', demo_url: '', trial_days: 15 },
  { id: '6', slug: 'fantasy-sports', name: 'Fantasy Sports Platform',emoji: '🏏', tagline: 'Full-stack fantasy sports platform with real-time scoring, wallets, and KYC.',           tags: ['Real-time', 'Wallet', 'KYC'],              price: '₹29,999', is_featured: false, rating: 4.8, rating_count: 12,  demo_type: 'request', demo_url: '', trial_days: 0  },
]