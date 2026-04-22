import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = { title: 'End User License Agreement (EULA)' }

const SECTIONS = [
  {
    title: '1. Definitions',
    content: `"Software" means any software product purchased from SoftCraft Solutions, including all associated files, documentation, and updates.\n\n"Licensor" means SoftCraft Solutions, Noida, Uttar Pradesh, India.\n\n"Licensee" means the individual or entity that has purchased and received a valid license key for the Software.\n\n"License Key" means the unique alphanumeric code issued to the Licensee upon payment, in the format XXXXX-XXXXX-XXXXX-XXXXX-XXXXX.`,
  },
  {
    title: '2. Grant of License',
    content: `Subject to the terms of this Agreement and receipt of full payment, Licensor grants Licensee a limited, non-exclusive, non-transferable, non-sublicensable license to:\n\n(a) Install and use the Software on the number of devices specified in the purchased plan (Starter: 1 device, Professional: 3 devices, Enterprise: 10 devices).\n\n(b) Make one (1) backup copy of the Software for archival purposes only.\n\n(c) Use the Software for lawful internal business purposes only.`,
  },
  {
    title: '3. Restrictions',
    content: `Licensee may NOT:\n\n(a) Copy, reproduce, or distribute the Software to third parties.\n\n(b) Sublicense, sell, rent, lease, or transfer the Software or any rights therein.\n\n(c) Reverse engineer, decompile, disassemble, or attempt to derive source code from the Software, except as expressly permitted by applicable law.\n\n(d) Modify, translate, adapt, or create derivative works based on the Software.\n\n(e) Remove, alter, or obscure any copyright, trademark, or other proprietary notices in the Software.\n\n(f) Use the Software in any manner that violates applicable law, including Indian IT laws and GST regulations.`,
  },
  {
    title: '4. License Key Usage',
    content: `Each License Key is issued for use by a single Licensee and may not be shared. The Licensor monitors activation counts. If abnormal activation patterns are detected (indicating key sharing), the Licensor reserves the right to deactivate the key without refund.\n\nLicensees must keep their License Key confidential. Loss of a License Key is not grounds for a refund; keys can be retrieved from the customer dashboard at any time.`,
  },
  {
    title: '5. Ownership & Intellectual Property',
    content: `The Software is licensed, not sold. The Licensor retains all right, title, and interest in and to the Software, including all intellectual property rights. This Agreement does not transfer any ownership rights to the Licensee.`,
  },
  {
    title: '6. Updates & Support',
    content: `Updates (bug fixes, performance improvements, new features) are provided free of charge during the support period:\n\n• Starter: 1 year from purchase date\n• Professional: 2 years from purchase date\n• Enterprise: Lifetime\n\nAfter the support period, the Software continues to function. Licensees may purchase an upgrade at a discounted rate to receive continued updates and support.`,
  },
  {
    title: '7. Offline Operation',
    content: `The Software is designed to operate primarily offline. License validation may require periodic internet connectivity (approximately once every 30 days) to confirm license status. If the software cannot validate the license after 30 days of no connectivity, it will enter a grace period of 7 days before restricting functionality.`,
  },
  {
    title: '8. Data & Privacy',
    content: `The Software stores all operational data locally on the Licensee's device. No operational data (student records, patient data, financial records, etc.) is transmitted to the Licensor's servers. The Software collects only anonymous usage analytics (feature usage frequency) which may be transmitted to improve the product. This can be disabled in Settings.`,
  },
  {
    title: '9. Termination',
    content: `This License is effective until terminated. It terminates automatically upon:\n\n(a) Breach of any provision of this Agreement by Licensee.\n\n(b) Failure to pay applicable fees.\n\n(c) Upon termination, Licensee must uninstall and destroy all copies of the Software and License Key.\n\nTermination does not entitle the Licensee to any refund, unless the termination occurs within the 7-day refund window.`,
  },
  {
    title: '10. Disclaimer of Warranties',
    content: `THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE OR UNINTERRUPTED.`,
  },
  {
    title: '11. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE LICENSOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION.\n\nTHE LICENSOR'S TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM THIS AGREEMENT SHALL NOT EXCEED THE AMOUNT PAID BY LICENSEE FOR THE LICENSE IN THE 12 MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: '12. Governing Law & Dispute Resolution',
    content: `This Agreement is governed by the laws of India, without regard to conflict of law principles. Any disputes arising from this Agreement shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.\n\nBefore initiating legal proceedings, the parties agree to attempt resolution through good-faith negotiation for a period of 30 days.`,
  },
  {
    title: '13. Entire Agreement',
    content: `This EULA, together with the Terms of Service and Privacy Policy available at softcraft.in, constitutes the entire agreement between the parties regarding the Software and supersedes all prior discussions, representations, or agreements.`,
  },
]

export default function EulaPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-3xl">
          <div className="mb-12">
            <span className="badge-blue text-xs mb-4 inline-block font-mono">Legal</span>
            <h1 className="font-display text-4xl font-bold text-white mb-3">
              End User License Agreement
            </h1>
            <p className="text-sm text-gray-500 mb-1">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs text-gray-600">Version 1.0 — Applies to all SoftCraft Solutions software products</p>
          </div>

          <div className="glass rounded-3xl p-8 mb-10 border border-amber-500/20 bg-amber-500/[0.03]">
            <p className="text-amber-300 font-semibold text-sm mb-2">⚠️ Important — Please Read Before Installing</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              By installing, copying, or otherwise using any SoftCraft Solutions software, you agree to be bound by the terms of this End User License Agreement (EULA). If you do not agree to these terms, do not install or use the software and contact us for a refund within 7 days of purchase.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title} className="border-l-2 border-ink-800 pl-6 hover:border-ink-600 transition-colors">
                <h2 className="font-display font-semibold text-white text-lg mb-4">{section.title}</h2>
                {section.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-500 text-sm leading-relaxed mb-3 whitespace-pre-line">{para}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Questions?', href: '/contact',  text: 'Contact Support' },
              { label: 'Also read:', href: '/terms',    text: 'Terms of Service' },
              { label: 'Also read:', href: '/privacy',  text: 'Privacy Policy' },
            ].map(item => (
              <div key={item.href} className="glass rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <Link href={item.href} className="text-ink-400 hover:text-ink-300 text-sm font-medium transition-colors">
                  {item.text} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
