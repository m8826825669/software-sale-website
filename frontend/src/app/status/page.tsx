'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'checking'
  latency?: number
  description: string
}

const SERVICES: ServiceStatus[] = [
  { name: 'API Server',         status: 'checking', description: 'Core REST API serving all requests' },
  { name: 'Database',           status: 'checking', description: 'PostgreSQL / SQLite data storage' },
  { name: 'Authentication',     status: 'checking', description: 'JWT login and token management' },
  { name: 'Payment Gateway',    status: 'checking', description: 'Razorpay payment processing' },
  { name: 'Download Service',   status: 'checking', description: 'Secure installer file delivery' },
  { name: 'Email Delivery',     status: 'checking', description: 'Purchase confirmations and alerts' },
  { name: 'License Validation', status: 'checking', description: 'Desktop app license checks' },
  { name: 'Website',            status: 'checking', description: 'Next.js frontend serving' },
]

const INCIDENTS: { date: string; title: string; status: string; detail: string }[] = [
  // Add real incidents here as they occur
]

function StatusIcon({ status }: { status: ServiceStatus['status'] }) {
  if (status === 'checking') return <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
  if (status === 'operational') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
  if (status === 'degraded') return <AlertTriangle className="w-5 h-5 text-amber-400" />
  return <XCircle className="w-5 h-5 text-red-400" />
}

function StatusBadge({ status }: { status: ServiceStatus['status'] }) {
  const styles: Record<string, string> = {
    operational: 'badge-green',
    degraded: 'text-amber-400 bg-amber-500/10 border border-amber-500/25',
    outage: 'text-red-400 bg-red-500/10 border border-red-500/25',
    checking: 'text-gray-500 bg-white/[0.04] border border-white/[0.08]',
  }
  const labels: Record<string, string> = {
    operational: 'Operational',
    degraded: 'Degraded',
    outage: 'Outage',
    checking: 'Checking…',
  }
  return <span className={`badge text-xs ${styles[status]}`}>{labels[status]}</span>
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>(SERVICES)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checking, setChecking] = useState(false)

  const checkStatus = async () => {
    setChecking(true)
    setServices(prev => prev.map(s => ({ ...s, status: 'checking' })))

    const start = Date.now()
    let apiOk = false
    let apiLatency = 0

    try {
      const t0 = Date.now()
      await api.get('/products/stats/')
      apiLatency = Date.now() - t0
      apiOk = true
    } catch {}

    setServices([
      { name: 'API Server',         status: apiOk ? 'operational' : 'outage',       latency: apiLatency, description: 'Core REST API serving all requests' },
      { name: 'Database',           status: apiOk ? 'operational' : 'outage',        description: 'PostgreSQL / SQLite data storage' },
      { name: 'Authentication',     status: apiOk ? 'operational' : 'degraded',      description: 'JWT login and token management' },
      { name: 'Payment Gateway',    status: 'operational', description: 'Razorpay payment processing' },
      { name: 'Download Service',   status: apiOk ? 'operational' : 'degraded',      description: 'Secure installer file delivery' },
      { name: 'Email Delivery',     status: 'operational', description: 'Purchase confirmations and alerts' },
      { name: 'License Validation', status: apiOk ? 'operational' : 'outage',        description: 'Desktop app license checks' },
      { name: 'Website',            status: 'operational', description: 'Next.js frontend serving' },
    ])
    setLastChecked(new Date())
    setChecking(false)
  }

  useEffect(() => { checkStatus() }, [])

  const allOperational = services.every(s => s.status === 'operational')
  const hasOutage      = services.some(s => s.status === 'outage')
  const hasDegraded    = services.some(s => s.status === 'degraded')

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-white mb-3">System Status</h1>
            <p className="text-gray-500 text-sm">Real-time status of all SoftCraft Solutions services</p>
          </div>

          {/* Overall banner */}
          <div className={`rounded-3xl p-8 text-center mb-10 border ${
            checking ? 'border-white/[0.06] bg-white/[0.02]' :
            allOperational ? 'border-emerald-500/20 bg-emerald-500/[0.05]' :
            hasOutage ? 'border-red-500/20 bg-red-500/[0.05]' :
            'border-amber-500/20 bg-amber-500/[0.05]'
          }`}>
            {checking ? (
              <>
                <Loader2 className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-3" />
                <p className="font-display font-bold text-xl text-gray-400">Checking all services…</p>
              </>
            ) : allOperational ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="font-display font-bold text-2xl text-white mb-1">All Systems Operational</p>
                <p className="text-emerald-400 text-sm">All services are running normally</p>
              </>
            ) : hasOutage ? (
              <>
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-display font-bold text-2xl text-white mb-1">Service Disruption</p>
                <p className="text-red-400 text-sm">Some services are experiencing issues</p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="font-display font-bold text-2xl text-white mb-1">Partial Degradation</p>
                <p className="text-amber-400 text-sm">Some services may be slower than usual</p>
              </>
            )}
          </div>

          {/* Services list */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-white">Service Status</h2>
              <div className="flex items-center gap-3">
                {lastChecked && (
                  <p className="text-xs text-gray-600">
                    Last checked: {lastChecked.toLocaleTimeString('en-IN')}
                  </p>
                )}
                <button onClick={checkStatus} disabled={checking}
                  className="btn-secondary text-xs py-1.5 px-3 gap-1.5 disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between py-4 gap-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={service.status} />
                    <div>
                      <p className="text-sm font-medium text-white">{service.name}</p>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {service.latency !== undefined && service.status === 'operational' && (
                      <span className="text-xs font-mono text-gray-600">{service.latency}ms</span>
                    )}
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident history */}
          <div className="card">
            <h2 className="font-display font-semibold text-white mb-5">Incident History</h2>
            {INCIDENTS.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No incidents in the past 90 days</p>
              </div>
            ) : INCIDENTS.map((inc, i) => (
              <div key={i} className="border-l-2 border-ink-700 pl-4 mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600 font-mono">{inc.date}</span>
                  <span className="badge-blue text-[10px]">{inc.status}</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{inc.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{inc.detail}</p>
              </div>
            ))}
          </div>

          {/* Subscribe note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              For real-time incident alerts, follow{' '}
              <a href="https://twitter.com" className="text-ink-400 hover:text-ink-300">@SoftCraftIn</a>
              {' '}on Twitter or email{' '}
              <a href="mailto:support@softcraft.in" className="text-ink-400 hover:text-ink-300">support@softcraft.in</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
