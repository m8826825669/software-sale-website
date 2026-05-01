'use client'
import { Toaster } from 'react-hot-toast'

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0e0f1e',
          color: '#e8eaf6',
          border: '1px solid rgba(90,95,255,0.25)',
          borderRadius: '12px',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '14px',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        },
        success: {
          iconTheme: { primary: '#5a5fff', secondary: '#080916' },
          duration: 3000,
        },
        error: {
          iconTheme: { primary: '#f44336', secondary: '#080916' },
          duration: 5000,
        },
      }}
    />
  )
}