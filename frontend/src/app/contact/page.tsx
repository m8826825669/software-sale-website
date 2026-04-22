'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, MapPin, MessageSquare, Clock, Loader2, CheckCircle2, Send } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(4, 'Subject required'),
  category: z.enum(['sales', 'support', 'refund', 'partnership', 'other']),
  message: z.string().min(20, 'Please write at least 20 characters'),
})
type Form = z.infer<typeof schema>

const CONTACT_INFO = [
  { icon: Mail,    label: 'Email',         value: 'support@softcraft.in',  href: 'mailto:support@softcraft.in' },
  { icon: Phone,   label: 'WhatsApp',      value: '+91 98765 43210',       href: 'https://wa.me/919876543210' },
  { icon: MapPin,  label: 'Location',      value: 'Noida, UP — 201301',    href: null },
  { icon: Clock,   label: 'Support Hours', value: '9 AM – 6 PM IST, Mon–Sat', href: null },
]

const FAQS = [
  { q: 'How quickly will I receive my license?',     a: 'Instantly — your license key appears in your dashboard as soon as payment is confirmed.' },
  { q: 'Do you offer installation support?',         a: 'Yes! We guide you through installation via email or WhatsApp for Professional and Enterprise plans.' },
  { q: 'Can I get a demo before buying?',            a: 'Email us and we\'ll schedule a live demo call (Google Meet) for products above ₹5,000.' },
  { q: 'Do you offer educational discounts?',        a: 'Yes — schools and NGOs get 15% off. Contact us with your institution details.' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'support' },
  })

  const onSubmit = async (data: Form) => {
    try {
      const { data: res } = await import('@/lib/api').then(m => m.default.post('/auth/contact/', data))
      setSubmitted(true)
      toast.success('Message sent! We\'ll reply within 24 hours.')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send. Please email us directly.')
    }
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">

        {/* Header */}
        <div className="container-xl text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge-blue mb-5 inline-block font-mono">Contact</span>
            <h1 className="font-display text-5xl font-extrabold text-white mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Have a question? Want a demo? Need support? We're a real team of humans and we reply fast.
            </p>
          </motion.div>
        </div>

        <div className="container-xl max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left — Info */}
            <div className="lg:col-span-2 space-y-5">

              {/* Contact cards */}
              {CONTACT_INFO.map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-ink-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-white font-medium hover:text-ink-300 transition-colors text-sm">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium text-sm">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick FAQs */}
              <div className="card mt-6">
                <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-ink-400" /> Quick Answers
                </h3>
                <div className="space-y-4">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-medium text-gray-300 mb-1">{faq.q}</p>
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {submitted ? (
                <div className="card text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white mb-3">Message sent!</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                    Thanks for reaching out. We'll get back to you within 24 hours at your email address.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card">
                  <h2 className="font-display font-semibold text-white mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Your Name *</label>
                        <input {...register('name')} className="input-field" placeholder="Rahul Sharma" />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address *</label>
                        <input type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
                      <select {...register('category')}
                        className="input-field"
                        style={{ colorScheme: 'dark' }}>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales / Pre-purchase Question</option>
                        <option value="refund">Refund Request</option>
                        <option value="partnership">Partnership / Reseller</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject *</label>
                      <input {...register('subject')} className="input-field" placeholder="Brief description of your enquiry" />
                      {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Message *</label>
                      <textarea {...register('message')} rows={6} className="input-field resize-none"
                        placeholder="Describe your question or issue in detail. If reporting a bug, include your OS, Java version, and steps to reproduce." />
                      {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-gray-600">
                        We reply within <span className="text-gray-400 font-medium">24 hours</span> on business days
                      </p>
                      <button type="submit" disabled={isSubmitting} className="btn-primary gap-2 disabled:opacity-60">
                        {isSubmitting
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                          : <><Send className="w-4 h-4" /> Send Message</>}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
