// components/PackGallery.tsx
'use client'
import * as React from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { logger } from '@/lib/logger'
import { clsx } from '@/lib/utils'

export function PackGallery({ images }: { images: string[] }) {
  const imgs = (images || []).filter(Boolean)
  const MANY = imgs.length > 4

  const [idx, setIdx] = React.useState(0)
  const [loaded, setLoaded] = React.useState<boolean[]>(() => imgs.map(() => false))
  const [errored, setErrored] = React.useState<boolean[]>(() => imgs.map(() => false))

  React.useEffect(() => {
    setLoaded(imgs.map(() => false))
    setErrored(imgs.map(() => false))
    imgs.forEach((src, i) => {
      const el = new Image()
      el.decoding = 'async'
      el.loading = 'eager'
      el.referrerPolicy = 'no-referrer'
      el.src = src
      el.onload = () => setLoaded((p) => { const a = [...p]; a[i] = true; return a })
      el.onerror = () => setErrored((p) => { const a = [...p]; a[i] = true; return a })
    })
  }, [imgs.join('|')])

  // ===== Small grid (≤ 4) – fit-by-height =====
  if (!MANY) {
    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {imgs.map((src, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden rounded-xl bg-neutral-900"
            style={{ height: 260 }}
          >
            {!loaded[i] && !errored[i] && <div className="absolute inset-0 animate-pulse bg-neutral-800" />}
            {errored[i] ? (
              <Placeholder />
            ) : (
              <img
                src={src}
                alt={`preview ${i + 1}`}
                className={clsx(
                  // 👇 keep aspect, fill by height, don’t overflow width
                  'h-full w-auto max-w-full object-contain transition-opacity duration-300 mx-auto',
                  loaded[i] ? 'opacity-100' : 'opacity-0'
                )}
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  // ===== Carousel (> 4) – fit-by-height =====
  const H = 460

  const prev = () =>
    setIdx((p) => {
      const n = (p - 1 + imgs.length) % imgs.length
      logger.info('gallery.prev', { from: p, to: n })
      return n
    })
  const next = () =>
    setIdx((p) => {
      const n = (p + 1) % imgs.length
      logger.info('gallery.next', { from: p, to: n })
      return n
    })

  const touch = React.useRef<{ x: number; y: number } | null>(null)
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next())
    touch.current = null
  }

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-xl bg-neutral-900"
        style={{ height: H }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
          aria-live="polite"
        >
          {imgs.map((src, i) => (
            <div
              key={i}
              // 👇 full-width slide, center content
              className="min-w-full shrink-0 grow-0 basis-auto relative flex items-center justify-center"
              style={{ height: H }}
            >
              {!loaded[i] && !errored[i] && <div className="absolute inset-0 animate-pulse bg-neutral-800" />}
              {errored[i] ? (
                <Placeholder />
              ) : (
                <img
                  src={src}
                  alt={`preview ${i + 1}`}
                  className={clsx(
                    // 👇 fit by height, keep aspect, center horizontally
                    'h-full w-auto max-w-full object-contain transition-opacity duration-300',
                    loaded[i] ? 'opacity-100' : 'opacity-0'
                  )}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  loading="eager"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {imgs.map((_, i) => (
              <span
                key={i}
                className={clsx('h-1.5 w-1.5 rounded-full', i === idx ? 'bg-primary' : 'bg-white/40')}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Placeholder() {
  return (
    <div className="grid h-full w-full place-items-center text-xs text-white/70">
      <div className="flex items-center gap-2 rounded-md bg-black/50 px-3 py-2">
        <ImageOff className="h-4 w-4" />
        Image unavailable
      </div>
    </div>
  )
}
