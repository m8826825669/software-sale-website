'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const schema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Enter a valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Only lowercase, numbers, underscores'),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
}).refine(d => d.password === d.password2, { message: 'Passwords do not match', path: ['password2'] })

type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const pwd = watch('password', '')
  const pwdChecks = [
    { label: 'At least 8 characters', ok: pwd.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(pwd) },
    { label: 'Contains a letter', ok: /[a-zA-Z]/.test(pwd) },
  ]

  const onSubmit = async (data: Form) => {
    try {
      await registerUser(data)
      toast.success('Account created! Welcome aboard.')
      router.push('/dashboard')
    } catch (err: any) {
      const errs = err.response?.data
      const msg = errs?.email?.[0] || errs?.username?.[0] || errs?.detail || 'Registration failed'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 p-6">
      <div className="absolute inset-0 bg-grid-ink opacity-100 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[130px] opacity-[0.08] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5a5fff, transparent)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ink-600 flex items-center justify-center glow-ink">
              <span className="text-white font-display font-bold text-sm">SC</span>
            </div>
            <span className="font-display font-bold text-lg text-white">SoftCraft<span className="text-ink-400">.</span></span>
          </Link>
        </div>

        <div className="glass rounded-3xl p-8 border-white/[0.07]">
          <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-7">Join thousands of businesses using SoftCraft software</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
                <input {...register('first_name')} className="input-field" placeholder="Rahul" />
                {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
                <input {...register('last_name')} className="input-field" placeholder="Sharma" />
                {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input type="email" {...register('email')} className="input-field" placeholder="rahul@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
              <input {...register('username')} className="input-field" placeholder="rahul_sharma" />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone (optional)</label>
                <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Company (optional)</label>
                <input {...register('company')} className="input-field" placeholder="Your School / Clinic" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} {...register('password')}
                  className="input-field pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwd && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {pwdChecks.map(c => (
                    <div key={c.label} className={`flex items-center gap-1 text-[10px] ${c.ok ? 'text-emerald-400' : 'text-gray-600'}`}>
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      {c.label}
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <input type="password" {...register('password2')} className="input-field" placeholder="••••••••" />
              {errors.password2 && <p className="mt-1 text-xs text-red-400">{errors.password2.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60 mt-2">
              {isLoading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-ink-400 hover:text-ink-300 font-medium">Sign in →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
