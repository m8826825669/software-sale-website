'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Package, CheckCircle2, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminUploadPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [selected, setSelected] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.is_staff) { router.push('/dashboard'); return }
    api.get('/products/admin/list/').then(r => setProducts(r.data.results || r.data))
  }, [isAuthenticated, user])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['zip', 'jar', 'exe', 'dmg', 'deb', 'rpm', 'tar'].includes(ext || '')) {
      toast.error('Unsupported file type. Use .zip, .jar, .exe, .dmg, .deb, or .rpm')
      return
    }
    if (f.size > 500 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 500 MB.')
      return
    }
    setFile(f)
    setDone(false)
  }

  const upload = async () => {
    if (!selected) { toast.error('Select a product first'); return }
    if (!file) { toast.error('Select an installer file'); return }

    setUploading(true)
    setProgress(0)

    const form = new FormData()
    form.append('installer_file', file)

    try {
      await api.patch(`/products/admin/${selected}/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round(e.loaded * 100 / e.total))
        },
      })
      setDone(true)
      setFile(null)
      setProgress(0)
      if (fileRef.current) fileRef.current.value = ''
      toast.success('Installer uploaded successfully! Customers can now download it.')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Upload failed. Check file format and try again.')
    }
    setUploading(false)
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="glass border-b border-white/[0.06] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white font-display font-semibold">Upload Installer</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-white mb-2">Upload Installer File</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Upload the compiled installer (.zip, .jar, .exe, etc.) for a product. Once uploaded, customers with a valid license can download it from their dashboard.
          </p>
        </div>

        <div className="space-y-6">
          {/* Product selector */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-ink-400" /> Select Product *
            </label>
            <select
              value={selected}
              onChange={e => { setSelected(e.target.value); setDone(false) }}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            >
              <option value="">Choose a product…</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.slug}>
                  {p.emoji || '📦'} {p.name} (v{p.version})
                </option>
              ))}
            </select>
          </div>

          {/* File drop zone */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-ink-400" /> Installer File *
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const fake = { target: { files: [f] } } as any; onFile(fake) } }}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                file
                  ? 'border-ink-500/60 bg-ink-900/30'
                  : 'border-white/[0.1] hover:border-ink-500/40 hover:bg-white/[0.02]'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ink-900 border border-ink-700 flex items-center justify-center">
                    <Package className="w-6 h-6 text-ink-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                    className="ml-2 p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium mb-1">Drag & drop or click to browse</p>
                  <p className="text-xs text-gray-600">.zip, .jar, .exe, .dmg, .deb, .rpm, .tar — Max 500 MB</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden"
              accept=".zip,.jar,.exe,.dmg,.deb,.rpm,.tar,.tar.gz"
              onChange={onFile} />
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Uploading…</span>
                <span className="text-sm font-mono text-ink-400">{progress}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'linear-gradient(to right, #5a5fff, #f6c84b)' }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">{file ? formatBytes(Math.round(file.size * progress / 100)) : '—'} of {file ? formatBytes(file.size) : '—'}</p>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Installer uploaded successfully!</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customers with a valid license can now download this installer from their dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.04] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="text-amber-400 font-medium">Important:</span> Uploading replaces the previous installer for this product. Existing customers who re-download will get the new version. Make sure the installer is the final, tested build.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={upload}
            disabled={uploading || !selected || !file}
            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading {progress}%…</>
              : <><Upload className="w-5 h-5" /> Upload Installer</>}
          </button>
        </div>
      </div>
    </div>
  )
}
