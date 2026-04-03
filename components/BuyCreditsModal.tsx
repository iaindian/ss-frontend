"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Api } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { gaEvent } from "@/lib/gtag";
import type { CreditBundle } from "@/lib/types";

// 1 pack = 20 credits. Static fallback (overridden by API response).
const CREDITS_PER_PACK = 20;

const FALLBACK_BUNDLES: CreditBundle[] = [
  { id: "starter",  credits: 100,  price_cents: 99,   currency: "usd", label: "Starter" },
  { id: "popular",  credits: 300,  price_cents: 249,  currency: "usd", label: "Popular",   badge: "Best value" },
  { id: "pro",      credits: 1000, price_cents: 699,  currency: "usd", label: "Pro",        badge: "Save 30%" },
  { id: "ultimate", credits: 2500, price_cents: 1499, currency: "usd", label: "Ultimate",   badge: "Save 40%" },
];

function fmtPrice(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function BuyCreditsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [bundles, setBundles] = React.useState<CreditBundle[]>(FALLBACK_BUNDLES);
  const [buying, setBuying] = React.useState<string | null>(null);

  // Try to load server-side bundles (price overrides)
  React.useEffect(() => {
    if (!open) return;
    Api.getCreditBundles()
      .then((r) => { if (r?.bundles?.length) setBundles(r.bundles); })
      .catch(() => { /* keep fallback */ });
  }, [open]);

  async function handleBuy(bundle: CreditBundle) {
    setBuying(bundle.id);
    try {
      const res = await Api.buyCreditBundle(bundle.id);
      gaEvent({ action: "buy_credits_start", category: "monetisation", params: { bundle_id: bundle.id, credits: bundle.credits } });
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      if (res?.client_secret) {
        const stripe = await getStripe();
        if (!stripe) throw new Error("Stripe not configured");
        const { error } = await stripe.confirmCardPayment(res.client_secret);
        if (error) throw error;
        window.location.href = "/orders";
      }
    } catch (e: any) {
      alert(e?.message || "Payment failed. Please try again.");
    } finally {
      setBuying(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.65)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-300" fill="currentColor">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            </span>
            <div>
              <div className="text-base font-semibold">Buy Credits</div>
              <div className="text-xs opacity-50">1 credit = 1 pack generation</div>
            </div>
          </div>
        </div>

        {/* Bundle grid */}
        <div className="px-5 py-4 space-y-3">
          {bundles.map((b) => {
            const packs = Math.floor(b.credits / CREDITS_PER_PACK);
            const perPack = fmtPrice(Math.round(b.price_cents / packs), b.currency);
            const isLoading = buying === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleBuy(b)}
                disabled={!!buying}
                className="w-full flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 hover:bg-muted/60 transition-colors disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-3">
                  {/* Credits pill */}
                  <div className="flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/30">
                    <span className="text-lg font-bold text-emerald-300 leading-none">{b.credits.toLocaleString()}</span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-300/60 leading-none mt-0.5">credits</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {b.label}
                      {b.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                          {b.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-50">{packs} packs · {perPack}/pack</div>
                  </div>
                </div>
                <div className="text-right">
                  {isLoading ? (
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
                  ) : (
                    <span className="text-base font-semibold">{fmtPrice(b.price_cents, b.currency)}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-5 pb-5 text-xs opacity-40 text-center">
          Credits never expire &bull; Secure payment via Stripe
        </div>
      </DialogContent>
    </Dialog>
  );
}
