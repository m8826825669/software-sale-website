import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'Terms of Service' }

const SECTIONS = [
  { title: '1. Acceptance of Terms', content: 'By accessing our website or purchasing any software product from SoftCraft Solutions, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.' },
  { title: '2. License Grant', content: 'Upon successful payment, SoftCraft Solutions grants you a non-exclusive, non-transferable license to install and use the purchased software on the number of devices specified in your chosen plan. This license is for the licensee only and may not be sublicensed, resold, or transferred without written permission.\n\nStarter: 1 device · Professional: 3 devices · Enterprise: 10 devices' },
  { title: '3. Prohibited Uses', content: 'You may not: redistribute, resell, or sublicense the software; reverse engineer, decompile, or disassemble the software (except where permitted by law); share your license key with others; use the software for unlawful purposes; remove copyright or license notices from the software.' },
  { title: '4. Payment & Pricing', content: 'All prices are in Indian Rupees (INR) and are exclusive of GST (18%). GST is added at checkout and is reflected on your invoice. Prices may change at any time but will not affect completed purchases. Payment is processed securely via Razorpay.' },
  { title: '5. Refund Policy', content: 'We offer a 7-day money-back guarantee. If the software does not work on your system or does not meet your needs, contact us within 7 days of purchase for a full refund. Refunds are not available after 7 days or if more than 50% of the license activations have been used. Refunds are processed within 5-7 business days to your original payment method.' },
  { title: '6. Updates & Support', content: 'Your license includes free software updates for the period specified in your plan (1 year for Starter, 2 years for Professional, lifetime for Enterprise). Updates include bug fixes, performance improvements, and new features. Support is provided via email with a response time of 1-2 business days, and WhatsApp for Professional and Enterprise plans.' },
  { title: '7. Intellectual Property', content: 'All software, code, design, documentation, and branding are the exclusive property of SoftCraft Solutions and are protected by Indian and international copyright law. Nothing in these Terms grants you ownership of any intellectual property.' },
  { title: '8. Disclaimer of Warranties', content: 'The software is provided "as is" without warranty of any kind. We make no warranty that the software will meet your specific requirements or operate without interruption. You use the software at your own risk. SoftCraft Solutions\' total liability in any matter related to the software shall not exceed the amount you paid for the license.' },
  { title: '9. Limitation of Liability', content: 'SoftCraft Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the software, including but not limited to loss of data, loss of profits, or business interruption.' },
  { title: '10. Governing Law', content: 'These Terms shall be governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.' },
  { title: '11. Modifications', content: 'We reserve the right to modify these Terms at any time. We will notify users of material changes via email. Continued use of our services after such notification constitutes acceptance of the updated Terms.' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">
          <div className="mb-12">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">Legal</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="glass rounded-3xl p-8 mb-8">
            <p className="text-gray-400 leading-relaxed">
              These Terms of Service constitute a legally binding agreement between you and SoftCraft Solutions regarding your use of our website and purchase of our software products. Please read them carefully.
            </p>
          </div>

          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="border-l-2 border-ink-700/60 pl-6">
                <h2 className="font-display font-semibold text-white text-lg mb-3">{s.title}</h2>
                {s.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-500 text-sm leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 glass rounded-2xl border border-ink-700/30 text-sm text-gray-500">
            <p>Questions about these terms? Contact us at <a href="mailto:legal@softcraft.in" className="text-ink-400 hover:text-ink-300">legal@softcraft.in</a> or read our <Link href="/privacy" className="text-ink-400 hover:text-ink-300">Privacy Policy</Link>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
