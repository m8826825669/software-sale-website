import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = { title: 'Privacy Policy' }

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide when creating an account (name, email, phone, company), information generated during purchases (billing details, payment method, GST number), and usage data (download history, license activations, login timestamps).\n\nWe do NOT collect data from inside the software you purchase — our products are offline-first and do not transmit data to our servers.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `Your information is used to: process payments and generate GST invoices, deliver license keys and software downloads, provide customer support, send purchase receipts and important account notifications, and improve our products and website.\n\nWe do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '3. Payment Security',
    content: `All payments are processed by Razorpay, a PCI-DSS compliant payment gateway. We do not store any credit/debit card information on our servers. Razorpay's privacy policy governs the handling of your payment data. Transaction details are encrypted using industry-standard TLS 1.3.`,
  },
  {
    title: '4. Data Storage & Security',
    content: `Your data is stored on servers located in India. We implement industry-standard security measures including encrypted databases, secure HTTPS connections, JWT authentication with token rotation, and rate limiting on all API endpoints. Access to production data is restricted to authorised personnel only.`,
  },
  {
    title: '5. Cookies',
    content: `We use only essential cookies necessary for authentication (JWT tokens stored in browser localStorage). We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You may clear your browser storage at any time to remove session data.`,
  },
  {
    title: '6. Third-Party Services',
    content: `We use Razorpay for payment processing. Their privacy policy is available at razorpay.com/privacy. We may use email service providers to deliver transactional emails (purchase receipts, password resets). We do not use social login, advertising networks, or analytics services that track you across websites.`,
  },
  {
    title: '7. Data Retention',
    content: `Account data is retained as long as your account is active or as needed to provide services. Order and invoice data is retained for 7 years as required by Indian tax laws (GST compliance). You may request deletion of your account and personal data by emailing support@softcraft.in — note that invoice records cannot be deleted due to legal requirements.`,
  },
  {
    title: '8. Your Rights',
    content: `You have the right to access, correct, and delete your personal data. To exercise these rights, email support@softcraft.in with "Privacy Request" in the subject. We will respond within 14 business days. You may also opt out of non-essential communications from your account settings.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `Our services are not directed to children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes by email or a prominent notice on our website. Your continued use of our services after such changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    content: `For privacy-related questions or requests:\n\nSoftCraft Solutions\nEmail: privacy@softcraft.in\nAddress: Noida, Uttar Pradesh - 201301, India\nGST: 09AAAAA0000A1Z5 (placeholder — update with real GST)`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">
          <div className="mb-12">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">Legal</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="glass rounded-3xl p-8 mb-8">
            <p className="text-gray-400 leading-relaxed">
              SoftCraft Solutions ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and purchase our software products.
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
        </div>
      </div>
      <Footer />
    </div>
  )
}
