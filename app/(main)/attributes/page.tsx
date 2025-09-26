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
import { ReferenceImagePicker } from '@/components/ReferenceImagePicker'

/** --- Reference picker that also shows CURRENT saved image --- */
// function ReferenceImagePicker({
//   initialUrl,
//   onUploaded,
// }: {
//   initialUrl?: string | null
//   onUploaded?: (url: string) => void
// }) {
//   const [file, setFile] = React.useState<File | null>(null)
//   const [preview, setPreview] = React.useState<string | null>(null)
//   const [busy, setBusy] = React.useState(false)
//   const [currentUrl, setCurrentUrl] = React.useState<string | null>(initialUrl ?? null)

//   // keep in sync when "me" changes upstream
//   React.useEffect(() => {
//     setCurrentUrl(initialUrl ?? null)
//   }, [initialUrl])

//   const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0]
//     setFile(f || null)
//     setPreview(f ? URL.createObjectURL(f) : null)
//   }

//   const onUpload = async () => {
//     if (!file) return

//     // ---- Frontend rate limits (simple) ----
//     const last = +(localStorage.getItem('lastFaceUpload') || 0)
//     if (Date.now() - last < 60_000) {
//       alert('Please wait 1 minute before uploading again.')
//       return
//     }
//     const arr = JSON.parse(localStorage.getItem('faceUploads') || '[]').filter(
//       (t: number) => Date.now() - t < 3_600_000
//     )
//     if (arr.length >= 3) {
//       alert('Too many uploads. Try again in ~2 hours.')
//       return
//     }

//     try {
//       setBusy(true)

//       const ok = await hasFaceInImage(file)
//       if (!ok) {
//         alert('No face detected. Please choose a clear face photo.')
//         return
//       }

//       const url = await uploadReferenceImage(file) // backend stores + returns final URL
//       logger.info('attributes.reference_image_uploaded', { url })

//       // update local & bubble up
//       setCurrentUrl(url)
//       setPreview(null)
//       setFile(null)
//       onUploaded?.(url)

//       // bump rate-limit counters
//       arr.push(Date.now())
//       localStorage.setItem('faceUploads', JSON.stringify(arr))
//       localStorage.setItem('lastFaceUpload', String(Date.now()))

//       alert('Reference image saved!')
//     } catch (e: any) {
//       logger.error('attributes.ref_upload_failed', { error: e?.message })
//       alert(e?.message || 'Upload failed')
//     } finally {
//       setBusy(false)
//     }
//   }

//   return (
//     <div className="rounded-xl border border-border p-4 space-y-3">
//       <div className="text-sm font-medium">Reference face</div>

//       {/* Current saved image */}
//       {currentUrl ? (
//         <div className="flex items-center gap-4">
//           <div className="text-xs text-foreground/70 min-w-24">Current image</div>
//           <img
//             src={currentUrl}
//             alt="Current reference"
//             className="h-24 w-24 rounded-md object-cover border"
//           />
//         </div>
//       ) : (
//         <div className="text-xs text-foreground/60">No reference image saved yet.</div>
//       )}

//       {/* File chooser + local preview */}
//       <div className="space-y-2">
//         <input type="file" accept="image/*" onChange={onFile} />
//         {preview && (
//           <div className="mt-1">
//             <div className="text-xs text-foreground/70 mb-1">New image (preview)</div>
//             <img src={preview} alt="preview" className="h-24 w-24 object-cover rounded-md border" />
//           </div>
//         )}
//       </div>

//       <Button onClick={onUpload} disabled={!file || busy}>
//         {busy ? 'Uploading…' : 'Upload & Save'}
//       </Button>

//       <div className="text-xs text-foreground/60">
//         This image will be used to match your likeness when generating packs.
//       </div>
//     </div>
//   )
// }

export default function AttributesPage() {
  const { me, loading: authLoading /*, refresh: refreshAuth*/ } = useAuth()
  const { attributes, loading, error, refresh } = useAttributes()
  const qp = useSearchParams()
  const required = qp.get('required') === '1'
  const [refUrl, setRefUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    let dead = false
    ;(async () => {
      try {
        const res = await Api.getMyProfile()
        if (!dead) setRefUrl(res?.reference_image_url || null)
      } catch {
        // ignore
      }
    })()
    return () => { dead = true }
  }, [])

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
      {/* Pass the saved reference image from `me` */}
      <ReferenceImagePicker
        initialUrl={refUrl}
        onUploaded={(url) => setRefUrl(url)}
      />

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
