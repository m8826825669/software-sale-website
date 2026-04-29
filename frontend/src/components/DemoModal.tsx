'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Download, Calendar, CheckCircle2, Loader2,
         Monitor, Clock, ExternalLink, Smartphone, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export interface DemoConfig {
  type: 'online' | 'trial' | 'request' | 'none'
  url?: string        // for 'online' type
  trialDays?: number  // for 'trial' type
  productName: string
  productSlug: string
  productEmoji?: string
}

interface Props {
  demo: DemoConfig
  open: boolean
  onClose: () => void
}

// ── Online Demo Panel ────────────────────────────────────────────────────────
function OnlineDemoPanel({ demo, onClose }: { demo: DemoConfig; onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{demo.productEmoji || '📦'}</div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Try {demo.productName} Live</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        A fully interactive demo with sample data pre-loaded. No signup required. Resets every 24 hours.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Globe,       label: 'No install',   sub: 'Runs in browser' },
          { icon: Monitor,     label: 'Full features', sub: 'Nothing hidden' },
          { icon: Clock,       label: 'Always on',    sub: 'Available 24/7' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <Icon className="w-5 h-5 text-ink-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">{label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-300 mb-6 text-left">
        <p className="font-semibold mb-1">⚠️ Demo limitations</p>
        <p className="text-gray-500">Data resets every 24 hours. Some features (email, PDF export) are disabled. Do not enter real patient/student data.</p>
      </div>

      <a href={demo.url} target="_blank" rel="noopener noreferrer"
        onClick={onClose}
        className="btn-primary w-full justify-center py-4 text-base font-bold gap-2 mb-3">
        <ExternalLink className="w-5 h-5" /> Open Live Demo
      </a>
      <p className="text-xs text-gray-600">Opens in a new tab · No account needed</p>
    </div>
  )
}

// ── Trial Download Panel ──────────────────────────────────────────────────────
function TrialPanel({ demo, onClose }: { demo: DemoConfig; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; email: string; phone: string }>()

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await api.post('/products/demo-request/', {
        ...data, product_name: demo.productName, product_slug: demo.productSlug, demo_type: 'trial',
      })
      setDone(true)
    } catch {
      toast.error('Failed to submit. WhatsApp us at +91 98765 43210.')
    }
    setLoading(false)
  }

  if (done) return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-3">Trial request received!</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-2">
        Your <span className="text-white font-medium">{demo.trialDays}-day trial download link</span> will be emailed within 1 hour.
      </p>
      <p className="text-xs text-gray-600 mb-8">Check your spam folder if you don&apos;t see it.</p>
      <button onClick={onClose} className="btn-secondary w-full justify-center">Done</button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">{demo.productEmoji || '📦'}</div>
        <div>
          <h2 className="font-display text-xl font-bold text-white">{demo.productName}</h2>
          <p className="text-sm text-emerald-400 font-medium">{demo.trialDays}-day free trial</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: `${demo.trialDays} days`,  sub: 'Full access' },
          { label: 'All features', sub: 'Nothing locked' },
          { label: 'No card',      sub: 'Required' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-white">{s.label}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
          <input {...register('name', { required: 'Required' })} className="input-field" placeholder="Rahul Sharma" />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address *</label>
          <input type="email" {...register('email', { required: 'Required' })} className="input-field" placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone (WhatsApp)</label>
          <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base font-bold gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5" /> Get Free Trial</>}
        </button>
      </form>
      <p className="text-center text-xs text-gray-600 mt-3">
        Download link emailed within 1 hour · No credit card required
      </p>
    </div>
  )
}

