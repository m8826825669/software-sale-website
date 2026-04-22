'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const schema = z.object({ email: z.string().email('Enter a valid email') })

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email }: any) => {
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch { toast.error('Something went wrong. Try again.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 p-6">
      <div className="absolute inset-0 bg-grid-ink pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        {sent ? (
          <div className="glass rounded-3xl p-10 text-center border border-emerald-500/20">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Check your inbox</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              If that email is registered, we've sent a password reset link. Check your spam folder too.
            </p>
            <Link href="/auth/login" className="btn-primary w-full justify-center py-3">Back to Sign In</Link>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 border border-white/[0.07]">
            <div className="w-12 h-12 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mb-6">
              <Mail className="w-5 h-5 text-ink-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Reset password</h1>
            <p className="text-gray-500 text-sm mb-7">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                <input type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message as string}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
