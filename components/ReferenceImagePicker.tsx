// components/ReferenceImagePicker.tsx (or inline in page)
'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { hasFaceInImage } from '@/lib/facecheck'
import { uploadReferenceImage } from '@/lib/upload'
import { logger } from '@/lib/logger'

type Props = {
  initialUrl?: string | null
  onUploaded?: (url: string) => void
}

export function ReferenceImagePicker({ initialUrl, onUploaded }: Props) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(initialUrl || null)
  const [busy, setBusy] = React.useState(false)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    // if server returned a new url later (first page load), use it
    if (initialUrl) setPreview(initialUrl)
  }, [initialUrl])

  const chooseFile = () => inputRef.current?.click()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setFileName(f ? f.name : null)
    setPreview(f ? URL.createObjectURL(f) : (initialUrl || null))
  }

  const onUpload = async () => {
    if (!file) return

    // ---- lightweight client guardrails ----
    const last = +(localStorage.getItem('lastFaceUpload') || 0)
    if (Date.now() - last < 60_000) {
      alert('Please wait 1 minute before uploading again.')
      return
    }
    const arr = JSON.parse(localStorage.getItem('faceUploads') || '[]')
      .filter((t: number) => Date.now() - t < 3_600_000)
    if (arr.length >= 3) {
      alert('Too many uploads this hour. Try again in ~2 hours.')
      return
    }

    try {
      setBusy(true)
      const ok = await hasFaceInImage(file)
      if (!ok) {
        alert('No face detected. Please choose a clear face photo.')
        return
      }

      const url = await uploadReferenceImage(file)
      // success bookkeeping
      localStorage.setItem('lastFaceUpload', String(Date.now()))
      arr.push(Date.now())
      localStorage.setItem('faceUploads', JSON.stringify(arr))

      setPreview(url)
      setFile(null)
      setFileName(null)
      if (inputRef.current) inputRef.current.value = '' // clear native input
      logger.info('attributes.reference_image_uploaded', { url })
      onUploaded?.(url)
    } catch (e: any) {
      logger.error('attributes.ref_upload_failed', { error: e?.message })
      alert(e?.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 text-sm font-medium">Reference face</div>

      <div className="grid gap-4 sm:grid-cols-[128px,1fr]">
        {/* Preview */}
        <div className="relative aspect-square w-32 overflow-hidden rounded-xl border border-border bg-muted">
          {preview ? (
            <img
              src={preview}
              alt="Current reference"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-foreground/60">
              No image
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={chooseFile} disabled={busy}>
              Choose Image
            </Button>
            <Button type="button" onClick={onUpload} disabled={!file || busy}>
              {busy ? 'Uploading…' : 'Upload & Save'}
            </Button>
          </div>

          {fileName && (
            <div className="text-xs text-foreground/60">
              Selected: <span className="font-medium">{fileName}</span>
            </div>
          )}

          <div className="text-xs text-foreground/60">
            This image will be used to match your likeness when generating packs.
          </div>
        </div>
      </div>
    </div>
  )
}
