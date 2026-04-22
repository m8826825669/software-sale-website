'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, CreditCard, CheckCircle2, ArrowLeft, Loader2, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/lib/store'
import { ordersAPI, productsAPI } from '@/lib/api'
import toast from 'react-hot-toast'

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const planId = searchParams.get('plan')

  const [product, setProduct] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      billing_name: user?.full_name || '',
      billing_phone: user?.phone || '',
      billing_address: '',
      gst_number: '',
    }
  })

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return }
    const fetch = async () => {
      try {
        const { data } = await productsAPI.detail(params.slug as string)
        setProduct(data)
        const selectedPlan = planId
          ? data.plans.find((p: any) => p.id === planId)
          : data.plans[0]
        setPlan(selectedPlan)
      } catch {
        router.push('/products')
      }
      setLoading(false)
    }
    fetch()
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const onSubmit = async (formData: any) => {
    if (!plan || paying) return
    setPaying(true)
    try {
      const { data: orderData } = await ordersAPI.create({ plan_id: plan.id, ...formData })

      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SoftCraft Solutions',
        description: orderData.description,
        order_id: orderData.razorpay_order_id,
        prefill: orderData.prefill,
        theme: { color: '#5a5fff' },
        modal: { backdropclose: false },
        handler: async (response: any) => {
          try {
            const verifyRes = await ordersAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast.success('🎉 Payment successful! Your license key is ready.')
            const successParams = new URLSearchParams({
              order: verifyRes.data.order_number || response.razorpay_order_id,
              product: product?.name || '',
              key: verifyRes.data.license_key || '',
            })
            router.push(`/payment-success?${successParams.toString()}`)
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        'modal.ondismiss': () => {
          setPaying(false)
          toast.error('Payment cancelled.')
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment')
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-ink-400 animate-spin" />
    </div>
  )

  const price = plan ? parseFloat(plan.price) : 0
  const tax = Math.round(price * 18) / 100
  const total = price + tax

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-5xl">
          <Link href={`/products/${params.slug}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to product
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <h1 className="font-display text-2xl font-bold text-white mb-6">Complete your purchase</h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-ink-400" /> Billing Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name *</label>
                      <input {...register('billing_name', { required: 'Name is required' })}
                        className="input-field" placeholder="Rahul Sharma" />
                      {errors.billing_name && <p className="mt-1 text-xs text-red-400">{errors.billing_name.message as string}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
                      <input {...register('billing_phone')} className="input-field" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Billing Address</label>
                      <textarea {...register('billing_address')} className="input-field resize-none" rows={2}
                        placeholder="Street, City, State, PIN" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">GST Number (optional)</label>
                      <input {...register('gst_number')} className="input-field" placeholder="22AAAAA0000A1Z5" />
                      <p className="mt-1 text-[10px] text-gray-600">Enter for B2B GST invoice</p>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-500" /> 256-bit SSL</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-ink-400" /> Razorpay Secured</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> 7-Day Refund</span>
                </div>

                <button type="submit" disabled={paying}
                  className="btn-gold w-full justify-center py-4 text-base font-bold disabled:opacity-60">
                  {paying
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                    : <>Pay ₹{total.toLocaleString('en-IN')} · Get License Now</>}
                </button>

                <p className="text-center text-xs text-gray-600">
                  By purchasing, you agree to our{' '}
                  <Link href="/eula" className="text-gray-500 hover:text-gray-300">License Agreement</Link>{' '}
                  and{' '}
                  <Link href="/refund" className="text-gray-500 hover:text-gray-300">Refund Policy</Link>
                </p>
              </form>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="card sticky top-28">
                <h3 className="font-display font-semibold text-white mb-4">Order Summary</h3>
                {product && (
                  <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] mb-4">
                    <div className="text-4xl">{product.emoji || '📦'}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{plan?.name} License</p>
                    </div>
                  </div>
                )}

                {plan && (
                  <>
                    <div className="space-y-3 text-sm mb-4">
                      {plan.features_included?.slice(0, 5).map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/[0.06] pt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>License price</span>
                        <span>₹{price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>GST (18%)</span>
                        <span>₹{tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/[0.06]">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-emerald-400">
                      ✓ {plan.max_devices} device{plan.max_devices > 1 ? 's' : ''} · {plan.billing_cycle === 'one_time' ? 'Lifetime' : plan.billing_cycle} license · Free updates 1 year
                    </div>
                  </>
                )}

                <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-gray-600 space-y-1">
                  <p>💳 UPI · Cards · Net Banking · EMI</p>
                  <p>📄 GST invoice sent instantly to {user?.email}</p>
                  <p>🔑 License key in dashboard after payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
