'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Key, CheckCircle2, XCircle, Loader2, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { licensesAPI } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

interface Result { valid: boolean; product?: string; plan?: string; user?: string; expires_at?: string | null; error?: string }

export default function ValidatePage() {
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<{ license_key: string; machine_id: string }>()

  const onSubmit = async (data: any) => {
    setLoading(true)
    setResult(null)
    try {
      const { data: res } = await licensesAPI.validate({
        license_key: data.license_key.trim().toUpperCase(),
        machine_id: data.machine_id.trim() || 'web-validator',
      })
      setResult(res)
    } catch (err: any) {
      setResult({ valid: false, error: err.response?.data?.error || 'Validation failed. Check the key and try again.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-7 h-7 text-ink-400" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">License Validator</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your license key to verify it is genuine, active, and not expired.
            </p>
          </div>

          {/* Form */}
          <div className="card mb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">License Key</label>
                <input
                  {...register('license_key', {
                    required: 'License key is required',
                    pattern: { value: /^[A-Z0-9]{5}(-[A-Z0-9]{5}){4}$/, message: 'Format: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' }
                  })}
                  className="input-field font-mono tracking-widest text-center text-lg"
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  onChange={e => {
                    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    v = v.match(/.{1,5}/g)?.join('-') || v
                    e.target.value = v.slice(0, 29)
                  }}
                />
                {errors.license_key && <p className="mt-1.5 text-xs text-red-400">{errors.license_key.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Machine ID <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <input {...register('machine_id')} className="input-field font-mono text-sm"
                  placeholder="Leave blank for basic validation" />
                <p className="mt-1.5 text-xs text-gray-600">
                  Enter your machine ID to verify activation on this specific device.
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Key className="w-4 h-4" /> Validate License</>}
              </button>
            </form>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                className={`rounded-2xl p-6 border ${
                  result.valid
                    ? 'border-emerald-500/30 bg-emerald-500/[0.06]'
                    : 'border-red-500/30 bg-red-500/[0.06]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.valid
                    ? <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                    : <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <h3 className={`font-display font-bold text-lg mb-1 ${result.valid ? 'text-emerald-300' : 'text-red-300'}`}>
                      {result.valid ? '✓ Valid License' : '✗ Invalid License'}
                    </h3>
                    {result.valid ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-2 border-b border-white/[0.06]">
                          <span className="text-gray-500">Product</span>
                          <span className="text-white font-medium">{result.product}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/[0.06]">
                          <span className="text-gray-500">Plan</span>
                          <span className="text-white font-medium">{result.plan}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-white/[0.06]">
                          <span className="text-gray-500">Registered To</span>
                          <span className="text-white font-medium">{result.user}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Expiry</span>
                          <span className="text-white font-medium">
                            {result.expires_at
                              ? new Date(result.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                              : '♾️ Lifetime'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="mt-8 p-4 glass rounded-2xl text-xs text-gray-600 leading-relaxed space-y-1.5">
            <p className="font-medium text-gray-500">ℹ️ About license validation</p>
            <p>• Validation checks that your key is genuine and active in our system.</p>
            <p>• Each validation with a new Machine ID counts as one activation.</p>
            <p>• Lost your license key? Sign in to your dashboard to retrieve it.</p>
            <p>• Need help? Email <span className="text-ink-400">support@softcraft.in</span></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
