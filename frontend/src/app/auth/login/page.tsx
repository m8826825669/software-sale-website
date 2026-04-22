'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Form = z.infer<typeof schema>

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const { login, isLoading } = useAuthStore()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Login failed'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0d0e20 0%, #181257 100%)' }}
      >
        <div className="absolute inset-0 bg-grid-ink" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #5a5fff, transparent)' }} />
        <div className="relative z-10 max-w-sm text-center">
          <Link href="/" className="flex items-center gap-3 justify-center mb-12">
            <div className="w-10 h-10 rounded-xl bg-ink-600 flex items-center justify-center glow-ink">
              <span className="text-white font-display font-bold">SC</span>
            </div>
            <span className="font-display font-bold text-xl text-white">SoftCraft<span className="text-ink-400">.</span></span>
          </Link>
          <h2 className="font-display text-3xl font-bold text-white mb-4">Premium Desktop Software</h2>
          <p className="text-gray-500 leading-relaxed mb-10">One-time purchase. Lifetime license. No subscriptions. Built for India.</p>
          <div className="space-y-4 text-left">
            {['Secure license management', 'Instant downloads after purchase', 'GST invoices included', '7-day money-back guarantee'].map(t => (
              <div key={t} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-5 h-5 rounded-full bg-ink-900 border border-ink-600 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-ink-400" />
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-ink-600 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">SC</span>
            </div>
            <span className="font-display font-bold text-lg text-white">SoftCraft<span className="text-ink-400">.</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to access your software and licenses</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" {...register('email')} className="input-field"
                placeholder="you@example.com" />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-ink-400 hover:text-ink-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} {...register('password')}
                  className="input-field pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
            <div className="relative text-center"><span className="px-4 text-xs text-gray-600 bg-surface-950">OR</span></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-ink-400 hover:text-ink-300 font-medium">Create one free →</Link>
          </p>

          <p className="text-center text-xs text-gray-700 mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-gray-600 hover:text-gray-400">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gray-600 hover:text-gray-400">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
