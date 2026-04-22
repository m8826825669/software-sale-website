'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2, Users, Package, ShoppingBag, Key, TrendingUp,
         Loader2, ShieldAlert, Eye, Settings } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [licenses, setLicenses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'orders' | 'licenses' | 'users'>('overview')

  useEffect(() => {
    if (!isAuthenticated || !user?.is_staff) {
      router.push('/dashboard')
      return
    }
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [s, o, l, u] = await Promise.all([
          api.get('/products/stats/'),
          api.get('/orders/admin/orders/'),
          api.get('/licenses/admin/'),
          api.get('/auth/admin/users/'),
        ])
        setStats(s.data)
        setOrders(o.data.results || [])
        setLicenses(l.data.results || [])
        setUsers(u.data.results || [])
      } catch {}
      setLoading(false)
    }
    fetchAll()
  }, [isAuthenticated, user])

  if (!isAuthenticated || !user?.is_staff) return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
      <ShieldAlert className="w-16 h-16 text-red-500" />
      <h2 className="font-display text-2xl font-bold text-white">Access Denied</h2>
      <p className="text-gray-500">Admin access required</p>
      <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
    </div>
  )

  const STAT_CARDS = [
    { label: 'Total Products', value: stats?.total_products ?? '—', icon: Package, color: 'text-ink-400', bg: 'bg-ink-900/50' },
    { label: 'Total Customers', value: stats?.total_customers ?? '—', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
    { label: 'Completed Orders', value: stats?.total_orders ?? '—', icon: ShoppingBag, color: 'text-gold-400', bg: 'bg-amber-900/30' },
    { label: 'Active Licenses', value: licenses.filter((l: any) => l.is_active).length, icon: Key, color: 'text-purple-400', bg: 'bg-purple-900/30' },
  ]

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'licenses', label: 'Licenses', icon: Key },
    { id: 'users', label: 'Users', icon: Users },
  ] as const

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Admin header */}
      <div className="glass border-b border-white/[0.06] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ink-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-display">SC</span>
              </div>
              <span className="font-display font-bold text-white text-sm">SoftCraft</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="badge-blue text-xs flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-secondary text-xs py-1.5 px-3">User Dashboard</Link>
            <Link href="/" className="btn-secondary text-xs py-1.5 px-3">View Site</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Logged in as {user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="font-display font-bold text-2xl text-white">{loading ? '…' : s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-6">
          <Link href="/admin/products" className="btn-secondary text-sm py-2 px-4 gap-2">
            <Package className="w-4 h-4" /> Manage Products
          </Link>
          <Link href="/products" target="_blank" className="btn-secondary text-sm py-2 px-4 gap-2">
            <Eye className="w-4 h-4 text-ink-400" /> View Store
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl glass mb-6 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? 'bg-ink-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-ink-400 animate-spin" /></div>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-ink-400" />Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-white/[0.04]">
                        <div>
                          <p className="text-white font-medium">{o.product_name}</p>
                          <p className="text-xs text-gray-500">{o.billing_email} · #{o.order_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₹{parseFloat(o.total_amount).toLocaleString('en-IN')}</p>
                          <span className={`text-xs ${o.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-gray-600 text-sm">No orders yet</p>}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" />Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u: any) => (
                      <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                        <div className="w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center text-ink-300 text-xs font-bold shrink-0">
                          {u.first_name?.[0] || u.email[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{u.full_name || u.email}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        {u.is_staff && <span className="badge-blue text-[10px]">Admin</span>}
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-gray-600 text-sm">No users yet</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {tab === 'orders' && (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs text-gray-500 text-left">
                      <th className="pb-3 pr-4 font-medium">Order</th>
                      <th className="pb-3 pr-4 font-medium">Customer</th>
                      <th className="pb-3 pr-4 font-medium">Product</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {orders.map((o: any) => (
                      <tr key={o.id} className="text-gray-400 hover:text-white transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-ink-400">#{o.order_number}</td>
                        <td className="py-3 pr-4">{o.billing_email}</td>
                        <td className="py-3 pr-4 text-white">{o.product_name}</td>
                        <td className="py-3 pr-4 font-bold text-white">₹{parseFloat(o.total_amount).toLocaleString('en-IN')}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge text-xs ${o.status === 'completed' ? 'badge-green' : o.status === 'failed' ? 'text-red-400 bg-red-500/10 border-red-500/20 border' : 'badge-blue'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-600">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* LICENSES */}
            {tab === 'licenses' && (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs text-gray-500 text-left">
                      <th className="pb-3 pr-4 font-medium">License Key</th>
                      <th className="pb-3 pr-4 font-medium">User</th>
                      <th className="pb-3 pr-4 font-medium">Product</th>
                      <th className="pb-3 pr-4 font-medium">Activations</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {licenses.map((l: any) => (
                      <tr key={l.id} className="text-gray-400 hover:text-white transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-ink-300">{l.license_key}</td>
                        <td className="py-3 pr-4 text-xs">{l.user_email || '—'}</td>
                        <td className="py-3 pr-4 text-white text-xs">{l.product_name}</td>
                        <td className="py-3 pr-4 text-xs">{l.activation_count}/{l.max_activations}</td>
                        <td className="py-3 pr-4">
                          <span className={`badge text-xs ${l.is_valid ? 'badge-green' : 'text-red-400 bg-red-500/10 border-red-500/20 border'}`}>
                            {l.is_valid ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 text-xs">{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {licenses.length === 0 && (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-600">No licenses yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs text-gray-500 text-left">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Company</th>
                      <th className="pb-3 pr-4 font-medium">Role</th>
                      <th className="pb-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {users.map((u: any) => (
                      <tr key={u.id} className="text-gray-400 hover:text-white transition-colors">
                        <td className="py-3 pr-4 text-white font-medium">{u.full_name || '—'}</td>
                        <td className="py-3 pr-4 text-xs">{u.email}</td>
                        <td className="py-3 pr-4 text-xs">{u.company || '—'}</td>
                        <td className="py-3 pr-4">
                          {u.is_staff
                            ? <span className="badge-blue text-[10px]">Admin</span>
                            : <span className="badge text-[10px] text-gray-500 bg-white/[0.04] border border-white/[0.08]">User</span>}
                        </td>
                        <td className="py-3 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-600">No users yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
