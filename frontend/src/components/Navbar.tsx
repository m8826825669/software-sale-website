'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Package, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/products#pricing' },
  { label: 'About', href: '/#about' },
  { label: 'Support', href: '/#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const { user, isAuthenticated, logout, fetchProfile } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Hydrate auth state on first load if token exists but user is null
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !user) {
      fetchProfile()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/[0.06] py-3' : 'py-5'
    }`}>
      <nav className="container-xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-ink-600 flex items-center justify-center glow-ink">
            <span className="text-white font-display font-bold text-sm">SC</span>
          </div>
          <span className="font-display font-bold text-lg text-white">
            SoftCraft<span className="text-ink-400">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  pathname === item.href
                    ? 'text-white bg-white/[0.08]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light hover:border-ink-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-ink-700 flex items-center justify-center text-xs font-bold text-ink-200">
                  {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <span className="text-sm text-gray-300">{user?.first_name || 'Account'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 glass rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
                      { icon: Package, label: 'My Licenses', href: '/dashboard/licenses' },
                      { icon: User, label: 'Profile', href: '/dashboard/profile' },
                      ...(user?.is_staff ? [{ icon: ShieldCheck, label: 'Admin Panel', href: '/admin' }] : []),
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        <item.icon className="w-4 h-4 text-ink-400" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-white/[0.06]" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/[0.06]"
          >
            <div className="container-xl py-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05]">Dashboard</Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-red-400 text-left hover:bg-red-500/10">Sign Out</button>
                </>
              ) : (
                <div className="flex gap-3 px-4 pt-2">
                  <Link href="/auth/login" className="btn-secondary text-sm flex-1 justify-center" onClick={() => setOpen(false)}>Sign In</Link>
                  <Link href="/auth/register" className="btn-primary text-sm flex-1 justify-center" onClick={() => setOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
