"use client";
import * as React from "react";
import { usePacks } from "@/hooks/usePacks";
import { useAuth } from "@/hooks/useAuth";
import { PackCard } from "@/components/PackCard";
import { ErrorView } from "@/components/ErrorView";
import { Api } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import type { Pack } from "@/lib/types";
import { SectionRail } from "@/components/SectionRails"; // ✅ use existing component
import { useAttributes } from "@/hooks/useAttributes";
import { ConfirmGenerateDialog } from "@/components/ConfirmGenerateDialog";

export default function PacksPage() {
  const { packs, loading, error } = usePacks();
  const { me } = useAuth();
  const { attributes } = useAttributes();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Pack | null>(null);
  const [refUrl, setRefUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await Api.getMyProfile();
        if (!dead) setRefUrl(res?.reference_image_url || null);
      } catch {
        // ignore
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  const [sections, setSections] = React.useState<
    { slug: string; name: string }[]
  >([]);
  const [rails, setRails] = React.useState<Record<string, Pack[]>>({});

  function openConfirm(pack: Pack) {
    if (!me) {
      alert("Please login to generate a pack.");
      window.location.href = "/login";
      return;
    }

    const hasAttrs = attributes && Object.keys(attributes || {}).length > 0;
    if (!hasAttrs || !refUrl) {
      alert(
        !hasAttrs
          ? "Please complete your attributes first. Redirecting…"
          : "Please upload a reference face first. Redirecting…"
      );
      window.location.href = "/attributes?required=1";
      return;
    }
    setSelected(pack);
    setConfirmOpen(true);
  }

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { sections } = await Api.getSections().catch(() => ({
          sections: [],
        }));
        if (cancelled) return;

        // choose which rails to show
        // const wanted = ['featured', 'trending']
        // const show = (sections || []).filter((s: any) => wanted.includes(s.slug))
        const wanted = ["featured", "trending", "gym-series", "indoor-shoots"];
        const show = (sections || []).filter((s: any) =>
          wanted.includes(s.slug)
        );
        setSections(show);

        const entries = await Promise.all(
          show.map(async (s: any) => {
            try {
              const res = await Api.getSectionPacks(s.slug, 40);
              const items: Pack[] = res?.items ?? [];
              return [s.slug, items] as const;
            } catch {
              return [s.slug, []] as const;
            }
          })
        );
        if (!cancelled) setRails(Object.fromEntries(entries));
      } catch (e) {
        // ignore for now, optional feature
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerate(pack: Pack) {
    try {
      const res: any = await Api.createOrder({ pack_id: pack.id });
      logger.info("Order created", { order_id: res?.id });
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
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

  if (loading) return <div>Loading packs…</div>;
  if (error) return <ErrorView description={error} />;

  return (
    <div className="space-y-8">
      {/* Rails — using the shared SectionRail component */}
      {sections.map((s) => {
        const items = rails[s.slug] || [];
        if (!items.length) return null;
        return (
          <SectionRail
            key={s.slug}
            title={s.name}
            packs={items}
            me={me}
            onGenerate={openConfirm}
          />
        );
      })}

      {/* Fallback grid (your original design) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packs.map((p) => (
          <PackCard
            key={p.id}
            pack={p}
            me={me}
            onGenerate={() => openConfirm(p)}
          />
        ))}
      </div>
      <ConfirmGenerateDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        packTitle={selected?.title || "Selected pack"}
        attributes={attributes}
        referenceUrl={refUrl}
        onConfirm={async () => {
          if (!selected) return;
          await handleGenerate(selected);
        }}
      />
    </div>
  );
}