// ── Live Demo Request Panel ──────────────────────────────────────────────────
function RequestPanel({ demo, onClose }: { demo: DemoConfig; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<{
    name: string; email: string; phone: string; company: string; preferred_time: string; message: string
  }>()

  const TIME_SLOTS = [
    '9 AM – 11 AM IST', '11 AM – 1 PM IST', '2 PM – 4 PM IST', '4 PM – 6 PM IST', 'Flexible / Anytime',
  ]

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await api.post('/products/demo-request/', {
        ...data, product_name: demo.productName, product_slug: demo.productSlug, demo_type: 'live',
      })
      setDone(true)
    } catch {
      toast.error('Failed to submit. WhatsApp us at +91 98765 43210.')
    }
    setLoading(false)
  }

  if (done) return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-ink-500/10 border border-ink-500/30 flex items-center justify-center mx-auto mb-5">
        <Calendar className="w-8 h-8 text-ink-400" />
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-3">Demo request confirmed!</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-2">
        Our team will contact you within <span className="text-white font-medium">4 business hours</span> to schedule your demo.
      </p>
      <p className="text-xs text-gray-600 mb-8">
        Can&apos;t wait? WhatsApp us directly: <a href="https://wa.me/919876543210" className="text-ink-400">+91 98765 43210</a>
      </p>
      <button onClick={onClose} className="btn-secondary w-full justify-center">Done</button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">{demo.productEmoji || '📦'}</div>
        <div>
          <h2 className="font-display text-xl font-bold text-white">{demo.productName}</h2>
          <p className="text-sm text-ink-400 font-medium">Schedule a live demo</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {[
          { icon: Smartphone, label: 'WhatsApp / Google Meet' },
          { icon: Clock,      label: '30-minute session' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-gray-400">
            <Icon className="w-3.5 h-3.5 text-ink-400" />
            {label}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Name *</label>
            <input {...register('name', { required: 'Required' })} className="input-field" placeholder="Rahul Sharma" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone *</label>
            <input {...register('phone', { required: 'Required' })} className="input-field" placeholder="+91 98765 43210" />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Email *</label>
          <input type="email" {...register('email', { required: 'Required' })} className="input-field" placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">School / Clinic / Business Name</label>
          <input {...register('company')} className="input-field" placeholder="Your organisation" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Preferred Time</label>
          <select {...register('preferred_time')} className="input-field" style={{ colorScheme: 'dark' }}>
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Anything specific to cover?</label>
          <textarea {...register('message')} className="input-field resize-none" rows={2}
            placeholder="e.g. fee management, attendance reports, GST billing..." />
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base font-bold gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Calendar className="w-5 h-5" /> Request Demo</>}
        </button>
      </form>
      <p className="text-center text-xs text-gray-600 mt-3">Free · No obligation · Response within 4 hours</p>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function DemoModal({ demo, open, onClose }: Props) {
  const [tab, setTab] = useState<'online' | 'trial' | 'request'>(
    demo.type === 'online' ? 'online' : demo.type === 'trial' ? 'trial' : 'request'
  )

  const tabs = [
    demo.type === 'online'  && { id: 'online'  as const, icon: Globe,    label: 'Live Demo' },
    demo.type === 'trial'   && { id: 'trial'   as const, icon: Download, label: 'Free Trial' },
    (demo.type === 'request' || demo.type === 'online' || demo.type === 'trial')
                            && { id: 'request' as const, icon: Calendar, label: 'Schedule Demo' },
  ].filter(Boolean) as { id: typeof tab; icon: any; label: string }[]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg glass rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-ink-400" />
                  <span className="font-display font-semibold text-white text-sm">Try Before You Buy</span>
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl glass-light flex items-center justify-center text-gray-500 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab bar (only show if multiple tabs) */}
              {tabs.length > 1 && (
                <div className="flex gap-1 px-4 pt-4">
                  {tabs.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all flex-1 justify-center ${
                        tab === t.id ? 'bg-ink-700 text-white' : 'text-gray-500 hover:text-gray-300 glass-light'
                      }`}>
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div key={tab}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}>
                    {tab === 'online'  && <OnlineDemoPanel  demo={demo} onClose={onClose} />}
                    {tab === 'trial'   && <TrialPanel       demo={demo} onClose={onClose} />}
                    {tab === 'request' && <RequestPanel     demo={demo} onClose={onClose} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}