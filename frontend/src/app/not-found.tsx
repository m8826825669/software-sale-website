import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-ink pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[140px] opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5a5fff, transparent)' }} />

      <div className="relative z-10 text-center max-w-lg">
        <div className="font-display font-extrabold text-[160px] leading-none bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to bottom, rgba(90,95,255,0.5), rgba(90,95,255,0.05))' }}>
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-white -mt-6 mb-4">Page not found</h1>
        <p className="text-gray-500 leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/products" className="btn-secondary gap-2">
            <ArrowLeft className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
