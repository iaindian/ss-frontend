// app/(main)/attributes/page.tsx
'use client'
import * as React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAttributes } from '@/hooks/useAttributes'
import { Api } from '@/lib/api'
import { ErrorView } from '@/components/ErrorView'
import { useSearchParams } from 'next/navigation'
import { AttributesForm } from '@/components/AttributesForm'
import { hasFaceInImage } from '@/lib/facecheck'
import { uploadReferenceImage } from '@/lib/upload'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

function ReferenceImagePicker() {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const onUpload = async () => {
    if (!file) return
    
    // ---- Rate limit checks ----
    // 1-minute cooldown
    if (Date.now() - +(localStorage.getItem('lastFaceUpload') || 0) < 60_000) {
      return alert("Please wait 1 minute before uploading again.")
    }

    // max 3 uploads per hour
    const arr = JSON.parse(localStorage.getItem('faceUploads') || '[]')
      .filter((t: number) => Date.now() - t < 3600_000)
    if (arr.length >= 3) {
      return alert("Too many uploads. Try again in 2 hours.")
    }
    arr.push(Date.now())
    localStorage.setItem('faceUploads', JSON.stringify(arr))
    localStorage.setItem('lastFaceUpload', String(Date.now()))
    try {
      setBusy(true)
      const ok = await hasFaceInImage(file)
      if (!ok) {
        alert('No face detected. Please choose a clear face photo.')
        return
      }
      const url = await uploadReferenceImage(file)
      logger.info('attributes.reference_image_uploaded', { url })
      alert('Reference image saved!')
    } catch (e: any) {
      logger.error('attributes.ref_upload_failed', { error: e?.message })
      alert(e?.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="text-sm font-medium">Reference face</div>
      <input type="file" accept="image/*" onChange={onFile} />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="preview" className="h-32 w-32 object-cover rounded-md" />
        </div>
      )}
      <Button onClick={onUpload} disabled={!file || busy}>
        {busy ? 'Uploading…' : 'Upload & Save'}
      </Button>
      <div className="text-xs text-foreground/60">
        This image will be used to match your likeness when generating packs.
      </div>
    </div>
  )
}

export default function AttributesPage() {
  const { me, loading: authLoading } = useAuth()
  const { attributes, loading, error, refresh } = useAttributes()
  const qp = useSearchParams()
  const required = qp.get('required') === '1'

  if (authLoading) return <div className="p-6">Loading…</div>
  if (!me) return <div className="p-6">Please sign in.</div>
  if (error) return <ErrorView description={error} />

  async function onSave(form: any) {
    try {
      await Api.updateAttributes(form)
      logger.info('attributes.save.success')
      await refresh()
      alert('Saved!')
    } catch (e: any) {
      logger.error('attributes.save.error', { error: e?.message })
      alert(e?.message || 'Failed to save')
    }
  }

  const showFirstTimeBanner = required || !attributes

  return (
    <div className="max-w-2xl space-y-4">
      <ReferenceImagePicker />
      {showFirstTimeBanner && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm">
          <div className="font-medium">Complete your attributes</div>
          <div className="opacity-80">
            These attributes will be used in prompts to match your likeness and style.
            Please fill them accurately before generating any pack.
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading attributes…</div>
      ) : (
        <>
          <h1 className="text-xl font-semibold">Your Attributes</h1>
          <AttributesForm initial={attributes ?? undefined} onSave={onSave} />
        </>
      )}
      
    </div>
  )
}
