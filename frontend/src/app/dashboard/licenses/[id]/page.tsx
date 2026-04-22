'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Key, Monitor, Trash2, Loader2, Download,
         Copy, CheckCheck, RefreshCw, Shield, ExternalLink } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/lib/store'
import { licensesAPI, downloadsAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [license, setLicense]         = useState<any>(null)
  const [activations, setActivations] = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [copied, setCopied]           = useState(false)
  const [requesting, setRequesting]   = useState(false)
  const [removing, setRemoving]       = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    load()
  }, [isAuthenticated])

  const load = async () => {
    setLoading(true)
    try {
      const [myLics, acts] = await Promise.all([
        licensesAPI.myLicenses(),
        licensesAPI.activations(id),
      ])
      const lic = (myLics.data as any[]).find((l: any) => l.id === id)
      if (!lic) { router.push('/dashboard'); return }
      setLicense(lic)
      setActivations(acts.data)
    } catch { router.push('/dashboard') }
    setLoading(false)
  }

  const copyKey = () => {
    if (!license) return
    navigator.clipboard.writeText(license.license_key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    toast.success('License key copied!')
  }

  const requestDownload = async () => {
    setRequesting(true)
    try {
      const { data } = await downloadsAPI.request(id)
      const link = document.createElement('a')
      link.href = data.download_url
      link.click()
      toast.success('Download started! Link valid for 2 hours.')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Download failed')
    }
    setRequesting(false)
  }

  const deactivateMachine = async (machineId: string, machineName: string) => {
    if (!confirm(`Remove "${machineName}" from this license? The software will stop working on that device.`)) return
    setRemoving(machineId)
    try {
      await licensesAPI.deactivate(id, machineId)
      toast.success(`${machineName} deactivated. Activation slot freed.`)
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Deactivation failed')
    }
    setRemoving(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
    </div>
  )
  if (!license) return null

  const remainingSlots = license.max_activations - license.activation_count

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">

          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> My Licenses
          </Link>

          {/* License header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card mb-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at -10% -20%, rgba(90,95,255,0.08) 0%, transparent 70%)' }} />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge text-xs ${license.is_valid ? 'badge-green' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>
                      {license.is_valid ? '● Active' : license.is_expired ? 'Expired' : 'Inactive'}
                    </span>
                    <span className="badge-blue text-xs">{license.plan_name}</span>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-white">{license.product_name}</h1>
                </div>
                <Link href={`/products/${license.product_slug}`}
                  className="btn-secondary text-sm py-2 px-3 gap-1.5 shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" /> Product Page
                </Link>
              </div>

              {/* Key */}
              <div className="bg-ink-950/60 rounded-2xl p-4 border border-ink-800/50 mb-5">
                <p className="text-xs font-mono text-gray-600 mb-2 uppercase tracking-widest">License Key</p>
                <div className="flex items-center justify-between gap-3">
                  <code className="font-mono text-lg text-ink-300 tracking-widest break-all">{license.license_key}</code>
                  <button onClick={copyKey}
                    className={`p-2 rounded-xl flex-shrink-0 transition-all ${copied ? 'bg-emerald-500/15 text-emerald-400' : 'glass-light hover:border-ink-500/40 text-gray-500'}`}>
                    {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Activations', value: `${license.activation_count}/${license.max_activations}`, sub: `${remainingSlots} slot${remainingSlots !== 1 ? 's' : ''} free` },
                  { label: 'Downloads', value: license.download_count, sub: 'times downloaded' },
                  { label: 'Validity', value: license.expires_at ? new Date(license.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : 'Lifetime', sub: license.expires_at ? 'expiry date' : 'no expiry' },
                  { label: 'Since', value: new Date(license.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }), sub: 'purchase date' },
                ].map(s => (
                  <div key={s.label} className="glass-light rounded-xl p-3 text-center">
                    <p className="font-display font-bold text-white text-lg">{s.value}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">{s.label}</p>
                    <p className="text-xs text-gray-700 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={requestDownload} disabled={!license.is_valid || requesting}
                  className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Installer
                </button>
                <button onClick={load} className="btn-secondary gap-2 p-2.5">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Active machines */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-ink-400" /> Active Devices ({activations.length})
              </h2>
              <p className="text-xs text-gray-600">
                {remainingSlots} of {license.max_activations} slots available
              </p>
            </div>

            {activations.length === 0 ? (
              <div className="card text-center py-12">
                <Monitor className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No active device activations yet</p>
                <p className="text-xs text-gray-600 mt-1">Install the software and enter your license key to activate</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {activations.map((a: any) => (
                    <motion.div key={a.machine_id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className="card flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-ink-900 border border-ink-700/40 flex items-center justify-center shrink-0">
                          <Monitor className="w-5 h-5 text-ink-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white text-sm truncate">{a.machine_name || 'Unknown Device'}</p>
                          <div className="flex flex-wrap gap-3 mt-0.5">
                            {a.os_info && <p className="text-xs text-gray-600">{a.os_info}</p>}
                            {a.ip_address && <p className="text-xs text-gray-600">{a.ip_address}</p>}
                            <p className="text-xs text-gray-700">
                              Last seen: {new Date(a.last_seen).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deactivateMachine(a.machine_id, a.machine_name || 'this device')}
                        disabled={removing === a.machine_id}
                        title="Remove this device activation"
                        className="p-2 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 text-gray-600 hover:text-red-400 glass-light transition-all disabled:opacity-50 shrink-0"
                      >
                        {removing === a.machine_id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Help note */}
            <div className="mt-6 p-4 glass rounded-2xl flex items-start gap-3 text-xs text-gray-600">
              <Shield className="w-4 h-4 text-ink-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Removing a device frees up an activation slot so you can activate on a new computer.
                The software will stop working on the removed device after its next license check (within 30 days).
                If you need more simultaneous activations, upgrade your plan.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
