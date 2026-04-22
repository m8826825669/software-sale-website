import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle2, Download, Key, Monitor, Terminal, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Installation Guide — SoftCraft Solutions' }

const INSTALL_STEPS = [
  {
    platform: 'Windows',
    icon: '🪟',
    prereqs: [
      { label: 'Java 21', url: 'https://adoptium.net/temurin/releases/?version=21', note: 'Download Temurin JDK 21 (LTS)' },
      { label: 'Maven 3.8+', url: 'https://maven.apache.org/download.cgi', note: 'Only for running from source code' },
    ],
    steps: [
      'Download the installer (.zip) from your Dashboard → My Licenses → Download.',
      'Extract the zip to a folder (e.g. C:\\SoftCraft\\SchoolERP).',
      'Verify Java is installed: open Command Prompt and run java --version. It should show version 21.',
      'Double-click run.bat to launch the application.',
      'On first launch, Windows Defender may show a warning. Click "More info" → "Run anyway".',
      'The license key dialog appears. Enter your license key from the dashboard.',
      'The application initialises with sample data on first run.',
    ],
    note: 'If run.bat doesn\'t work, try: Right-click → "Run as Administrator".',
  },
  {
    platform: 'macOS',
    icon: '🍎',
    prereqs: [
      { label: 'Java 21', url: 'https://adoptium.net/temurin/releases/?version=21', note: 'Download macOS .pkg installer' },
      { label: 'Maven 3.8+', url: 'https://maven.apache.org/download.cgi', note: 'Or install via Homebrew: brew install maven' },
    ],
    steps: [
      'Download the installer (.zip) from Dashboard → My Licenses → Download.',
      'Extract the zip to a location like ~/Applications/SoftCraft.',
      'Open Terminal. Navigate to the extracted folder: cd ~/Applications/SoftCraft/SchoolERP',
      'Make the run script executable: chmod +x run.sh',
      'Run: ./run.sh',
      'macOS Gatekeeper may block the app. Go to System Settings → Privacy & Security and click "Open Anyway".',
      'Enter your license key when prompted.',
    ],
    note: 'For macOS Sonoma and later, you may need to run: xattr -cr . inside the app folder.',
  },
  {
    platform: 'Linux',
    icon: '🐧',
    prereqs: [
      { label: 'Java 21 + JavaFX', url: 'https://adoptium.net/temurin/releases/?version=21', note: 'sudo apt install openjdk-21-jdk (Ubuntu/Debian)' },
      { label: 'Maven 3.8+', url: 'https://maven.apache.org/download.cgi', note: 'sudo apt install maven' },
    ],
    steps: [
      'Download and extract the installer zip.',
      'Install Java 21: sudo apt update && sudo apt install openjdk-21-jdk',
      'Install Maven: sudo apt install maven',
      'Navigate to the app folder in terminal.',
      'chmod +x run.sh && ./run.sh',
      'Enter your license key when prompted.',
    ],
    note: 'On Ubuntu, you may need to install JavaFX separately: sudo apt install openjfx',
  },
]

const TROUBLE = [
  {
    problem: '"Java not found" or "JAVA_HOME not set"',
    solution: 'Install Java 21 from adoptium.net and restart your computer. Then try again.',
  },
  {
    problem: 'Application launches but shows blank screen',
    solution: 'This is usually a JavaFX rendering issue. Update your graphics drivers. On Windows, try running with: java -Dprism.forceGPU=false -jar app.jar',
  },
  {
    problem: '"License key invalid" even with correct key',
    solution: 'Copy the key directly from your dashboard (click the copy icon). Ensure there are no leading/trailing spaces. Keys are case-sensitive and in the format XXXXX-XXXXX-XXXXX-XXXXX-XXXXX.',
  },
  {
    problem: '"Maximum activations reached"',
    solution: 'Your license allows limited device activations. Deactivate an old device from Dashboard → My Licenses, or upgrade to a plan with more activations.',
  },
  {
    problem: 'Database error on startup',
    solution: 'Delete the database file (schoolerp-data.mv.db or similar) in the app folder and restart. Note: this clears all data.',
  },
  {
    problem: 'Port already in use error',
    solution: 'The app uses an embedded server on port 8099. Kill any process on that port or change it in application.properties.',
  },
]

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-4xl">

          {/* Header */}
          <div className="mb-14">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">Documentation</span>
            <h1 className="font-display text-4xl font-bold text-white mb-4">Installation Guide</h1>
            <p className="text-gray-500 leading-relaxed max-w-2xl">
              Step-by-step instructions for installing SoftCraft applications on Windows, macOS, and Linux.
              Most users are up and running in under 10 minutes.
            </p>
          </div>

          {/* Prerequisites summary */}
          <div className="glass rounded-3xl p-8 mb-12 border border-ink-700/30">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Before You Start
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Key,      title: 'License Key',  desc: 'Get it from Dashboard → My Licenses after purchase.' },
                { icon: Download, title: 'Java 21',      desc: 'Required runtime. Download from adoptium.net/temurin.' },
                { icon: Monitor,  title: '4 GB RAM Min', desc: 'Windows 10+, macOS 12+, or Ubuntu 20.04+' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-9 h-9 rounded-xl bg-ink-900 border border-ink-700/40 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-ink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform-specific steps */}
          {INSTALL_STEPS.map((platform) => (
            <section key={platform.platform} className="mb-12">
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">{platform.icon}</span> {platform.platform}
              </h2>

              {/* Prerequisites */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-widest font-mono">Prerequisites</h3>
                <div className="flex flex-wrap gap-3">
                  {platform.prereqs.map((req) => (
                    <a key={req.label} href={req.url} target="_blank" rel="noopener noreferrer"
                      className="card py-3 px-4 hover:border-ink-500/30 transition-all group">
                      <p className="text-sm font-semibold text-white group-hover:text-ink-300 transition-colors">{req.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{req.note}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {platform.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-full bg-ink-900 border border-ink-700/40 flex items-center justify-center text-xs font-bold text-ink-400 shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="card flex-1 py-3 px-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              {platform.note && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-300/80">{platform.note}</p>
                </div>
              )}
            </section>
          ))}

          {/* Troubleshooting */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Terminal className="w-6 h-6 text-ink-400" /> Troubleshooting
            </h2>
            <div className="space-y-4">
              {TROUBLE.map((item) => (
                <div key={item.problem} className="card">
                  <p className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    {item.problem}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed ml-6">{item.solution}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Still stuck */}
          <div className="mt-12 p-8 glass rounded-3xl text-center border border-ink-700/30">
            <h3 className="font-display font-semibold text-white mb-3">Still having trouble?</h3>
            <p className="text-gray-500 text-sm mb-6">Our support team responds within 4 hours on business days.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn-primary gap-2">📧 Email Support</Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-secondary gap-2">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
