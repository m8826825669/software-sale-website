'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <html>
      <body className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            An unexpected error occurred. Our team has been notified. Please try again or contact support.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={reset} className="btn-primary gap-2">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      </body>
    </html>
  )
}
