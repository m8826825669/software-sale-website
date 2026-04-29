'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const schema = z.object({
  password:  z.string().min(8, 'At least 8 characters'),
  password2: z.string(),
}).refine(d => d.password === d.password2, { message: 'Passwords do not match', path: ['password2'] })

function ResetPasswordContent() {
  const [showPwd, setShowPwd] = useState(false)
  const [done,    setDone]    = useState(false)
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get('token')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ password }: any) => {
    if (!token) { toast.error('Invalid reset link.'); return }
    try {
      await authAPI.resetPassword({ token, password })
      setDone(true)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Reset link is invalid or expired.')
    }
  }

  if (!token) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md glass rounded-3xl p-10">
        <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-white mb-3">Invalid Reset Link</h2>
        <p className="text-gray-500 text-sm mb-6">This link is invalid or has already been used.</p>
        <Link href="/auth/forgot-password" className="btn-primary w-full justify-center">Request New Link</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 p-6">
      <div className="absolute inset-0 bg-grid-ink pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        {done ? (
          <div className="glass rounded-3xl p-10 text-center border border-emerald-500/20">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Password reset!</h1>
            <p className="text-gray-500 text-sm mb-6">Your password has been changed. You can now sign in.</p>
            <Link href="/auth/login" className="btn-primary w-full justify-center py-3">Sign In Now</Link>
          </div>
        ) : (
          <div className="glass rounded-3xl p-8 border border-white/[0.07]">
            <div className="w-12 h-12 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mb-6">
              <Lock className="w-5 h-5 text-ink-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">Set new password</h1>
            <p className="text-gray-500 text-sm mb-7">Choose a strong password for your account.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} {...register('password')}
                    className="input-field pr-12" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message as string}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
                <input type="password" {...register('password2')} className="input-field" placeholder="Repeat new password" />
                {errors.password2 && <p className="mt-1.5 text-xs text-red-400">{errors.password2.message as string}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  )
}