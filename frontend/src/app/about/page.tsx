'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Shield, Zap, Globe, Code2, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const VALUES = [
  { icon: Shield,  title: 'Privacy First',    desc: 'Offline-first software means your data stays on your machine. We never see your students\' or patients\' records.' },
  { icon: Zap,     title: 'Real Performance', desc: 'Native desktop apps, not browser-based SaaS. Instant response times, even on low-end hardware.' },
  { icon: Globe,   title: 'India-Built',      desc: 'Built by Indian developers for Indian businesses. GST-compliant, Razorpay-integrated, Hindi UI in progress.' },
  { icon: Heart,   title: 'Fair Pricing',     desc: 'One-time payments, not recurring subscriptions. Small schools and clinics deserve great software without monthly fees.' },
  { icon: Code2,   title: 'Open Standards',   desc: 'Built on proven open-source foundations: Spring Boot, FastAPI, Next.js, Django. No vendor lock-in.' },
  { icon: Users,   title: 'Customer-Driven',  desc: 'Every feature comes from customer feedback. We ship updates every 3 months based on real user requests.' },
]

const TEAM = [
  { name: 'Arjun Mehta',   role: 'Founder & Lead Developer', initials: 'AM', bio: 'Full-stack developer with 8 years experience building enterprise software. Previously at Infosys and Startups.' },
  { name: 'Priya Singh',    role: 'Product Designer',         initials: 'PS', bio: 'UX designer focused on making complex workflows intuitive. Loves clean typography and meaningful animations.' },
  { name: 'Vikram Yadav',   role: 'Backend Engineer',         initials: 'VY', bio: 'Spring Boot and Python specialist. Obsessed with performance, security, and clean API design.' },
  { name: 'Neha Sharma',    role: 'Customer Success',         initials: 'NS', bio: 'Former school administrator. Bridges the gap between technical team and real-world use cases.' },
]

const MILESTONES = [
  { year: '2022', event: 'Started as a freelance project for a Noida school' },
  { year: '2023', event: 'First 50 customers — School ERP officially launched' },
  { year: '2023', event: 'Medical Store ERP released after pharmacy feedback' },
  { year: '2024', event: 'SoftCraft Solutions incorporated · 300+ customers' },
  { year: '2024', event: 'Clinic Manager and BharatBooks launched' },
  { year: '2025', event: 'Expanded to 10 cities across Uttar Pradesh & Delhi NCR' },
]

export default function AboutPage() {
  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-surface-950" id="about">
      <Navbar />
      <div className="pt-20">

        {/* ── Hero ── */}
        <section className="relative py-28 overflow-hidden border-b border-white/[0.05]">
          <div className="absolute inset-0 bg-grid-ink" />
          <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-[0.07] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #5a5fff, transparent)' }} />
          <div className="container-xl relative z-10 max-w-4xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
              <span className="badge-blue mb-6 inline-block font-mono">Our Story</span>
              <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Software built by people who've<br />
                <span className="gradient-text">seen the problem firsthand</span>
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
                SoftCraft Solutions started with one frustrated school administrator and a developer who decided
                to do something about it. Today we serve 500+ businesses across India.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Origin story ── */}
        <section className="section">
          <div className="container-xl max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.6 }}>
                <h2 className="font-display text-3xl font-bold text-white mb-6">Why we built this</h2>
                <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
                  <p>
                    In 2022, our founder visited a school in Noida where the principal was spending 3 hours every
                    morning collecting fee payments in a paper register. The school couldn't afford enterprise ERP
                    software with ₹10,000/month subscriptions.
                  </p>
                  <p>
                    Existing options were either too expensive, too complex, required constant internet connectivity,
                    or were built for Western schools without understanding GST, CBSE patterns, or Indian infrastructure.
                  </p>
                  <p>
                    We built School ERP in 6 months, deployed it at that school, and watched fee collection time
                    drop from 3 hours to 15 minutes. That was enough proof to keep going.
                  </p>
                  <p className="text-white font-medium">
                    Today every product we build follows the same philosophy: offline-first, one-time payment,
                    built specifically for how Indian businesses actually work.
                  </p>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '500+', label: 'Businesses', sub: 'across India' },
                  { number: '10+',  label: 'Cities',     sub: 'UP, Delhi NCR & beyond' },
                  { number: '4',    label: 'Products',   sub: 'more in development' },
                  { number: '98%',  label: 'Retention',  sub: 'yearly license renewal' },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="card text-center"
                  >
                    <div className="font-display text-4xl font-extrabold gradient-text-blue mb-1">{s.number}</div>
                    <div className="text-white font-semibold text-sm">{s.label}</div>
                    <div className="text-gray-600 text-xs mt-1">{s.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="section bg-surface-900/40 border-y border-white/[0.04]">
          <div className="container-xl">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-bold text-white mb-4">What we believe</h2>
              <p className="text-gray-500 max-w-xl mx-auto">The principles that guide every decision we make.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUES.map((v, i) => (
                <motion.div key={v.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="card group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-ink-900 border border-ink-700/40 flex items-center justify-center mb-5 group-hover:border-ink-500/60 transition-all">
                    <v.icon className="w-5 h-5 text-ink-400 group-hover:text-ink-300 transition-colors" />
                  </div>
                  <h3 className="font-display font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="section">
          <div className="container-xl max-w-3xl">
            <h2 className="font-display text-4xl font-bold text-white text-center mb-14">Our journey</h2>
            <div className="relative">
              <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-ink-500 via-ink-700 to-transparent" />
              <div className="space-y-8">
                {MILESTONES.map((m, i) => (
                  <motion.div key={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-8"
                  >
                    <div className="w-14 text-right shrink-0">
                      <span className="font-mono text-sm font-bold text-ink-400">{m.year}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-ink-600 border-2 border-ink-400 shrink-0 relative z-10" />
                    <div className="card flex-1 py-4">
                      <p className="text-sm text-white leading-relaxed">{m.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="section bg-surface-900/40 border-y border-white/[0.04]">
          <div className="container-xl">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-bold text-white mb-4">Meet the team</h2>
              <p className="text-gray-500">Small team. Big ambitions. Replying to your emails personally.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member, i) => (
                <motion.div key={member.name}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className="card text-center group"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ink-700 to-ink-900 border border-ink-600/40 flex items-center justify-center mx-auto mb-4 text-ink-200 font-display font-bold text-2xl group-hover:border-ink-500/60 transition-all">
                    {member.initials}
                  </div>
                  <h3 className="font-display font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-xs text-ink-400 mb-3 font-mono">{member.role}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section">
          <div className="container-xl max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-4xl font-bold text-white mb-5">
                Ready to work with us?
              </h2>
              <p className="text-gray-500 mb-10 text-lg">
                Browse our software, or get in touch — we're happy to do a live demo before you buy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn-gold text-base px-10 py-4 font-bold">
                  Browse Products <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-secondary text-base px-10 py-4">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  )
}
