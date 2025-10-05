"use client";
import * as React from "react";

export type ActivityItem = {
  id: string;
  name: string;
  city: string;
  pack_title: string;
  pack_slug: string;
  ts: number; // epoch ms
};

export type ActivityResponse = {
  recent: ActivityItem[];
  pack_hour_count?: number;
};

export function usePublicActivity(packSlug?: string, pollMs = 30000) {
  const [data, setData] = React.useState<ActivityResponse | null>(null);

  async function load() {
    const url = packSlug ? `/api/activity?slug=${encodeURIComponent(packSlug)}` : "/api/activity";
    const res = await fetch(url, { cache: "no-store" });
    setData(await res.json());
  }

  React.useEffect(() => {
    let dead = false;
    (async () => { if (!dead) await load(); })();
    const id = setInterval(() => { if (!dead) load(); }, pollMs);
    return () => { dead = true; clearInterval(id); };
  }, [packSlug, pollMs]);

  return { data, refresh: load };
}
