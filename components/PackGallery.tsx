// components/PackGallery.tsx
"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, ImageOff, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { logger } from "@/lib/logger";
import { clsxx } from "@/lib/utils";

export function PackGallery({ images }: { images: string[] }) {
  const imgs = (images || []).filter(Boolean);
  const [idx, setIdx] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [loaded, setLoaded] = React.useState<boolean[]>(() =>
    imgs.map(() => false)
  );
  const [errored, setErrored] = React.useState<boolean[]>(() =>
    imgs.map(() => false)
  );

  React.useEffect(() => {
    setIdx(0);
    setZoom(1);
    setLoaded(imgs.map(() => false));
    setErrored(imgs.map(() => false));
    imgs.forEach((src, i) => {
      const el = new Image();
      el.decoding = "async";
      el.loading = "eager";
      el.referrerPolicy = "no-referrer";
      el.src = src;
      el.onload = () =>
        setLoaded((p) => {
          const a = [...p];
          a[i] = true;
          return a;
        });
      el.onerror = () =>
        setErrored((p) => {
          const a = [...p];
          a[i] = true;
          return a;
        });
    });
  }, [imgs.join("|")]);

  const H = 460;
  const zoomIn = React.useCallback(
    () => setZoom((z) => Math.min(4, Math.round((z + 0.25) * 100) / 100)),
    []
  );
  const zoomOut = React.useCallback(
    () => setZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100)),
    []
  );

  const prev = React.useCallback(
    () =>
      setIdx((p) => {
        const n = (p - 1 + imgs.length) % imgs.length;
        logger.info("gallery.prev", { from: p, to: n });
        return n;
      }),
    [imgs.length]
  );

  const next = React.useCallback(
    () =>
      setIdx((p) => {
        const n = (p + 1) % imgs.length;
        logger.info("gallery.next", { from: p, to: n });
        return n;
      }),
    [imgs.length]
  );

  React.useEffect(() => {
    if (!open || imgs.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, imgs.length, next, prev]);

  React.useEffect(() => {
    if (!open) setZoom(1);
  }, [open]);

  React.useEffect(() => {
    if (open) setZoom(1);
  }, [idx, open]);

  const touch = React.useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (zoom > 1) {
      touch.current = null;
      return;
    }
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
    touch.current = null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {imgs.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIdx(i);
              setZoom(1);
              setOpen(true);
            }}
            className="relative w-full overflow-hidden rounded-xl bg-neutral-900 text-left focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ height: 260 }}
            aria-label={`Open preview ${i + 1} of ${imgs.length}`}
          >
            {!loaded[i] && !errored[i] && (
              <div className="absolute inset-0 animate-pulse bg-neutral-800" />
            )}
            {errored[i] ? (
              <Placeholder />
            ) : (
              <img
                src={src}
                alt={`preview ${i + 1}`}
                className={clsxx(
                  "mx-auto h-full w-auto max-w-full object-contain transition-opacity duration-300",
                  loaded[i] ? "opacity-100" : "opacity-0"
                )}
                referrerPolicy="no-referrer"
                decoding="async"
                loading="eager"
                draggable={false}
              />
            )}
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-[26rem] border-border bg-card p-2 sm:w-[88vw] sm:max-w-[30rem] sm:p-3 md:max-w-[34rem]">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 pr-10">
              <div className="text-sm font-medium opacity-80">
                {idx + 1} / {imgs.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  className="rounded-full border border-border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="min-w-14 text-center text-xs tabular-nums opacity-70">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= 4}
                  className="rounded-full border border-border bg-background p-2 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-xl bg-neutral-900"
              style={{ height: `min(82vh, ${H + 220}px)` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="modal-scrollbar relative h-full overflow-auto"
                style={{ height: `min(82vh, ${H + 220}px)` }}
                aria-live="polite"
              >
                <div className="flex min-h-full min-w-full items-center justify-center overflow-hidden p-2 sm:p-4">
                  {!loaded[idx] && !errored[idx] && (
                    <div className="absolute inset-0 animate-pulse bg-neutral-800" />
                  )}
                  {errored[idx] ? (
                    <Placeholder />
                  ) : (
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: `scale(${zoom})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <img
                        src={imgs[idx]}
                        alt={`preview ${idx + 1}`}
                        className={clsxx(
                          "max-h-full max-w-full object-contain transition-opacity duration-300",
                          loaded[idx] ? "opacity-100" : "opacity-0"
                        )}
                        referrerPolicy="no-referrer"
                        decoding="async"
                        loading="eager"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              </div>

              {imgs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
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
                        className={clsxx(
                          "h-1.5 w-1.5 rounded-full",
                          i === idx ? "bg-primary" : "bg-white/40"
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {imgs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={clsxx(
                      "relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border bg-neutral-900",
                      i === idx ? "border-primary" : "border-border"
                    )}
                    aria-label={`Show preview ${i + 1}`}
                    aria-pressed={i === idx}
                  >
                    {errored[i] ? (
                      <Placeholder />
                    ) : (
                      <img
                        src={src}
                        alt={`thumbnail ${i + 1}`}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        decoding="async"
                        loading="lazy"
                        draggable={false}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Placeholder() {
  return (
    <div className="grid h-full w-full place-items-center text-xs text-white/70">
      <div className="flex items-center gap-2 rounded-md bg-black/50 px-3 py-2">
        <ImageOff className="h-4 w-4" />
        Image unavailable
      </div>
    </div>
  );
}
