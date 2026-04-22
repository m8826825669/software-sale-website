import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Deployment Checklist' }

const SECTIONS = [
  {
    title: '🔐 Security',
    items: [
      { text: 'Change SECRET_KEY to a 50+ char random string', critical: true },
      { text: 'Set DEBUG=False in production', critical: true },
      { text: 'Configure ALLOWED_HOSTS with your actual domain', critical: true },
      { text: 'Set CORS_ALLOWED_ORIGINS to your frontend domain only', critical: true },
      { text: 'Restrict Django admin to office IP in nginx.conf', critical: true },
      { text: 'Replace Razorpay test keys with live keys after KYC', critical: true },
      { text: 'Install SSL certificates (Let\'s Encrypt recommended)', critical: true },
      { text: 'Enable HSTS in settings (already configured for production)', critical: false },
      { text: 'Set up fail2ban to block brute-force login attempts', critical: false },
    ],
  },
  {
    title: '🗄️ Database',
    items: [
      { text: 'Switch from SQLite to PostgreSQL 16', critical: true },
      { text: 'Set DB_PASSWORD to a strong, unique password', critical: true },
      { text: 'Run python manage.py migrate after deployment', critical: true },
      { text: 'Set up automated daily database backups', critical: true },
      { text: 'Test backup restoration at least once', critical: false },
      { text: 'Configure PostgreSQL connection pooling (pgBouncer)', critical: false },
    ],
  },
  {
    title: '📧 Email',
    items: [
      { text: 'Configure SMTP settings (Gmail App Password or SendGrid)', critical: true },
      { text: 'Set DEFAULT_FROM_EMAIL to your actual domain email', critical: true },
      { text: 'Test forgot-password email flow end-to-end', critical: true },
      { text: 'Test purchase confirmation email with a real order', critical: true },
      { text: 'Set up email domain authentication (SPF, DKIM, DMARC)', critical: false },
    ],
  },
  {
    title: '💳 Payments',
    items: [
      { text: 'Complete Razorpay KYC for live payments', critical: true },
      { text: 'Replace test keys with live RAZORPAY_KEY_ID and SECRET', critical: true },
      { text: 'Test full payment flow on live keys before launch', critical: true },
      { text: 'Set up Razorpay webhook for payment failure notifications', critical: false },
      { text: 'Configure Razorpay settlement bank account', critical: true },
    ],
  },
  {
    title: '🚀 Deployment',
    items: [
      { text: 'Build Docker images: docker-compose build', critical: true },
      { text: 'Upload installer files to backend/media/products/installers/', critical: true },
      { text: 'Run python manage.py seed_products to load products', critical: true },
      { text: 'Run python manage.py createsuperuser to create admin', critical: true },
      { text: 'Run python manage.py collectstatic', critical: true },
      { text: 'Configure Nginx with SSL certs (fullchain.pem + privkey.pem)', critical: true },
      { text: 'Set up systemd or supervisor to auto-restart services', critical: false },
      { text: 'Configure Redis for caching and session storage', critical: false },
    ],
  },
  {
    title: '🔍 Pre-Launch Testing',
    items: [
      { text: 'Register a new account and verify email flow', critical: true },
      { text: 'Complete a full purchase with a Razorpay test transaction', critical: true },
      { text: 'Verify license key appears in dashboard after purchase', critical: true },
      { text: 'Download an installer using the license download feature', critical: true },
      { text: 'Test admin panel — view orders, users, licenses', critical: true },
      { text: 'Test forgot password end-to-end', critical: true },
      { text: 'Test on mobile (Navbar, checkout form, dashboard)', critical: false },
      { text: 'Run Lighthouse audit — target score > 85', critical: false },
    ],
  },
  {
    title: '📈 Post-Launch',
    items: [
      { text: 'Submit sitemap to Google Search Console', critical: false },
      { text: 'Set up uptime monitoring (Better Uptime, UptimeRobot)', critical: false },
      { text: 'Configure error alerting (Sentry or similar)', critical: false },
      { text: 'Set up Google Analytics 4 (optional, privacy-friendly)', critical: false },
      { text: 'Add your real GST number and company address to Footer', critical: true },
      { text: 'Update nginx.conf with your actual domain and office IP', critical: true },
    ],
  },
]

export default function ChecklistPage() {
  const criticalCount = SECTIONS.flatMap(s => s.items).filter(i => i.critical).length
  const totalCount    = SECTIONS.flatMap(s => s.items).length

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">
          <div className="mb-12">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">DevOps</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Deployment Checklist</h1>
            <p className="text-gray-500 leading-relaxed">
              Complete these steps before going live. Items marked{' '}
              <span className="text-red-400 font-medium">Critical</span> must be done —
              others are strongly recommended.
            </p>
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl p-6 mb-10 flex items-center gap-6">
            <div className="text-center px-4 border-r border-white/[0.08]">
              <p className="font-display font-bold text-3xl text-red-400">{criticalCount}</p>
              <p className="text-xs text-gray-600 mt-0.5">Critical items</p>
            </div>
            <div className="text-center px-4 border-r border-white/[0.08]">
              <p className="font-display font-bold text-3xl text-white">{totalCount}</p>
              <p className="text-xs text-gray-600 mt-0.5">Total items</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 leading-relaxed">
                Print this page or open it alongside your terminal as you deploy.
                Typical deployment time: <span className="text-white font-medium">2–4 hours</span> for an experienced developer.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-display font-bold text-xl text-white mb-5">{section.title}</h2>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                        item.critical
                          ? 'border-red-500/15 bg-red-500/[0.04]'
                          : 'border-white/[0.06] bg-white/[0.02]'
                      }`}>
                      <Circle className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300 leading-relaxed flex-1">{item.text}</p>
                      {item.critical && (
                        <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full shrink-0">
                          CRITICAL
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-12 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300 mb-2">Never go live with test Razorpay keys</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Test key payments don't transfer real money. Always switch to Live keys (after completing Razorpay KYC)
                before accepting real customer payments. Test keys use prefix <code className="text-amber-300 font-mono">rzp_test_</code>,
                Live keys use <code className="text-amber-300 font-mono">rzp_live_</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
