'use client'
import { useState } from 'react'
import { Play, Download, Calendar, Globe } from 'lucide-react'
import DemoModal, { DemoConfig } from './DemoModal'

interface Props {
  demo: DemoConfig
  variant?: 'card' | 'hero' | 'outline'
  className?: string
}

const ICON_MAP = { online: Globe, trial: Download, request: Calendar, none: Play }
const LABEL_MAP = { online: 'Live Demo', trial: 'Free Trial', request: 'Request Demo', none: 'Request Demo' }

export default function TryDemoButton({ demo, variant = 'outline', className = '' }: Props) {
  const [open, setOpen] = useState(false)

  if (demo.type === 'none') return null

  const Icon  = ICON_MAP[demo.type]
  const label = LABEL_MAP[demo.type]

  const baseClass = variant === 'card'
    ? 'btn-secondary text-sm py-2 px-4 gap-1.5'
    : variant === 'hero'
    ? 'btn-secondary text-base px-8 py-4 gap-2'
    : 'btn-secondary text-sm py-2.5 px-5 gap-2'

  return (
    <>
      <button onClick={() => setOpen(true)} className={`${baseClass} ${className}`}>
        <Icon className="w-4 h-4 text-ink-400" />
        {label}
      </button>

      <DemoModal demo={demo} open={open} onClose={() => setOpen(false)} />
    </>
  )
}