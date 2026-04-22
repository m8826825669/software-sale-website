'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Key, Download, User, ArrowRight, Loader2, Copy, CheckCheck,
         ShoppingBag, Clock, ExternalLink, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/lib/store'
import { ordersAPI, licensesAPI, downloadsAPI } from '@/lib/api'
import toast from 'react-hot-toast'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1.5 rounded-lg glass-light hover:border-ink-500/40 transition-all">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
    </button>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore()
  const router = useRouter()
  const [tab, setTab] = useState<'orders' | 'licenses' | 'downloads'>('licenses')
  const [orders, setOrders] = useState<any[]>([])
  const [licenses, setLicenses] = useState<any[]>([])
  const [dlHistory, setDlHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, authLoading])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [o, l, d] = await Promise.all([
          ordersAPI.myOrders(),
          licensesAPI.myLicenses(),
          downloadsAPI.history(),
        ])
        setOrders(o.data)
        setLicenses(l.data)
        setDlHistory(d.data)
      } catch {}
      setLoading(false)
    }
    if (isAuthenticated) fetchAll()
  }, [isAuthenticated])

  const requestDownload = async (licenseId: string) => {
    setRequesting(licenseId)
    try {
      const { data } = await downloadsAPI.request(licenseId)
      const link = document.createElement('a')
      link.href = data.download_url
      link.click()
      toast.success('Download started! Link valid for 2 hours.')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate download link')
    }
    setRequesting(null)
  }

  if (authLoading || !isAuthenticated) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
    </div>
  )

  const TABS = [
    { id: 'licenses', label: 'My Licenses', icon: Key, count: licenses.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'downloads', label: 'Downloads', icon: Download, count: dlHistory.length },
  ] as const

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-20">
        <div className="container-xl py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-1">
                Welcome, {user?.first_name || 'there'} 👋
              </h1>
              <p className="text-gray-500 text-sm">Manage your software licenses, orders, and downloads</p>
            </div>
            <Link href="/products" className="btn-gold text-sm px-6 py-3 self-start md:self-auto">
              Browse More Software <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Licenses', value: licenses.filter((l: any) => l.is_valid).length, icon: Key, color: 'text-ink-400' },
              { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-gold-400' },
              { label: 'Downloads', value: dlHistory.length, icon: Download, color: 'text-emerald-400' },
              { label: 'Account Status', value: 'Active', icon: User, color: 'text-purple-400' },
            ].map((s) => (
              <div key={s.label} className="card">
                <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                <div className="font-display font-bold text-2xl text-white">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl glass mb-6 w-fit">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-ink-700 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}>
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-ink-500 text-white' : 'bg-white/[0.06] text-gray-500'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-ink-400 animate-spin" /></div>
          ) : (
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

              {/* LICENSES */}
              {tab === 'licenses' && (
                <div className="space-y-4">
                  {licenses.length === 0 ? (
                    <div className="card text-center py-16">
                      <Key className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-white mb-2">No licenses yet</h3>
                      <p className="text-sm text-gray-500 mb-6">Purchase a product to get your first license</p>
                      <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                  ) : licenses.map((lic: any) => (
                    <div key={lic.id} className="card">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-display font-semibold text-white">{lic.product_name}</h3>
                            <span className={`badge text-xs ${lic.is_valid ? 'badge-green' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>
                              {lic.is_valid ? '● Active' : lic.is_expired ? 'Expired' : 'Inactive'}
                            </span>
                            <span className="badge-blue text-xs">{lic.plan_name}</span>
                          </div>
                          <div className="flex items-center gap-2 my-2">
                            <code className="font-mono text-sm text-ink-300 bg-ink-950/60 px-3 py-1 rounded-lg border border-ink-800/50">
                              {lic.license_key}
                            </code>
                            <CopyButton text={lic.license_key} />
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                            <span>🖥️ {lic.activation_count}/{lic.max_activations} activations</span>
                            <span>📥 {lic.download_count} downloads</span>
                            {lic.expires_at
                              ? <span>⏰ Expires {new Date(lic.expires_at).toLocaleDateString('en-IN')}</span>
                              : <span>♾️ Lifetime license</span>}
                            <span>📅 Since {new Date(lic.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <Link href={`/products/${lic.product_slug}`} className="btn-secondary text-sm py-2 px-4 gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5" /> Product Page
                          </Link>
                          <Link href={`/dashboard/licenses/${lic.id}`} className="btn-secondary text-sm py-2 px-4 gap-1.5">
                            <Key className="w-3.5 h-3.5" /> Manage
                          </Link>
                          <button
                            onClick={() => requestDownload(lic.id)}
                            disabled={!lic.is_valid || requesting === lic.id}
                            className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {requesting === lic.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <><Download className="w-3.5 h-3.5" /> Download</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ORDERS */}
              {tab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="card text-center py-16">
                      <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-white mb-2">No orders yet</h3>
                      <p className="text-sm text-gray-500 mb-6">Your purchase history will appear here</p>
                      <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                  ) : orders.map((o: any) => (
                    <div key={o.id} className="card flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-semibold text-white">{o.product_name}</h3>
                          <span className={`badge text-xs ${
                            o.status === 'completed' ? 'badge-green' :
                            o.status === 'failed' ? 'text-red-400 bg-red-500/10 border-red-500/20 border' :
                            'badge-blue'
                          }`}>{o.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">{o.plan_name} · #{o.order_number}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(o.created_at).toLocaleString('en-IN')}
                          {o.completed_at && ` · Completed ${new Date(o.completed_at).toLocaleString('en-IN')}`}
                        </p>
                      </div>
                      <div className="font-display font-bold text-white text-xl shrink-0">
                        ₹{parseFloat(o.total_amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DOWNLOADS */}
              {tab === 'downloads' && (
                <div className="space-y-4">
                  {dlHistory.length === 0 ? (
                    <div className="card text-center py-16">
                      <Download className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-white mb-2">No download history</h3>
                      <p className="text-sm text-gray-500">Go to My Licenses and click Download to get started</p>
                    </div>
                  ) : dlHistory.map((d: any, i: number) => (
                    <div key={i} className="card flex items-center gap-4">
                      <Download className="w-5 h-5 text-ink-400 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{d.product}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {d.downloaded_at ? new Date(d.downloaded_at).toLocaleString('en-IN') : '—'}
                          {d.ip && ` · ${d.ip}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
