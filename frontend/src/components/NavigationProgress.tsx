'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname      = usePathname()
  const searchParams  = useSearchParams()
  const [visible, setVisible]   = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef  = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start progress on route change
    setVisible(true)
    setProgress(10)

    timerRef.current = setTimeout(() => setProgress(40), 100)
    progressRef.current = setTimeout(() => setProgress(70), 300)

    const done = setTimeout(() => {
      setProgress(100)
      setTimeout(() => { setVisible(false); setProgress(0) }, 300)
    }, 500)

    return () => {
      clearTimeout(timerRef.current!)
      clearTimeout(progressRef.current!)
      clearTimeout(done)
    }
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[2px] transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(to right, #5a5fff, #f6c84b)',
        boxShadow: '0 0 8px rgba(90,95,255,0.6)',
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  )
}
