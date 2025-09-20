// components/SocialPreview.tsx
'use client'
import * as React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  images: string[]
  title: string
}

type GramRatio = '1:1' | '4:5' | '9:16'

export function SocialPreviewDialog({ open, onOpenChange, images, title }: Props) {
  const pics = (images || []).filter(Boolean)
  const [tab, setTab] = React.useState<'instagram' | 'tiktok'>('instagram')
  const [ratio, setRatio] = React.useState<GramRatio>('1:1')
  const [idx, setIdx] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
      if (e.key === 'ArrowLeft') setIdx((p) => (p - 1 + pics.length) % pics.length)
      if (e.key === 'ArrowRight') setIdx((p) => (p + 1) % pics.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, pics.length, onOpenChange])

  // lock page scroll while open
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null

  const src = pics[idx]

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-3">
      {/* Dialog width is fixed; it will NOT expand on aspect change */}
      <div className="w-full max-w-5xl rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold">Preview on Social</div>
          <button
            className="rounded-lg p-2 hover:bg-muted"
            onClick={() => onOpenChange(false)}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Tab label="Instagram" active={tab === 'instagram'} onClick={() => setTab('instagram')} />
          <Tab label="TikTok" active={tab === 'tiktok'} onClick={() => setTab('tiktok')} />
          {tab === 'instagram' && (
            <div className="ml-auto flex items-center gap-2 text-xs">
              <AspectChip label="1:1" active={ratio === '1:1'} onClick={() => setRatio('1:1')} />
              <AspectChip label="4:5" active={ratio === '4:5'} onClick={() => setRatio('4:5')} />
              <AspectChip label="9:16" active={ratio === '9:16'} onClick={() => setRatio('9:16')} />
            </div>
          )}
        </div>

        {/* Fixed columns: left preview column has constant width; no layout jump */}
        <div className="grid gap-4 md:grid-cols-[400px_1fr]">
          <FixedPreviewPanel
            src={src}
            title={title}
            isInstagram={tab === 'instagram'}
            ratio={tab === 'instagram' ? ratio : '9:16'}
            count={pics.length}
            idx={idx}
            onPrev={() => setIdx((p) => (p - 1 + pics.length) % pics.length)}
            onNext={() => setIdx((p) => (p + 1) % pics.length)}
          />

          <div className="rounded-2xl border border-border bg-background p-4 text-sm opacity-80">
            <div className="mb-2 font-medium">Tips</div>
            {tab === 'instagram' ? (
              <ul className="list-disc pl-4 space-y-1">
                <li>Square (1:1) = grid-friendly. Portrait (4:5) gets more screen height.</li>
                <li>Keep core subject centered; avoid edge text.</li>
                <li>Export: 1080×1080 (1:1), 1080×1350 (4:5), 1080×1920 (9:16).</li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                <li>9:16 vertical (1080×1920) is standard for TikTok.</li>
                <li>Keep titles away from top/bottom UI chrome.</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Fixed preview panel:
 * - Outer panel height is constant (H).
 * - Column width constant (via grid template).
 * - Only the inner FRAME width changes per aspect (height stays H).
 * - Image uses object-cover to crop inside the frame (Instagram behavior).
 */
function FixedPreviewPanel({
  src,
  title,
  isInstagram,
  ratio,
  count,
  idx,
  onPrev,
  onNext,
}: {
  src?: string
  title?: string
  isInstagram: boolean
  ratio: '1:1' | '4:5' | '9:16'
  count: number
  idx: number
  onPrev: () => void
  onNext: () => void
}) {
  const H = 420;           // fixed viewport height (px) – dialog won't grow
  const MAX_W = 360;       // max frame width (px) – column stays steady

  // derive frame width from aspect but clamp to MAX_W so dialog never expands
  const [rw, rh] = ratio === '1:1' ? [1, 1] : ratio === '4:5' ? [4, 5] : [9, 16]
  let frameW = Math.round((H * rw) / rh)
  if (frameW > MAX_W) frameW = MAX_W
  if (frameW < 220) frameW = 220 // avoid ultra-narrow stick look

  // touch swipe
  const touch = React.useRef<{ x: number; y: number } | null>(null)
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    if (Math.abs(dx) > 40) (dx > 0 ? onPrev() : onNext())
    touch.current = null
  }

  return (
    <div className="rounded-2xl border border-border bg-black/70 p-3">
      {/* Outer viewport is fixed height H; it NEVER changes */}
      <div className="grid place-items-center" style={{ height: H }}>
        {/* Inner frame changes width only; height stays H; image crops to it */}
        <div
          className="relative overflow-hidden rounded-xl bg-black/60"
          style={{ width: frameW, height: H }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {src ? (
            <img
              src={src}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover" // crop to frame
              referrerPolicy="no-referrer"
              decoding="async"
              loading="eager"
              draggable={false}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs opacity-60">No image</div>
          )}

          {/* Controls – don't affect layout */}
          {count > 1 && (
            <>
              <button
                onClick={onPrev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={onNext}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {Array.from({ length: count }).map((_, i) => (
                  <span
                    key={i}
                    className={clsx(
                      'h-1.5 w-1.5 rounded-full',
                      i === idx ? 'bg-primary' : 'bg-white/40'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* IG caption preview sits outside the frame so it doesn't change height */}
      {isInstagram && (
        <div className="mt-2 truncate text-sm opacity-80">{title}</div>
      )}
    </div>
  )
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs ${active ? 'bg-primary text-black' : 'bg-muted'}`}
    >
      {label}
    </button>
  )
}

function AspectChip({ label, active, onClick }: { label: '1:1' | '4:5' | '9:16'; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 ${active ? 'bg-primary text-black' : 'bg-muted'}`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
