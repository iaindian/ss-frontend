"use client";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { gaEvent } from "@/lib/gtag";
import type { Attributes } from "@/lib/types";

// ─── Prompt builder (copy of AttributesForm logic — kept in sync) ─────────────
function buildPrompt(f: Attributes | null | undefined): string {
  if (!f) return ""
  const she = f.gender === "male" ? "He" : f.gender === "non_binary" ? "They" : "She"
  const her  = f.gender === "male" ? "his" : f.gender === "non_binary" ? "their" : "her"
  const sentences: string[] = []

  const intro: string[] = []
  if (f.age)       intro.push(`${f.age} year old`)
  if (f.ethnicity) intro.push(humanize(f.ethnicity))
  if (f.gender)    intro.push(humanize(f.gender))
  if (intro.length) sentences.push(`A ${intro.join(" ")}.`)

  if (f.skin_tone)  sentences.push(`${she} has ${humanize(f.skin_tone).toLowerCase()} skin.`)
  if (f.face_shape) sentences.push(`${she} has a ${humanize(f.face_shape).toLowerCase()} shaped face.`)

  const faceD: string[] = []
  if (f.lips_fullness)  faceD.push(`${humanize(f.lips_fullness).toLowerCase()} lips`)
  if (f.eye_color)      faceD.push(`${humanize(f.eye_color).toLowerCase()} eyes`)
  if (f.eye_makeup && f.eye_makeup !== "no_makeup") faceD.push(`${humanize(f.eye_makeup).toLowerCase()} eye makeup`)
  if (f.skin_freckles && f.skin_freckles !== "none") faceD.push(`${humanize(f.skin_freckles).toLowerCase()} freckles`)
  if (faceD.length) sentences.push(`${she} has ${faceD.join(", ")}.`)

  if (f.height_cm) sentences.push(`${she} is ${f.height_cm} cm tall.`)

  const bodyD: string[] = []
  if (f.body_type)   bodyD.push(`${humanize(f.body_type).toLowerCase()} build`)
  if (f.bust_size)   bodyD.push(`${humanize(f.bust_size).toLowerCase()} bust`)
  if (f.waist_shape) bodyD.push(`${humanize(f.waist_shape).toLowerCase()} waist`)
  if (f.hip_width)   bodyD.push(`${humanize(f.hip_width).toLowerCase()} hips`)
  if (f.butt_shape && f.butt_shape !== "average") bodyD.push(`${humanize(f.butt_shape).toLowerCase()} butt`)
  if (f.thigh_shape && f.thigh_shape !== "average") bodyD.push(`${humanize(f.thigh_shape).toLowerCase()} thighs`)
  if (f.midriff)     bodyD.push(`${humanize(f.midriff).toLowerCase()} midriff`)
  if (bodyD.length) sentences.push(`${she} has a ${bodyD.join(", ")}.`)

  const styleMap: Record<string, string> = {
    straight: "straight hair", wavy: "wavy hair", curly: "curly hair",
    coily: "tightly coiled afro-textured hair", bald: "shaved head",
    bob: "bob cut", pixie: "pixie cut", ponytail: "hair in a ponytail",
    bun: "hair in a bun", half_up: "hair half-up half-down",
    updo: "hair in an updo", braid: "braided hair", box_braids: "box braids",
    buzz: "buzz-cut hair",
  }
  const styleDesc = f.hair_style ? (styleMap[f.hair_style] ?? `${humanize(f.hair_style).toLowerCase()} hair`) : ""
  const hairParts = [
    f.hair_color  && `${humanize(f.hair_color).toLowerCase()}-colored`,
    f.hair_length && `${humanize(f.hair_length).toLowerCase()}-length`,
    styleDesc,
  ].filter(Boolean)
  if (hairParts.length) sentences.push(`${she} has ${hairParts.join(" ")}.`)

  // suppress unused var warning
  void her
  return sentences.join(" ")
}

