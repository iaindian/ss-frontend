'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { FaceCropModal } from '@/components/FaceCropModal'
import { hasFaceInImage } from '@/lib/facecheck'
import { uploadReferenceImage } from '@/lib/upload'
import { logger } from '@/lib/logger'

type Props = {
  initialUrl?: string | null
  onUploaded?: (url: string) => void
}

export function ReferenceImagePicker({ initialUrl, onUploaded }: Props) {
  const [preview,   setPreview]   = React.useState<string | null>(initialUrl || null)
  const [cropSrc,   setCropSrc]   = React.useState<string | null>(null)   // triggers crop modal
  const [busy,      setBusy]      = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => { if (initialUrl) setPreview(initialUrl) }, [initialUrl])

  // Step 1 — user picks file → show crop modal
  function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    // reset input so picking the same file again still triggers onChange
    if (inputRef.current) inputRef.current.value = ''
    const objectUrl = URL.createObjectURL(f)
    setCropSrc(objectUrl)
  }

  // Step 2 — user confirms crop → face-check + upload
  async function onCropDone(croppedBlob: Blob) {
    setCropSrc(null)

    const last = +(localStorage.getItem('lastFaceUpload') || 0)
    if (Date.now() - last < 60_000) {
      alert('Please wait 1 minute before uploading again.')
      return
    }
    const arr = JSON.parse(localStorage.getItem('faceUploads') || '[]')
      .filter((t: number) => Date.now() - t < 3_600_000)
    if (arr.length >= 3) {
      alert('Too many uploads this hour. Try again later.')
      return
    }

    setBusy(true)
    try {
      const ok = await hasFaceInImage(croppedBlob as File)
      if (!ok) {
        alert('No face detected in the cropped area. Please try again with a clearer photo.')
        return
      }
      const url = await uploadReferenceImage(croppedBlob as File)
      localStorage.setItem('lastFaceUpload', String(Date.now()))
      arr.push(Date.now())
      localStorage.setItem('faceUploads', JSON.stringify(arr))
      setPreview(url)
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
    <>
      {/* Crop modal — mounts only when a file is chosen */}
      {cropSrc && (
        <FaceCropModal
          imageSrc={cropSrc}
          onDone={onCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-1 text-sm font-medium">Reference face photo</div>
        <div className="mb-3 text-xs opacity-50">
          We need a clear front-facing face photo. You&apos;ll crop it to just your face before uploading.
        </div>

        <div className="grid gap-4 sm:grid-cols-[128px,1fr]">
          {/* Preview */}
          <div className="relative w-32 overflow-hidden rounded-full border-2 border-border bg-muted aspect-square">
            {preview ? (
              <img src={preview} alt="Reference face" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-25" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            )}
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center gap-3">
            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChosen} className="hidden" />
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
              {preview ? 'Change photo' : 'Choose photo'}
            </Button>
            {preview && (
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Face photo saved
              </div>
            )}
            <div className="text-xs opacity-40 leading-relaxed">
              Your face photo is used to match your likeness in AI generations. Only your face is stored — not the full image.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
