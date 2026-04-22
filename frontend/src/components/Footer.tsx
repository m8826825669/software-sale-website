'use client'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const LINKS = {
  Products: [
    { label: 'School ERP', href: '/products/school-erp' },
    { label: 'Clinic Manager', href: '/products/clinic-manager' },
    { label: 'Medical Store', href: '/products/medical-store' },
    { label: 'Accounting Suite', href: '/products/accounting' },
    { label: 'All Products', href: '/products' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/contact' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'Documentation', href: '/docs' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'License Validation', href: '/validate' },
    { label: 'System Status', href: '/status' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'License Agreement', href: '/eula' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-950">
      <div className="container-xl py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-ink-600 flex items-center justify-center glow-ink">
                <span className="text-white font-display font-bold text-sm">SC</span>
              </div>
              <span className="font-display font-bold text-lg text-white">SoftCraft<span className="text-ink-400">.</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              Premium offline-first desktop software for Indian businesses. Built with security and simplicity in mind.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-ink-500" /><span>support@softcraft.in</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-ink-500" /><span>+91 98765 43210</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-ink-500" /><span>Noida, Uttar Pradesh, India</span></div>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-mono font-medium text-gray-400 uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment badges */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-t border-b border-white/[0.05] mb-8">
          <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">Secure Payments via</span>
          <div className="flex items-center gap-3">
            {['Razorpay', 'UPI', 'Visa', 'Mastercard', 'Net Banking'].map((p) => (
              <span key={p} className="badge-blue text-xs">{p}</span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-600">🔒 SSL Secured</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-600">GST Compliant</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} SoftCraft Solutions. All rights reserved. GST: 09AAAAA0000A1Z5
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, href: 'https://twitter.com' },
              { icon: Linkedin, href: 'https://linkedin.com' },
              { icon: Github, href: 'https://github.com' },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-gray-500 hover:text-ink-400 hover:border-ink-500/30 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
