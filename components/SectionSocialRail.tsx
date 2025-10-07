"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, cents } from "@/lib/utils";
import type { Pack } from "@/lib/types";
import { gaEvent } from '@/lib/gtag'

type RailProps = {
  title: string;
  packs: Pack[];
  onGenerate: (pack: Pack) => void | Promise<void>;
  /** seconds between auto-scroll steps (default 5) */
  intervalSeconds?: number;
  /** seconds to keep everything paused after interaction (default 6) */
  resumeAfterSeconds?: number;
  className?: string;
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
  intervalSeconds = 5,
  resumeAfterSeconds = 6,
  className,
}: RailProps) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = React.useState(false);
  const resumeTimer = React.useRef<number | null>(null);

  const pauseAll = React.useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(
      () => setPaused(false),
      resumeAfterSeconds * 1000
    ) as unknown as number;
  }, [resumeAfterSeconds]);

  // Auto-scroll the whole rail by one card width every N seconds
  React.useEffect(() => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current;

    const scrollStep = () => {
      if (paused) return;
      const firstCard = el.querySelector<HTMLElement>("[data-card]");
      const gap = 24; // matches "gap-6" below (6 * 4px)
      const w = (firstCard?.offsetWidth || 280) + gap;

      // loop around
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

  // Pause everything on any interaction with the rail
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
      <h2 className="px-1 text-xl font-semibold">{title}</h2>
      <div
        ref={scrollerRef}
        className="relative -mx-3 overflow-x-auto overflow-y-hidden px-3 py-2 scrollbar-none"
      >
        <div className="flex gap-6 pr-6">
          {packs.map((p) => (
            <PackSocialCard
              key={p.id}
              pack={p}
              paused={paused}
              onGenerate={() => onGenerate(p)}
              onInteract={pauseAll}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PackSocialCard({
  pack,
  paused,
  onGenerate,
  onInteract,
}: {
  pack: Pack;
  paused: boolean;
  onGenerate: () => void | Promise<void>;
  onInteract?: () => void;
}) {
  const isSlideDisabled = false; // using this flag to enable disable card slide
  const imgs = (pack.preview_images || []).length
    ? pack.preview_images
    : ["/placeholder.png"];

  const [idx, setIdx] = React.useState(0);

  // Per-card image carousel every 2s (pauses when rail is paused or user interacts)
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
    []
  );
  const likes = React.useMemo(() => rand(5200, 120000), []);
  const comments = React.useMemo(() => rand(25, 540), []);

  const interact = () => onInteract?.();

  return (
    <div
      data-card
      className={cn(
        "w-[280px] shrink-0 rounded-2xl bg-[#0d0f12] border border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
      )}
      onMouseEnter={interact}
      onTouchStart={interact}
      onPointerDown={interact}
    >
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400/60 to-cyan-400/60" />
        <div className="flex-1">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-white/60">{caption}</div>
        </div>
        <div className="text-xs text-white/50">
          {new Date().toLocaleDateString().slice(0, 6)}
        </div>
      </div>

      {/* image carousel (no rotation, straight card) */}
      {/* <div className="px-4 pt-3">
        <Link href={`/packs/${pack.slug || pack.id}`} prefetch={false}>
          <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10">
            <img
              key={idx}
              src={imgs[idx]}
              alt={pack.title}
              className="h-full w-full object-cover opacity-0 animate-[fadeIn_300ms_ease_forwards]"
            />
          </div>
        </Link>
      </div> */}
      <div className="px-4 pt-3">
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
          <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10">
            <div
              // className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
              className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] will-change-transform"
              style={{ transform: `translateX(-${idx * 100}%)` }}
              onMouseEnter={interact}
              onTouchStart={interact}
            >
              {imgs.map((src, i) => (
                <div key={i} className="min-w-full h-full">
                  <img
                    src={src}
                    alt={`${pack.title} ${i + 1}`}
                    className="h-full w-full object-cover select-none pointer-events-none"
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
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-white/80">
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5" />
            <span className="text-sm">{likes.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/80">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{comments.toLocaleString()}</span>
          </div>
          <Bookmark className="h-5 w-5 text-white/70" />
        </div>
      </div>

      {/* footer / CTA */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-80">
            {cents(pack.price_cents, pack.currency)}
          </div>
          <Button size="sm" className="h-8 px-3 text-xs" onClick={onGenerate}>
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
