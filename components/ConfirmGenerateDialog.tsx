'use client'
import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Attrs = Record<string, any> | null | undefined

function AttrRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="text-sm text-right max-w-[60%]">{String(value)}</div>
    </div>
  )
}

export function ConfirmGenerateDialog(props: {
  open: boolean
  onOpenChange: (v: boolean) => void
  packTitle: string
  attributes: Attrs
  referenceUrl?: string | null
  onConfirm: () => Promise<void> | void
}) {
  const { open, onOpenChange, packTitle, attributes, referenceUrl, onConfirm } = props
  const [busy, setBusy] = React.useState(false)

  const handleConfirm = async () => {
    try {
      setBusy(true)
      await onConfirm()
    } finally {
      setBusy(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm generation</DialogTitle>
          <DialogDescription>
            We’ll use your reference face and the attributes below to personalize <span className="font-medium">{packTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-[128px,1fr]">
          {/* Reference preview */}
          <div className="relative aspect-square w-32 overflow-hidden rounded-xl border border-border bg-muted">
            {referenceUrl ? (
              <img src={referenceUrl} alt="Reference" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-foreground/60">
                No reference
              </div>
            )}
          </div>

          {/* Attributes */}
          <div className="rounded-xl border border-border/60 p-3">
            <div className="text-xs font-medium mb-2">Your attributes</div>
            <div className="divide-y divide-border/60">
              <AttrRow label="Age" value={attributes?.age} />
              <AttrRow label="Height (cm)" value={attributes?.height_cm} />
              <AttrRow label="Gender" value={attributes?.gender} />
              <AttrRow label="Ethnicity" value={attributes?.ethnicity} />
              <AttrRow label="Face shape" value={attributes?.face_shape} />
              <AttrRow label="Lips" value={attributes?.lips_fullness} />
              <AttrRow label="Skin tone" value={attributes?.skin_tone} />
              <AttrRow label="Freckles" value={attributes?.skin_freckles} />
              <AttrRow label="Hair length" value={attributes?.hair_length} />
              <AttrRow label="Hair style" value={attributes?.hair_style} />
              <AttrRow label="Hair color" value={attributes?.hair_color} />
              <AttrRow label="Body type" value={attributes?.body_type} />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={busy}>
            {busy ? 'Starting…' : 'Continue to payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
