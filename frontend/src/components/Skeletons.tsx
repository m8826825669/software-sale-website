import { Loader2 } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-ink-400 animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    </div>
  )
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card animate-pulse ${className}`}>
      <div className="h-8 w-8 bg-white/[0.06] rounded-xl mb-4" />
      <div className="h-4 bg-white/[0.06] rounded w-3/4 mb-3" />
      <div className="h-3 bg-white/[0.04] rounded w-full mb-2" />
      <div className="h-3 bg-white/[0.04] rounded w-5/6" />
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="w-14 h-14 bg-white/[0.06] rounded-xl mb-5" />
      <div className="h-5 bg-white/[0.08] rounded w-2/3 mb-3" />
      <div className="h-3 bg-white/[0.05] rounded w-full mb-2" />
      <div className="h-3 bg-white/[0.05] rounded w-4/5 mb-5" />
      <div className="flex gap-2 mb-5">
        {[1,2,3].map(i => <div key={i} className="h-5 w-14 bg-white/[0.04] rounded-full" />)}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
        <div className="h-6 w-20 bg-white/[0.06] rounded" />
        <div className="h-8 w-24 bg-white/[0.06] rounded-xl" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="card animate-pulse">
      {/* Header */}
      <div className="flex gap-4 pb-3 mb-3 border-b border-white/[0.06]">
        {Array(cols).fill(0).map((_, i) => (
          <div key={i} className="h-3 bg-white/[0.08] rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array(rows).fill(0).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-white/[0.04]">
          {Array(cols).fill(0).map((_, c) => (
            <div key={c} className={`h-3 ${c === 0 ? 'w-28' : 'flex-1'} bg-white/[0.04] rounded`} />
          ))}
        </div>
      ))}
    </div>
  )
}
