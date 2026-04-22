'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, Loader2, ShieldAlert, ArrowLeft, Save, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// ── Inline product form ──────────────────────────────────────────────────────
function ProductForm({ product, onSave, onCancel }: { product: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name:        product?.name        || '',
    slug:        product?.slug        || '',
    emoji:       product?.emoji       || '📦',
    tagline:     product?.tagline     || '',
    description: product?.description || '',
    version:     product?.version     || '1.0.0',
    file_size:   product?.file_size   || '',
    platform:    product?.platform    || 'all',
    is_active:   product?.is_active   ?? true,
    is_featured: product?.is_featured ?? false,
    sort_order:  product?.sort_order  || 0,
  })
  const [saving, setSaving] = useState(false)

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const save = async () => {
    if (!form.name || !form.slug || !form.tagline) { toast.error('Name, slug, and tagline are required'); return }
    setSaving(true)
    try {
      if (product?.slug) {
        await api.patch(`/products/admin/${product.slug}/`, form)
        toast.success('Product updated!')
      } else {
        await api.post('/products/admin/list/', form)
        toast.success('Product created!')
      }
      onSave()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Save failed')
    }
    setSaving(false)
  }

  const f = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }))

  return (
    <div className="card mt-4">
      <h3 className="font-display font-semibold text-white mb-6">{product ? 'Edit Product' : 'New Product'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
          <input value={form.name} onChange={e => { f('name', e.target.value); if (!product) f('slug', slugify(e.target.value)) }}
            className="input-field" placeholder="School Management ERP" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug *</label>
          <input value={form.slug} onChange={e => f('slug', slugify(e.target.value))}
            className="input-field font-mono" placeholder="school-erp" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Emoji</label>
          <input value={form.emoji} onChange={e => f('emoji', e.target.value)} className="input-field" placeholder="📦" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Version</label>
          <input value={form.version} onChange={e => f('version', e.target.value)} className="input-field" placeholder="1.0.0" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Tagline *</label>
          <input value={form.tagline} onChange={e => f('tagline', e.target.value)}
            className="input-field" placeholder="One-line description of the product" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => f('description', e.target.value)}
            className="input-field resize-none" rows={4} placeholder="Full product description..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Platform</label>
          <select value={form.platform} onChange={e => f('platform', e.target.value)}
            className="input-field" style={{ colorScheme: 'dark' }}>
            <option value="all">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="mac">macOS</option>
            <option value="linux">Linux</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">File Size</label>
          <input value={form.file_size} onChange={e => f('file_size', e.target.value)}
            className="input-field" placeholder="48 MB" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => f('sort_order', parseInt(e.target.value))}
            className="input-field" />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => f('is_active', e.target.checked)}
              className="w-4 h-4 accent-ink-500 rounded" />
            <span className="text-sm text-gray-400">Active (visible to customers)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured', e.target.checked)}
              className="w-4 h-4 accent-gold-500 rounded" />
            <span className="text-sm text-gray-400">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-5 border-t border-white/[0.06]">
        <button onClick={save} disabled={saving} className="btn-primary gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button onClick={onCancel} className="btn-secondary gap-2">
          <X className="w-4 h-4" /> Cancel
        </button>
        {product && (
          <Link href={`/products/${product.slug}`} target="_blank"
            className="btn-secondary gap-2 ml-auto">
            <Eye className="w-4 h-4" /> View Live
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Main admin products page ─────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(undefined) // undefined = none, null = new, obj = existing

  useEffect(() => {
    if (!isAuthenticated || !user?.is_staff) { router.push('/dashboard'); return }
    load()
  }, [isAuthenticated, user])

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products/admin/list/')
      setProducts(data.results || data)
    } catch { toast.error('Failed to load products') }
    setLoading(false)
  }

  const deleteProduct = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This is irreversible.`)) return
    try {
      await api.delete(`/products/admin/${slug}/`)
      toast.success(`"${name}" deleted`)
      load()
    } catch { toast.error('Delete failed') }
  }

  const onSaved = () => { setEditing(undefined); load() }

  if (!isAuthenticated || !user?.is_staff) return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
      <ShieldAlert className="w-16 h-16 text-red-400" />
      <p className="text-white font-display font-bold text-xl">Admin access required</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="glass border-b border-white/[0.06] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Admin Dashboard
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-white font-display font-semibold">Products</span>
          </div>
          <button onClick={() => setEditing(null)} className="btn-primary text-sm py-2 px-4 gap-2">
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {editing !== undefined && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <ProductForm product={editing} onSave={onSaved} onCancel={() => setEditing(undefined)} />
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-ink-400 animate-spin" /></div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs text-gray-500 text-left">
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 font-medium">Slug</th>
                  <th className="pb-3 pr-4 font-medium">Version</th>
                  <th className="pb-3 pr-4 font-medium">Sales</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map((p: any) => (
                  <tr key={p.id} className="text-gray-400 hover:text-white transition-colors group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji || '📦'}</span>
                        <div>
                          <p className="font-medium text-white text-sm">{p.name}</p>
                          <p className="text-xs text-gray-600 truncate max-w-xs">{p.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-ink-400">{p.slug}</td>
                    <td className="py-3 pr-4 text-xs">v{p.version}</td>
                    <td className="py-3 pr-4 text-xs">{p.total_purchases || 0}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1.5">
                        <span className={`badge text-[10px] ${p.is_active ? 'badge-green' : 'text-gray-600 bg-white/[0.04] border border-white/[0.08]'}`}>
                          {p.is_active ? 'Active' : 'Hidden'}
                        </span>
                        {p.is_featured && <span className="badge-gold text-[10px]">Featured</span>}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditing(p)}
                          className="p-1.5 rounded-lg glass-light hover:border-ink-500/40 text-gray-400 hover:text-white transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/products/${p.slug}`} target="_blank"
                          className="p-1.5 rounded-lg glass-light hover:border-ink-500/40 text-gray-400 hover:text-white transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => deleteProduct(p.slug, p.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 text-gray-600 hover:text-red-400 transition-all glass-light">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-600">
                      No products yet. Click "New Product" to create your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