function humanize(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Attribute chip ───────────────────────────────────────────────────────────
function Chip({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null
  return (
    <div className="flex flex-col rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1.5">
      <span className="text-[10px] uppercase tracking-wide opacity-40 leading-none mb-0.5">{label}</span>
      <span className="text-xs font-medium capitalize leading-tight">{String(value).replace(/_/g, " ")}</span>
    </div>
  )
}

// ─── Main dialog ──────────────────────────────────────────────────────────────
export function ConfirmGenerateDialog(props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  packTitle: string
  freeCredits: number
  creditCost?: number
  attributes: Attributes | null | undefined
  referenceUrl?: string | null
  onConfirm: () => Promise<void> | void
}) {
  const { open, onOpenChange, packTitle, attributes, referenceUrl, onConfirm, freeCredits = 0, creditCost: creditCostProp } = props
  const creditCost = creditCostProp ?? 20
  const [busy, setBusy] = React.useState(false)
  const prompt = buildPrompt(attributes)

  async function handleConfirm() {
    try {
      setBusy(true)
      await onConfirm()
      gaEvent({ action: "generate_pack_confirm", category: "engagement", params: { packTitle } })
    } finally {
      setBusy(false)
      onOpenChange(false)
    }
  }

  const a = attributes

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <div className="text-base font-semibold">Ready to generate?</div>
          <div className="text-xs opacity-50 mt-0.5">
            We&apos;ll personalise <span className="font-medium text-foreground/80">{packTitle}</span> using your face photo and attributes below.
          </div>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[65vh] overflow-y-auto">

          {/* Reference photo + prompt side by side */}
          <div className="flex gap-3">
            {/* Photo */}
            <div className="shrink-0">
              <div className="text-[10px] uppercase tracking-wide opacity-40 mb-1.5">Your face</div>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted">
                {referenceUrl ? (
                  <img src={referenceUrl} alt="Reference" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 opacity-25" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>
                )}
              </div>
              {!referenceUrl && (
                <div className="text-[10px] text-amber-400 mt-1 w-20 text-center leading-tight">No photo yet</div>
              )}
            </div>

            {/* Prompt preview */}
            {prompt && (
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wide opacity-40 mb-1.5">Prompt preview</div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs font-mono leading-relaxed text-foreground/70 break-words">{prompt}</p>
                </div>
              </div>
            )}
          </div>

          {/* Attribute chips — all fields */}
          {a && (
            <div>
              <div className="text-[10px] uppercase tracking-wide opacity-40 mb-2">Your attributes</div>
              <div className="flex flex-wrap gap-2">
                <Chip label="Age"        value={a.age} />
                <Chip label="Height"     value={a.height_cm ? `${a.height_cm} cm` : undefined} />
                <Chip label="Gender"     value={a.gender} />
                <Chip label="Ethnicity"  value={a.ethnicity} />
                <Chip label="Skin tone"  value={a.skin_tone} />
                <Chip label="Face"       value={a.face_shape} />
                <Chip label="Lips"       value={a.lips_fullness} />
                <Chip label="Eyes"       value={a.eye_color} />
                <Chip label="Eye makeup" value={a.eye_makeup} />
                <Chip label="Freckles"   value={a.skin_freckles !== "none" ? a.skin_freckles : undefined} />
                <Chip label="Body"       value={a.body_type} />
                <Chip label="Bust"       value={a.bust_size} />
                <Chip label="Waist"      value={a.waist_shape} />
                <Chip label="Hips"       value={a.hip_width} />
                <Chip label="Booty"      value={a.butt_shape} />
                <Chip label="Thighs"     value={a.thigh_shape} />
                <Chip label="Midriff"    value={a.midriff} />
                <Chip label="Hair color" value={a.hair_color} />
                <Chip label="Hair length" value={a.hair_length} />
                <Chip label="Hair style" value={a.hair_style} />
              </div>
            </div>
          )}

          {/* Missing attribute warning */}
          {!a && (
            <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs text-amber-300">
              You haven&apos;t saved your attributes yet. Generation will use defaults.
              <a href="/attributes" className="ml-1 underline">Set them now →</a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3">
          <div className="text-xs opacity-50">
            {freeCredits >= creditCost
              ? <span className="text-green-400 font-medium">{freeCredits} credits (costs {creditCost})</span>
              : freeCredits > 0
                ? <span className="text-amber-400 font-medium">{freeCredits} credits — need {creditCost} to generate</span>
                : "No credits — buy a bundle to generate"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={busy} className="min-w-[160px]">
              {busy ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"/>
                  Starting…
                </span>
              ) : freeCredits >= creditCost ? `Generate (${creditCost} credits)` : "Continue to payment"}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}
