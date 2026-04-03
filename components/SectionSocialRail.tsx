// components/SectionSocialRail.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Pack } from "@/lib/types";
import { gaEvent } from "@/lib/gtag";

type RailProps = {
  title: string;
  packs: Pack[];
  onGenerate: (pack: Pack) => void | Promise<void>;
  /** seconds between auto-scroll steps (default 5) */
  intervalSeconds?: number;
  /** seconds to keep everything paused after interaction (default 6) */
  resumeAfterSeconds?: number;
  className?: string;
  freeCredits?: number;
};

const NAMES = [
  "Sophia Martin",
  "Chloe Anderson",
  "Lily Collins",
  "Maya Khan",
  "Ava Thompson",
  "Zoe Nguyen",
  "Emma Brooks",
  "Nora Patel",
  "Grace Li",
  "Isla Carter",
  "Elena Rossi",
  "Mila Novak",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sample<T>(arr: T[]) {
  return arr[rand(0, arr.length - 1)];
}

export function SectionSocialRail({
  title,
  packs,
  onGenerate,
  intervalSeconds = 7,
  resumeAfterSeconds = 10,
  className,
  freeCredits = 0,
}: RailProps) {
  // We’ll resolve the Radix viewport and store it here for scrolling & listeners
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  const [paused, setPaused] = React.useState(false);
  const resumeTimer = React.useRef<number | null>(null);

  const pauseAll = React.useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(
      () => setPaused(false),
      resumeAfterSeconds * 1000,
    ) as unknown as number;
  }, [resumeAfterSeconds]);

  // Grab the Radix viewport element once the root is mounted
  React.useEffect(() => {
    if (!rootRef.current) return;
    const viewport = rootRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLDivElement | null;
    if (viewport) scrollerRef.current = viewport;
  }, []);

  // Auto-scroll the whole rail by one card width every N seconds
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const scrollStep = () => {
      if (paused) return;
      const firstCard = el.querySelector<HTMLElement>("[data-card]");
      const row = firstCard?.parentElement;
      const styles = row ? window.getComputedStyle(row) : null;
      const gap = Number.parseFloat(styles?.columnGap || styles?.gap || "24") || 24;
      const w = (firstCard?.offsetWidth || 280) + gap;

      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft + w >= max - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: w, behavior: "smooth" });
      }
    };

    const id = window.setInterval(scrollStep, intervalSeconds * 1000);
    return () => window.clearInterval(id);
  }, [intervalSeconds, paused]);

  // Pause auto-scroll on interaction with the viewport
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const handler = () => pauseAll();
    el.addEventListener("wheel", handler, { passive: true });
    el.addEventListener("pointerdown", handler, { passive: true });
    el.addEventListener("pointermove", handler, { passive: true });
    el.addEventListener("touchstart", handler, { passive: true });
    return () => {
      el.removeEventListener("wheel", handler);
      el.removeEventListener("pointerdown", handler);
      el.removeEventListener("pointermove", handler);
      el.removeEventListener("touchstart", handler);
    };
  }, [pauseAll]);

  if (!packs?.length) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="px-1 text-lg font-semibold sm:text-xl">{title}</h2>

      {/* Themed horizontal scrollbar via shadcn/Radix */}
      <ScrollArea
        ref={rootRef}
        className="relative -mx-3 px-3 py-2"
        type="always" // shows tasteful bar (appears on hover)
      >
        {/* children go inside the Radix viewport automatically */}
        <div className="flex gap-3 pb-4 pr-3 sm:gap-6 sm:pb-6 sm:pr-6">
          {packs.map((p) => (
            <PackSocialCard
              key={p.id}
              pack={p}
              paused={paused}
              onGenerate={() => onGenerate(p)}
              onInteract={pauseAll}
              freeCredits={freeCredits}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </section>
  );
}

function PackSocialCard({
  pack,
  paused,
  onGenerate,
  onInteract,
  freeCredits = 0,
}: {
  pack: Pack;
  paused: boolean;
  freeCredits?: number;
  onGenerate: () => void | Promise<void>;
  onInteract?: () => void;
}) {
  const isSlideDisabled = false;
  const imgs = (pack.preview_images || []).length
    ? pack.preview_images
    : ["/placeholder.png"];

  const [idx, setIdx] = React.useState(0);

  // Per-card image carousel
  React.useEffect(() => {
    if (paused || isSlideDisabled) return;
    const id = window.setInterval(() => {
      setIdx((n) => (n + 1) % imgs.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [imgs.length, paused]);

  const name = React.useMemo(() => sample(NAMES), []);
  const caption = React.useMemo(
    () =>
      [
        "New drop 💫",
        "Travel vibes ✈️",
        "Golden hour 🌅",
        "Studio day 🎬",
        "If you know, you know 😉",
      ][rand(0, 4)],
    [],
  );
  const likes = React.useMemo(() => rand(5200, 120000), []);
  const comments = React.useMemo(() => rand(25, 540), []);

  const interact = () => onInteract?.();

  return (
    <div
      data-card
      className={cn(
        "flex w-[156px] shrink-0 flex-col rounded-xl border border-white/10 bg-[#0d0f12] sm:w-[280px] sm:rounded-2xl",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
      )}
      onMouseEnter={interact}
      onTouchStart={interact}
      onPointerDown={interact}
    >
      {/* header */}
      <div className="flex min-h-[42px] items-start gap-2 px-2.5 pt-2.5 sm:min-h-[52px] sm:gap-3 sm:px-4 sm:pt-4">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400/60 to-cyan-400/60 sm:h-8 sm:w-8" />
        <div className="flex-1">
          <div className="truncate text-[11px] font-semibold leading-tight sm:text-sm">{name}</div>
          <div className="truncate text-[10px] text-white/60 sm:text-xs">{caption}</div>
        </div>
        <div className="hidden text-[10px] text-white/50 sm:block sm:text-xs">
          {new Date().toLocaleDateString().slice(0, 6)}
        </div>
      </div>

      {/* image carousel */}
      <div className="px-2.5 pt-2 sm:px-4 sm:pt-3">
        <Link
          href={`/packs/${pack.slug || pack.id}`}
          prefetch={false}
          onClick={() =>
            gaEvent({
              action: "view_pack_click",
              category: "engagement",
              params: { pack_id: pack.id, pack_slug: pack.slug },
            })
          }
        >
          <div className="aspect-[9/16] w-full overflow-hidden rounded-md border border-white/10 sm:rounded-xl">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform"
              style={{ transform: `translateX(-${idx * 100}%)` }}
              onMouseEnter={interact}
              onTouchStart={interact}
            >
              {imgs.map((src, i) => (
                <div key={i} className="min-w-full h-full relative">
                  <img
                    src={src}
                    alt={`${pack.title} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* actions row */}
      <div className="flex items-center justify-between px-2.5 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2.5 text-white/80 sm:gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            <span className="text-[11px] sm:text-sm">{likes.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-white/80 sm:gap-4">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            <span className="text-[11px] sm:text-sm">{comments.toLocaleString()}</span>
          </div>
          <Bookmark className="h-3.5 w-3.5 text-white/70 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* footer / CTA */}
      <div className="mt-auto px-2.5 pb-2.5 sm:px-4 sm:pb-4">
        <div className="flex items-end justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 text-[10px] opacity-80 sm:text-sm">
            {freeCredits >= 20 ? (
              <span
                className="inline-flex max-w-full items-center rounded-full border border-emerald-400/30
                     bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium leading-tight text-emerald-300 sm:px-2 sm:text-[11px]"
              >
                20 credits
              </span>
            ) : (
              <span className="font-medium opacity-60">20 credits</span>
            )}
          </div>

          <Button
            className={`h-6 min-w-0 shrink-0 justify-center rounded-xl px-1.5 text-[9px] leading-none sm:h-8 sm:px-3 sm:text-xs ${
              freeCredits >= 20
                ? "bg-emerald-500 text-black hover:bg-emerald-500/90 dark:text-emerald-50"
                : ""
            }`}
            onClick={onGenerate}
            aria-label={freeCredits >= 20 ? "Generate with credits" : "Generate"}
          >
            {freeCredits >= 20 ? "Generate Free" : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
