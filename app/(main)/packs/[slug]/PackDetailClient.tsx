// app/(main)/packs/[slug]/PackDetailClient.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAttributes } from "@/hooks/useAttributes";
import { Api } from "@/lib/api";
import type { Pack } from "@/lib/types";
import { logger } from "@/lib/logger";
import { packCreditCost } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ErrorView } from "@/components/ErrorView";
import { PackGallery } from "@/components/PackGallery";
import { SocialPreviewDialog } from "@/components/SocialPreview";
import { getStripe } from "@/lib/stripe";
import { gaEvent } from "@/lib/gtag";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmGenerateDialog } from "@/components/ConfirmGenerateDialog";
import { BuyCreditsModal } from "@/components/BuyCreditsModal";

type Props = {
  /** when used as fallback from /packs, you can pass the slug explicitly */
  slug?: string;
  /** when provided, we skip the first fetch */
  initialPack?: Pack | null;
};

export default function PackDetailClient({
  slug: propSlug,
  initialPack,
}: Props) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = propSlug ?? routeSlug; // prefer prop (fallback) else URL param

  const router = useRouter();
  const { attributes, hasAttributes } = useAttributes();

  // ✅ seed state from initialPack if provided
  const [pack, setPack] = React.useState<Pack | null>(initialPack ?? null);
  // const [loading, setLoading] = React.useState<boolean>(!initialPack);
  const [loading, setLoading] = React.useState<boolean>(!initialPack && !!slug);
  const [error, setError] = React.useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [buying, setBuying] = React.useState(false);
  const { me } = useAuth();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [buyCreditsOpen, setBuyCreditsOpen] = React.useState(false);
  const [referenceUrl, setRefUrl] = React.useState<string | null>(null);
  const sentView = React.useRef<string | null>(null);

  if (!slug) return <ErrorView description="Pack not found" />;

  // fetch profile once (reference image url)
  React.useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res = await Api.getMyProfile();
        if (!dead) setRefUrl(res?.reference_image_url || null);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      dead = true;
    };
  }, []);

  // main loader (skips when initialPack matches)
  React.useEffect(() => {
    let mounted = true;

    // if a matching initialPack was supplied, fire analytics and bail
    if (initialPack && initialPack.slug === slug) {
      const key = `${(initialPack as any).id}:${initialPack.slug}`;
      if (sentView.current !== key) {
        sentView.current = key;
        gaEvent({
          action: "view_pack",
          category: "engagement",
          params: {
            pack_id: (initialPack as any).id,
            p_slug: initialPack.slug,
          },
        });
      }
      return;
    }

    async function load() {
      try {
        setError(null);
        setLoading(true);

        // 1) Try dedicated endpoint first
        try {
          const p = await (Api as any).getPack?.(slug);
          if (p && mounted) {
            setPack(p as Pack);
            logger.info("pack.detail.loaded", { slug, via: "getPack" });

            const key = `${(p as any).id}:${(p as any).slug}`;
            if (sentView.current !== key) {
              sentView.current = key;
              gaEvent({
                action: "view_pack",
                category: "engagement",
                params: { pack_id: (p as any).id, p_slug: (p as any).slug },
              });
            }
            return;
          }
        } catch {
          /* fall through */
        }

        // 2) Fallback to list → find by slug
        const res: any = await (Api as any).getPacks?.();
        const list: Pack[] = Array.isArray(res) ? res : res?.items ?? [];
        const p =
          list.find((x) => x.slug === slug || (x as any).id === slug) || null;
        if (!p) throw new Error("Pack not found");

        if (mounted) {
          setPack(p);
          logger.info("pack.detail.loaded", { slug, via: "getPacks-fallback" });

          const key = `${(p as any).id}:${(p as any).slug}`;
          if (sentView.current !== key) {
            sentView.current = key;
            gaEvent({
              action: "view_pack",
              category: "engagement",
              params: { pack_id: (p as any).id, p_slug: (p as any).slug },
            });
          }
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load pack");
        logger.error("pack.detail.error", { slug, error: e?.message });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [slug, initialPack]);

  function openConfirm() {
    if (!me) {
      alert("Please login to generate a pack.");
      window.location.href = "/login";
      return;
    }
    if (!hasAttributes || !referenceUrl) {
      alert(
        !hasAttributes
          ? "Please complete your attributes first. Redirecting…"
          : "Please upload a reference face first. Redirecting…"
      );
      router.push("/attributes?required=1");
      return;
    }
    setConfirmOpen(true);
  }

  async function handleGenerate() {
    if (!pack) return;
    setBuying(true);
    try {
      const res: any = await Api.createOrder({ pack_id: (pack as any).id });
      logger.info("order.created", {
        order_id: res?.id,
        pack_id: (pack as any).id,
      });
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
      router.push("/orders");
    } catch (e: any) {
      logger.error("order.create.failed", { error: e?.message });
      if (e?.message === "insufficient_credits" || e?.code === "402") {
        setBuyCreditsOpen(true);
      } else {
        alert(e?.message || "Failed to create order");
      }
    } finally {
      setBuying(false);
    }
  }

  if (loading) return <div className="p-6">Loading pack…</div>;
  // if (error || !pack) return <ErrorView description={error || "Not found" />} ;
  if (error || !pack) return <ErrorView description={error || "Not found"} />;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT: Hero / details */}
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-3">
          <PackGallery images={(pack as any)?.preview_images ?? []} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold">
              {pack?.title ?? "Untitled pack"}
            </h1>
            <span className="text-xs uppercase text-foreground/60">
              {(pack as any)?.category ?? ""}
            </span>
          </div>
          {pack?.description ? (
            <p className="text-sm opacity-90">{pack.description}</p>
          ) : (
            <p className="text-sm opacity-60">
              A curated style pack. See previews above.{" "}
              <Link href="/" className="underline">
                Back to all packs
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: Sticky CTA */}
      <div className="md:col-span-1">
        <div className="sticky top-20 space-y-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm opacity-70 mb-1">Cost</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold">{packCreditCost(pack)} credits</span>
              <span className="text-xs opacity-50">per generation</span>
            </div>
            {Number(me?.free_credits ?? 0) >= packCreditCost(pack) ? (
              <div className="mt-1 text-xs text-emerald-400">
                You have <strong>{me!.free_credits}</strong> credits — enough for {Math.floor(Number(me!.free_credits) / packCreditCost(pack))} pack{Math.floor(Number(me!.free_credits) / packCreditCost(pack)) !== 1 ? "s" : ""}
              </div>
            ) : (
              <button
                onClick={() => setBuyCreditsOpen(true)}
                className="mt-1 text-xs text-emerald-300 underline-offset-2 hover:underline"
              >
                + Buy credits
              </button>
            )}
            <div className="mt-4 grid gap-2">
              <Button onClick={openConfirm} loading={buying}>
                Generate This Pack
              </Button>
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                Preview on Social
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 text-xs opacity-70">
            <div className="font-medium mb-1">What you get</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>High-res images in ZIP</li>
              <li>Email when ready</li>
              <li>License for personal sharing</li>
            </ul>
          </div>
        </div>
      </div>

      <SocialPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        images={(pack as any)?.preview_images ?? []}
        title={pack?.title ?? "Pack"}
      />
      <ConfirmGenerateDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        packTitle={pack?.title ?? 'Selected pack'}
        attributes={attributes}
        referenceUrl={referenceUrl}
        freeCredits={Number(me?.free_credits ?? 0)}
        creditCost={packCreditCost(pack)}
        onConfirm={handleGenerate}
      />
      <BuyCreditsModal open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen} />
    </div>
  );
}
