import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, Mail } from 'lucide-react'

export const metadata = { title: 'Refund Policy' }

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">
          <div className="mb-12">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">Legal</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Refund Policy</h1>
            <p className="text-gray-500">We stand behind our software with a fair refund policy.</p>
          </div>

          {/* Guarantee card */}
          <div className="rounded-3xl p-8 mb-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1b3c, #0e0f1e)' }}>
            <div className="absolute inset-0 bg-grid-ink" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🛡️</div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">7-Day Money-Back Guarantee</h2>
              <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                If you're not completely satisfied with your purchase for any reason, contact us within 7 days for a full refund — no questions asked.
              </p>
            </div>
          </div>

          {/* Eligible vs not */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card border-emerald-500/20 bg-emerald-500/[0.03]">
              <h3 className="font-display font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Eligible for Refund
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  'Request made within 7 days of purchase',
                  'Software doesn\'t work on your operating system',
                  'Technical issues we cannot resolve within 48 hours',
                  'Product significantly different from description',
                  'Accidental duplicate purchase',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card border-red-500/20 bg-red-500/[0.03]">
              <h3 className="font-display font-semibold text-red-300 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" /> Not Eligible for Refund
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  'Request made after 7 days of purchase',
                  'More than 50% of device activations used',
                  'Downloaded and used extensively',
                  'Change of mind after successful use',
                  'Violations of license terms',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process */}
          <div className="card mb-10">
            <h2 className="font-display font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-ink-400" /> Refund Process
            </h2>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Contact Support', desc: 'Email support@softcraft.in with subject "Refund Request — [Order Number]". Include your order number (from dashboard) and reason for refund.' },
                { step: '02', title: 'Review (1-2 Business Days)', desc: 'Our team reviews your request. We may ask for additional information or attempt to resolve the issue before processing a refund.' },
                { step: '03', title: 'Approval & License Revocation', desc: 'Once approved, your license key is deactivated immediately. The software will stop functioning on your next license validation.' },
                { step: '04', title: 'Refund (5-7 Business Days)', desc: 'Refund is processed to your original payment method via Razorpay. Card refunds take 5-7 days. UPI/bank refunds take 2-3 days.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-ink-900 border border-ink-700/40 flex items-center justify-center text-sm font-display font-bold text-ink-400 shrink-0">{s.step}</div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{s.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-6 glass rounded-2xl flex items-center gap-4">
            <Mail className="w-10 h-10 text-ink-400 shrink-0" />
            <div>
              <p className="font-semibold text-white mb-1">Need to request a refund?</p>
              <p className="text-sm text-gray-500">Email <a href="mailto:support@softcraft.in" className="text-ink-400 hover:text-ink-300">support@softcraft.in</a> with your order number. We respond within 1 business day.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
