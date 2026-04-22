'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, User, Lock, Save } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/lib/store'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { first_name: '', last_name: '', phone: '', company: '' }
  })
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm()

  useEffect(() => {
    if (user) reset({ first_name: user.first_name, last_name: user.last_name, phone: (user as any).phone || '', company: (user as any).company || '' })
  }, [user])

  const onProfile = async (data: any) => {
    setLoading(true)
    try {
      await authAPI.updateProfile(data)
      await fetchProfile()
      toast.success('Profile updated successfully!')
    } catch { toast.error('Update failed. Try again.') }
    setLoading(false)
  }

  const onPassword = async (data: any) => {
    if (data.new_password !== data.confirm_password) { toast.error('Passwords do not match'); return }
    setPwdLoading(true)
    try {
      await authAPI.changePassword({ old_password: data.old_password, new_password: data.new_password })
      toast.success('Password changed successfully!')
      resetPwd()
    } catch (err: any) {
      toast.error(err.response?.data?.old_password?.[0] || 'Password change failed')
    }
    setPwdLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-white mb-8">Account Settings</h1>

          {/* Profile form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
            <h2 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-ink-400" /> Personal Information
            </h2>
            <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">First Name</label>
                  <input {...register('first_name')} className="input-field" placeholder="Rahul" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Last Name</label>
                  <input {...register('last_name')} className="input-field" placeholder="Sharma" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
                <input type="email" value={user?.email || ''} disabled
                  className="input-field opacity-50 cursor-not-allowed" />
                <p className="mt-1 text-xs text-gray-600">Email cannot be changed. Contact support if needed.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
                <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Company / School / Clinic</label>
                <input {...register('company')} className="input-field" placeholder="Your organization name" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary gap-2 disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Password form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <h2 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-ink-400" /> Change Password
            </h2>
            <form onSubmit={handlePwd(onPassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
                <input type="password" {...regPwd('old_password', { required: true })} className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                <input type="password" {...regPwd('new_password', { required: true, minLength: 8 })} className="input-field" placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                <input type="password" {...regPwd('confirm_password', { required: true })} className="input-field" placeholder="Repeat new password" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={pwdLoading} className="btn-primary gap-2 disabled:opacity-60">
                  {pwdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
