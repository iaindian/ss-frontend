'use client'
import * as React from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'

interface Props {
  imageSrc: string
  onDone: (croppedBlob: Blob) => void
  onCancel: () => void
}

export function FaceCropModal({ imageSrc, onDone, onCancel }: Props) {
  const [crop, setCrop]       = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom]       = React.useState(1.2)
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null)
  const [busy, setBusy]       = React.useState(false)

  async function handleSave() {
    if (!croppedArea) return
    setBusy(true)
    try {
      const blob = await cropImageToBlob(imageSrc, croppedArea)
      onDone(blob)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex w-full max-w-md flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <div className="font-semibold text-sm">Crop your face photo</div>
            <div className="text-xs opacity-50 mt-0.5">Drag & zoom so only your face fills the circle</div>
          </div>
          <button onClick={onCancel} className="rounded-lg p-1.5 hover:bg-muted text-foreground/50 hover:text-foreground">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Cropper */}
        <div className="relative bg-black" style={{ height: 320 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_: Area, croppedAreaPixels: Area) => setCroppedArea(croppedAreaPixels)}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-4 pt-3 pb-1">
          <div className="mb-1 flex items-center justify-between text-xs opacity-50">
            <span>Zoom</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range" min={1} max={3} step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Tip */}
        <div className="mx-4 mb-3 rounded-lg bg-amber-500/10 border border-amber-400/20 px-3 py-2 text-xs text-amber-300/80">
          Tip: Upload a clear front-facing photo. Only your face will be used — no full-body shots needed.
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={onCancel}
            className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted">
            Cancel
          </button>
          <button onClick={handleSave} disabled={busy || !croppedArea}
            className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-black disabled:opacity-50">
            {busy ? 'Processing…' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Canvas crop helper ───────────────────────────────────────────────────────
async function cropImageToBlob(src: string, px: Area): Promise<Blob> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  const SIZE = 512
  canvas.width  = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  // Circular clip
  ctx.beginPath()
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2)
  ctx.clip()

  ctx.drawImage(img, px.x, px.y, px.width, px.height, 0, 0, SIZE, SIZE)

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error('Canvas toBlob failed')), 'image/jpeg', 0.92)
  )
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => res(img)
    img.onerror = rej
    img.src = src
  })
}
