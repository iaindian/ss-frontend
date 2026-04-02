// app/(main)/packs/page.tsx
"use client";
import * as React from "react";
import { usePacks } from "@/hooks/usePacks";
import { useAuth } from "@/hooks/useAuth";
import { ErrorView } from "@/components/ErrorView";
import { Api } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import type { Pack } from "@/lib/types";
import { SectionSocialRail } from "@/components/SectionSocialRail";
import { useAttributes } from "@/hooks/useAttributes";
import { ConfirmGenerateDialog } from "@/components/ConfirmGenerateDialog";

function BoxSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card h-40" />
  );
}

export default function PacksPage() {
  const { packs, loading, error } = usePacks();  // ✅ do NOT early-return on loading
  
  const { me } = useAuth();
  const { attributes } = useAttributes();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Pack | null>(null);
  const [refUrl, setRefUrl] = React.useState<string | null>(null);
  const [freeCredits, setFreeCredits] = React.useState<number>(0);

  // ---- profile: fire-and-forget with timeout, never block UI
  React.useEffect(() => {
    let dead = false;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    (async () => {
      try {
        const res: any = await Api.getMyProfile();
        if (!dead && res) {
          setRefUrl(res?.reference_image_url || null);
          setFreeCredits(Number(res?.free_credits || 0));
        }
      } catch {}
      finally { clearTimeout(t); }
    })();
    return () => { dead = true; ctrl.abort(); clearTimeout(t); };
  }, []);

  const [sections, setSections] = React.useState<{ slug: string; name: string }[]>([]);
  const [rails, setRails] = React.useState<Record<string, Pack[]>>({});

  // ---- sections: also non-blocking with timeout
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const resp: any = await Api.getSections().catch(() => ({ sections: [] }));
        if (cancelled) return;
        const wanted = ["latest","featured", "trending", "lifestyle", "fitness-wellness","work-passion","travel","nightlife","boudoir"];
        const show = (resp?.sections || []).filter((s: any) => wanted.includes(s.slug));
        setSections(show);

        const entries = await Promise.all(
          show.map(async (s: any) => {
            try {
              const r: any = await Api.getSectionPacks(s.slug, 40);
              return [s.slug, (r?.items ?? []) as Pack[]] as const;
            } catch { return [s.slug, []] as const; }
          })
        );
        if (!cancelled) setRails(Object.fromEntries(entries));
      } catch {}
    })();

    return () => { cancelled = true };
  }, []);

  function openConfirm(pack: Pack) {
    if (!me) {
      alert("Please login to generate a pack.");
      window.location.href = "/login";
      return;
    }
    const hasAttrs = attributes && Object.keys(attributes || {}).length > 0;
    if (!hasAttrs || !refUrl) {
      alert(!hasAttrs
        ? "Please complete your attributes first. Redirecting…"
        : "Please upload a reference face first. Redirecting…");
      window.location.href = "/attributes?required=1";
      return;
    }
    setSelected(pack);
    setConfirmOpen(true);
  }

  async function handleGenerate(pack: Pack) {
    try {
      const res: any = await Api.createOrder({ pack_id: pack.id });
      logger.info("Order created", { order_id: res?.id });
      if (res?.checkout_url) { window.location.href = res.checkout_url; return; }
      if (res?.client_secret) {
        const stripe = await getStripe();
        if (!stripe) throw new Error("Stripe not configured");
        const { error } = await stripe.confirmCardPayment(res.client_secret);
        if (error) throw error;
      }
      window.location.href = "/orders";
    } catch (e: any) {
      logger.error("Generate failed", { error: e?.message });
      alert(e?.message || "Failed to create order");
    }
  }

  // ❌ remove this hard block:
  // if (loading) return <div>Loading packs…</div>;
  if (error) return <ErrorView description={error} />;

  return (
    <div className="space-y-8">
      {/* skeleton above the fold while sections/packs load */}
      {loading && sections.length === 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BoxSkeleton /><BoxSkeleton /><BoxSkeleton />
        </div>
      )}

      {sections.map((s) => {
        const items = rails[s.slug] || [];
        if (!items.length) return null;
        return (
          <SectionSocialRail
            key={s.slug}
            title={s.name}
            packs={items}
            onGenerate={openConfirm}
            intervalSeconds={5}
            resumeAfterSeconds={6}
            freeCredits={freeCredits}
          />
        );
      })}

      <ConfirmGenerateDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        packTitle={selected?.title || "Selected pack"}
        attributes={attributes}
        referenceUrl={refUrl}
        freeCredits={freeCredits}
        onConfirm={async () => { if (selected) await handleGenerate(selected); }}
      />
    </div>
  );
}
