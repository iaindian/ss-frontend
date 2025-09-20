'use client'
import * as React from 'react'
import { logger } from '@/lib/logger'
import type {
  Attributes, Ethnicity, FaceShape, LipsFullness, SkinTone, SkinFreckles,
  HairLength, HairStyle, HairColor, BodyType,Gender
} from '@/lib/types'

const ETHNICITY: Ethnicity[] = ['asian','black','latino','middle_eastern','south_asian','white','mixed','other']
const FACE_SHAPE: FaceShape[] = ['oval','round','square','heart','diamond','oblong']
const LIPS: LipsFullness[] = ['thin','medium','full']
const SKIN_TONE: SkinTone[] = ['fair','light','medium','tan','brown','dark']
const FRECKLES: SkinFreckles[] = ['none','light','moderate','heavy']
const HAIR_LENGTH: HairLength[] = ['buzz','short','medium','long','very_long']
const HAIR_STYLE: HairStyle[] = ['straight','wavy','curly','coily','bald','updo','ponytail']
const HAIR_COLOR: HairColor[] = ['black','brown','blonde','red','auburn','gray','white','colored']
const BODY_TYPE: BodyType[] = ['slim','average','athletic','curvy','muscular','plus_size']
const GENDER: Gender[] = ['female','male','non_binary']

export function AttributesForm({
  initial,
  onSave,
}: {
  initial?: Attributes
  onSave: (payload: Attributes) => Promise<void> | void
}) {
  const [form, setForm] = React.useState<Attributes>(() => ({
    age: initial?.age ?? undefined,
    ethnicity: initial?.ethnicity,
    face_shape: initial?.face_shape,
    lips_fullness: initial?.lips_fullness,
    skin_tone: initial?.skin_tone,
    skin_freckles: initial?.skin_freckles,
    hair_length: initial?.hair_length,
    hair_style: initial?.hair_style,
    hair_color: initial?.hair_color,
    body_type: initial?.body_type,
    height_cm: initial?.height_cm ?? undefined,
    gender: initial?.gender,
  }))
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setForm({
      age: initial?.age ?? undefined,
      ethnicity: initial?.ethnicity,
      face_shape: initial?.face_shape,
      lips_fullness: initial?.lips_fullness,
      skin_tone: initial?.skin_tone,
      skin_freckles: initial?.skin_freckles,
      hair_length: initial?.hair_length,
      hair_style: initial?.hair_style,
      hair_color: initial?.hair_color,
      body_type: initial?.body_type,
      height_cm: initial?.height_cm ?? undefined,
      gender: initial?.gender, 
    })
  }, [JSON.stringify(initial ?? {})])

  function set<K extends keyof Attributes>(key: K, val: Attributes[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function toNumberOrUndef(v: string): number | undefined {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : undefined
  }

  function validate(): string | null {
    // Required: age & height for your rule (tweak if needed)
    if (!form.age) return 'Please enter your age.'
    if (!form.height_cm) return 'Please enter your height in cm.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setSubmitting(true); setError(null)
    try {
      const payload: Attributes = { ...form }
      logger.info('attributes.submit', payload)
      await onSave(payload)
    } catch (e: any) {
      logger.error('attributes.submit.error', { error: e?.message })
      setError(e?.message || 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InfoCallout />
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Age (number) */}
        <Field label="Age" required>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={form.age ?? ''}
            onChange={e => set('age', toNumberOrUndef(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2"
            placeholder="e.g., 28"
          />
        </Field>

        {/* Height (number, cm) */}
        <Field label="Height (cm)" required>
          <input
            type="number"
            inputMode="numeric"
            min={100}
            max={230}
            value={form.height_cm ?? ''}
            onChange={e => set('height_cm', toNumberOrUndef(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-3 py-2"
            placeholder="e.g., 175"
          />
        </Field>

        {/* Dropdowns */}
        <SelectField label="Ethnicity" value={form.ethnicity} onChange={v => set('ethnicity', v as any)} options={ETHNICITY} />
        <SelectField label="Face shape" value={form.face_shape} onChange={v => set('face_shape', v as any)} options={FACE_SHAPE} />
        <SelectField label="Lips fullness" value={form.lips_fullness} onChange={v => set('lips_fullness', v as any)} options={LIPS} />
        <SelectField label="Skin tone" value={form.skin_tone} onChange={v => set('skin_tone', v as any)} options={SKIN_TONE} />
        <SelectField label="Skin freckles" value={form.skin_freckles} onChange={v => set('skin_freckles', v as any)} options={FRECKLES} />
        <SelectField label="Hair length" value={form.hair_length} onChange={v => set('hair_length', v as any)} options={HAIR_LENGTH} />
        <SelectField label="Hair style" value={form.hair_style} onChange={v => set('hair_style', v as any)} options={HAIR_STYLE} />
        <SelectField label="Hair color" value={form.hair_color} onChange={v => set('hair_color', v as any)} options={HAIR_COLOR} />
        <SelectField label="Body type" value={form.body_type} onChange={v => set('body_type', v as any)} options={BODY_TYPE} />
        <SelectField label="Gender" value={form.gender} onChange={(v) => set('gender', v as any)} options={GENDER}
/>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <span className="text-xs opacity-70 self-center">You can update these anytime.</span>
      </div>
    </form>
  )
}

/* ---------- small presentational helpers ---------- */

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 opacity-80">
        {label} {required && <span className="text-red-400">*</span>}
      </div>
      {children}
    </label>
  )
}

function SelectField<T extends string>({
  label, value, onChange, options, required
}: {
  label: string
  value?: T
  onChange: (v: T) => void
  options: readonly T[]
  required?: boolean
}) {
  return (
    <Field label={label} required={required}>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-md border border-border bg-background px-3 py-2"
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{humanize(opt)}</option>
        ))}
      </select>
    </Field>
  )
}

function humanize(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function InfoCallout() {
  return (
    <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm">
      <div className="font-medium">Why we ask this</div>
      <div className="opacity-80">
        These attributes are used in the generation prompts to better match your likeness.
        Please fill them accurately before generating a pack.
      </div>
    </div>
  )
}
