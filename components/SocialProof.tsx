"use client";
import * as React from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicActivity } from "@/lib/usePublicActivity";
import { cn } from "@/lib/utils";

// --- Utils
function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

// --- Floating toast-like ticker (homepage)
export function SocialProofTicker({
  className,
  intervalMs = 7000,
}: {
  className?: string;
  intervalMs?: number;
}) {
  const { data } = usePublicActivity(undefined, 30000);
  const items = data?.recent ?? [];

  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!items.length || paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, paused, intervalMs]);

  if (!items.length) return null;
  const it = items[i];

  return (
    <div
      className={cn(
        "fixed left-4 bottom-4 z-40 hidden sm:block",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Card className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 backdrop-blur p-3 shadow-lg animate-in fade-in zoom-in-90">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Sparkles className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="text-sm leading-5">
            <span className="font-semibold">{it.name}</span> from {it.city} just generated{" "}
            <span className="font-semibold">{it.pack_title}</span>.
            <div className="text-xs opacity-70">{timeAgo(it.ts)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// --- Compact badge for pack detail page CTA
export function PackActivityBadge({ packSlug }: { packSlug: string }) {
  const { data } = usePublicActivity(packSlug, 60000);
  const n = data?.pack_hour_count;
  if (!n) return null;
  return (
    <Badge variant="secondary" className="gap-2">
      <Sparkles className="h-3.5 w-3.5" />
      {n.toLocaleString()} generated in the last hour
    </Badge>
  );
}

// Optional: inline strip under a section title
export function SectionActivityStrip() {
  const { data } = usePublicActivity(undefined, 45000);
  if (!data?.recent?.length) return null;
  const sample = data.recent.slice(0, 5);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/70">
      {sample.map((r) => (
        <span key={r.id} className="rounded-full border px-2 py-1">
          {r.name} • {r.city} → {r.pack_title}
        </span>
      ))}
    </div>
  );
}
