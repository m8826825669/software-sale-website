'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function NavigationProgress() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [active,   setActive]   = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    clearAll()
    setActive(true)
    setProgress(10)

    const t1 = setTimeout(() => setProgress(40),  100)
    const t2 = setTimeout(() => setProgress(70),  300)
    const t3 = setTimeout(() => setProgress(100), 600)
    const t4 = setTimeout(() => { setActive(false); setProgress(0) }, 950)

    timers.current = [t1, t2, t3, t4]
    return clearAll
  }, [pathname, searchParams])

  // Always render the div — never return null during navigation
  // Hiding via opacity avoids React creating/destroying the node mid-transition
  return (
    <div
      aria-hidden="true"
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        zIndex:     9999,
        height:     '2px',
        width:      `${progress}%`,
        background: 'linear-gradient(to right, #5a5fff, #f6c84b)',
        boxShadow:  active ? '0 0 8px rgba(90,95,255,0.6)' : 'none',
        opacity:    active && progress < 100 ? 1 : 0,
        transition: 'width 200ms ease-out, opacity 300ms ease-out',
        pointerEvents: 'none',
      }}
    />
  )
}