import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, Rss } from 'lucide-react'

export const metadata = { title: 'Blog — SoftCraft Solutions' }

const POSTS = [
  { slug: 'offline-software-india', title: 'Why offline-first software is the right choice for Indian businesses', date: 'Apr 10, 2025', category: 'Product', readTime: '5 min', excerpt: 'Internet outages, slow connections, and data privacy concerns make offline-first desktop software the pragmatic choice for schools and clinics across India.' },
  { slug: 'gst-billing-best-practices', title: 'GST billing best practices for medical stores in 2025', date: 'Mar 22, 2025', category: 'Guide', readTime: '7 min', excerpt: 'A comprehensive guide to handling CGST, SGST, IGST, and HSN codes correctly in your medical store billing software.' },
  { slug: 'school-fee-management', title: 'Reducing fee collection time from 3 hours to 15 minutes', date: 'Feb 15, 2025', category: 'Case Study', readTime: '4 min', excerpt: 'How DPS Noida transformed their fee collection process using School Management ERP — a real-world case study.' },
  { slug: 'fefo-inventory', title: 'FEFO vs FIFO: Which inventory method is right for your pharmacy?', date: 'Jan 30, 2025', category: 'Guide', readTime: '6 min', excerpt: 'First-Expiry-First-Out (FEFO) can save pharmacies thousands of rupees in expired stock wastage every year. Here\'s how.' },
]

const CATEGORIES: Record<string, string> = { Product: 'badge-blue', Guide: 'badge-green', 'Case Study': 'badge-gold' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container-xl max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Rss className="w-5 h-5 text-ink-400" />
                <span className="badge-blue text-xs font-mono">Blog</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-white">Insights & Guides</h1>
              <p className="text-gray-500 mt-2">Software tips, case studies, and business insights for Indian businesses.</p>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {POSTS.map((post, i) => (
              <article key={post.slug}
                className="card group hover:border-ink-500/30 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`badge text-xs ${CATEGORIES[post.category] || 'badge-blue'}`}>{post.category}</span>
                      <span className="text-xs text-gray-600">{post.date}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-600">{post.readTime} read</span>
                    </div>
                    <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-ink-300 transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 text-ink-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                    Read <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon note */}
          <div className="mt-12 p-6 glass rounded-2xl text-center">
            <p className="text-gray-600 text-sm">
              More articles coming soon. Subscribe to our newsletter or follow us on{' '}
              <a href="https://twitter.com" className="text-ink-400 hover:text-ink-300">Twitter</a> to stay updated.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
