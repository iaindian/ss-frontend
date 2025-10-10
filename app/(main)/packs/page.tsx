// app/(main)/packs/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import PackDetailClient from "./[slug]/PackDetailClient";

type Pack = {
  slug: string;
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  inStock?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function PacksIndexOrFallback() {
  const pathname = usePathname();
  console.log("path name is:",pathname)

  // If we're at /packs/<slug>, grab the slug
  const slug = useMemo(() => {
    const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
     console.log("parts name is:",parts)
    return parts.length >= 2 && parts[0] === "packs" ? decodeURIComponent(parts[1]) : null;
  }, [pathname]);

  console.log("Slug is:",slug);
  
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => setMounted(true), []);
  // if (!mounted) return null;

  // If there is a slug, act as a **detail fallback** (no redeploy)
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/packs/${slug}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Pack;
        if (!cancelled) setPack(data);
      } catch {
        if (!cancelled) setError("Could not load this pack.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // A) No slug → your normal packs index
  if (!slug) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Packs</h1>
        {/* Your existing listing component here */}
        {/* <PackGallery /> or whatever you already use */}
      </main>
    );
  }

  // B) With slug → client-side fallback detail page
  if (loading) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Loading pack…</h1>
        <p className="mt-2 text-neutral-600">Fetching details…</p>
      </main>
    );
  }

  if (error || !pack) {
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Pack not found</h1>
        <p className="mt-2 text-neutral-600">
          This pack might be new — try again later.
        </p>
      </main>
    );
  }

  // You can render with your existing client component if you want a single codepath:
  return <PackDetailClient slug={slug} initialPack={pack as any} />;
}
