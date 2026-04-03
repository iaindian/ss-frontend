'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { AttributePreviewAvatar } from '@/components/AttributePreviewAvatar'
import type {
  Attributes, Ethnicity, FaceShape, LipsFullness, SkinTone, SkinFreckles,
  HairLength, HairStyle, HairColor, BodyType, Gender,
  BustSize, WaistShape, HipWidth, ButtShape, ThighShape, Midriff,
} from '@/lib/types'

// ─── Option tables ────────────────────────────────────────────────────────────

const GENDER: { value: Gender; label: string }[] = [
  { value: 'female',     label: 'Female'     },
  { value: 'male',       label: 'Male'       },
  { value: 'non_binary', label: 'Non-binary' },
]

const BODY_PRESETS: { value: BodyType; label: string; desc: string;
  bust?: BustSize; waist?: WaistShape; hip?: HipWidth; butt?: ButtShape; thigh?: ThighShape; midriff?: Midriff }[] = [
  { value: 'slim',           label: 'Slim',           desc: 'Lean & slender',
    bust:'small',   waist:'narrow',      hip:'narrow',    butt:'flat',        thigh:'slim'      },
  { value: 'petite',         label: 'Petite',         desc: 'Small frame',
    bust:'petite',  waist:'narrow',      hip:'narrow',    butt:'average',     thigh:'slim'      },
  { value: 'lean_athletic',  label: 'Lean Athletic',  desc: 'Toned & lean',
    bust:'small',   waist:'average',     hip:'average',   butt:'round',       thigh:'average', midriff:'toned'    },
  { value: 'athletic',       label: 'Athletic',       desc: 'Sporty build',
    bust:'medium',  waist:'average',     hip:'average',   butt:'round',       thigh:'average', midriff:'defined'  },
  { value: 'rectangle',      label: 'Rectangle',      desc: 'Straight figure',
    bust:'medium',  waist:'wide',        hip:'average',   butt:'average',     thigh:'average'   },
  { value: 'curvy',          label: 'Curvy',          desc: 'Classic curves',
    bust:'large',   waist:'narrow',      hip:'wide',      butt:'bubble',      thigh:'thick'     },
  { value: 'hourglass',      label: 'Hourglass',      desc: 'Defined waist',
    bust:'large',   waist:'very_narrow', hip:'wide',      butt:'bubble',      thigh:'thick'     },
  { value: 'full_hourglass', label: 'Full Hourglass', desc: 'Dramatic curves',
    bust:'very_large', waist:'very_narrow', hip:'very_wide', butt:'large_bubble', thigh:'very_thick' },
  { value: 'pear',           label: 'Pear',           desc: 'Fuller hips & thighs',
    bust:'small',   waist:'narrow',      hip:'very_wide', butt:'large_bubble', thigh:'very_thick' },
  { value: 'busty',          label: 'Busty',          desc: 'Larger bust',
    bust:'very_large', waist:'average',  hip:'wide',      butt:'round',       thigh:'thick'     },
  { value: 'apple',          label: 'Apple',          desc: 'Fuller upper body',
    bust:'large',   waist:'wide',        hip:'average',   butt:'average',     thigh:'average', midriff:'soft'     },
  { value: 'thick',          label: 'Thick',          desc: 'Full & proportional',
    bust:'large',   waist:'average',     hip:'wide',      butt:'bubble',      thigh:'very_thick' },
  { value: 'plus_size',      label: 'Plus Size',      desc: 'Full figure',
    bust:'very_large', waist:'wide',     hip:'very_wide', butt:'large_bubble', thigh:'very_thick', midriff:'soft' },
  { value: 'muscular',       label: 'Muscular',       desc: 'Defined muscles',
    bust:'medium',  waist:'narrow',      hip:'average',   butt:'round',       thigh:'thick', midriff:'defined'    },
]

const BUST_OPTS:   { value: BustSize;   label: string }[] = [
  { value:'petite',     label:'Petite'     },
  { value:'small',      label:'Small'      },
  { value:'medium',     label:'Medium'     },
  { value:'large',      label:'Large'      },
  { value:'very_large', label:'Very Large' },
]
const WAIST_OPTS:  { value: WaistShape;  label: string }[] = [
  { value:'very_narrow', label:'Very Narrow' },
  { value:'narrow',      label:'Narrow'      },
  { value:'average',     label:'Average'     },
  { value:'wide',        label:'Wide'        },
]
const HIP_OPTS:    { value: HipWidth;    label: string }[] = [
  { value:'narrow',    label:'Narrow'    },
  { value:'average',   label:'Average'   },
  { value:'wide',      label:'Wide'      },
  { value:'very_wide', label:'Very Wide' },
]
const BUTT_OPTS:   { value: ButtShape;   label: string; desc: string }[] = [
  { value:'flat',         label:'Flat',         desc:'Minimal projection' },
  { value:'average',      label:'Average',      desc:'Moderate shape'     },
  { value:'round',        label:'Round',        desc:'Rounded lift'       },
  { value:'bubble',       label:'Bubble',       desc:'High & projected'   },
  { value:'large_bubble', label:'Large Bubble', desc:'Max volume & lift'  },
]
const THIGH_OPTS:  { value: ThighShape;  label: string }[] = [
  { value:'slim',       label:'Slim'       },
  { value:'average',    label:'Average'    },
  { value:'thick',      label:'Thick'      },
  { value:'very_thick', label:'Very Thick' },
]
const MIDRIFF_OPTS: { value: Midriff; label: string }[] = [
  { value:'toned',   label:'Toned'   },
  { value:'soft',    label:'Soft'    },
  { value:'defined', label:'Defined' },
]

const SKIN_TONES: { value: SkinTone; label: string; hex: string }[] = [
  { value:'porcelain',  label:'Porcelain',   hex:'#FFF0E2' },
  { value:'ivory',      label:'Ivory',       hex:'#FAE2CC' },
  { value:'fair',       label:'Fair',        hex:'#F5D0B2' },
  { value:'light_beige',label:'Light Beige', hex:'#EEC49A' },
  { value:'peach',      label:'Peach',       hex:'#E8A878' },
  { value:'medium',     label:'Medium',      hex:'#C8845A' },
  { value:'olive',      label:'Olive',       hex:'#B07040' },
  { value:'tan',        label:'Tan',         hex:'#9A6030' },
  { value:'caramel',    label:'Caramel',     hex:'#7E4820' },
  { value:'brown',      label:'Brown',       hex:'#6B3818' },
  { value:'mahogany',   label:'Mahogany',    hex:'#4E2410' },
  { value:'dark',       label:'Dark',        hex:'#36180A' },
  { value:'ebony',      label:'Ebony',       hex:'#221004' },
]
const HAIR_COLORS: { value: HairColor; hex: string }[] = [
  { value:'black',   hex:'#1a1a1a' }, { value:'brown',   hex:'#6B3F1E' },
  { value:'blonde',  hex:'#D4A843' }, { value:'red',     hex:'#A52A2A' },
  { value:'auburn',  hex:'#7B2800' }, { value:'gray',    hex:'#888888' },
  { value:'white',   hex:'#E8E8E8' }, { value:'colored', hex:'#7B2FBE' },
  { value:'green',   hex:'#1B6B2F' }, { value:'pink',    hex:'#E8407A' },
  { value:'purple',  hex:'#6A1B9A' },
]
const HAIR_LENGTHS: { value: HairLength; label: string }[] = [
  { value:'buzz', label:'Buzz' }, { value:'short', label:'Short' },
  { value:'medium', label:'Medium' }, { value:'long', label:'Long' },
  { value:'very_long', label:'Very Long' },
]
const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value:'bald', label:'Bald' }, { value:'straight', label:'Straight' },
  { value:'wavy', label:'Wavy' }, { value:'curly', label:'Curly' },
  { value:'coily', label:'Coily / Afro' }, { value:'bob', label:'Bob' },
  { value:'pixie', label:'Pixie' }, { value:'ponytail', label:'Ponytail' },
  { value:'bun', label:'Bun' }, { value:'half_up', label:'Half-Up' },
  { value:'updo', label:'Updo' }, { value:'braid', label:'Braid' },
  { value:'box_braids', label:'Box Braids' },
]
const EYE_COLORS: { value: string; label: string; hex: string }[] = [
  { value:'brown',      label:'Brown',      hex:'#7B4A1E' },
  { value:'dark_brown', label:'Dark Brown', hex:'#3D1F08' },
  { value:'hazel',      label:'Hazel',      hex:'#8B6914' },
  { value:'green',      label:'Green',      hex:'#2E6B2E' },
  { value:'blue',       label:'Blue',       hex:'#2B6CB0' },
  { value:'gray',       label:'Gray',       hex:'#6B7280' },
  { value:'amber',      label:'Amber',      hex:'#B8620A' },
  { value:'black',      label:'Black',      hex:'#111111' },
]
const EYE_MAKEUP_OPTS: { value: string; label: string }[] = [
  { value:'no_makeup',   label:'No Makeup'   },
  { value:'natural',     label:'Natural'     },
  { value:'cat_eye',     label:'Cat Eye'     },
  { value:'smoky',       label:'Smoky'       },
  { value:'bold_lashes', label:'Bold Lashes' },
  { value:'glam',        label:'Full Glam'   },
]

const ETHNICITIES: Ethnicity[] = [
  'asian','black','latino','white','mixed','Indian','Korean','Chinese','Russian','middle_eastern','south_asian','other',
]
const FACE_SHAPES: FaceShape[] = ['oval','round','square','heart','diamond','oblong']
const LIPS: LipsFullness[]     = ['thin','medium','full']
const FRECKLES: SkinFreckles[] = ['none','light','moderate','heavy']

// ─── Prompt preview builder ───────────────────────────────────────────────────
function buildPromptSnippet(f: Attributes): string {
  if (!f.age && !f.gender && !f.ethnicity) return 'Fill in attributes to see prompt preview…'

  const she = f.gender === 'male' ? 'He' : f.gender === 'non_binary' ? 'They' : 'She'
  const her  = f.gender === 'male' ? 'his' : f.gender === 'non_binary' ? 'their' : 'her'

  const sentences: string[] = []

  // Opening line
  const intro: string[] = []
  if (f.age)      intro.push(`${f.age} year old`)
  if (f.ethnicity) intro.push(humanize(f.ethnicity))
  if (f.gender)   intro.push(humanize(f.gender))
  if (intro.length) sentences.push(`A ${intro.join(' ')}.`)

  // Physical look — each detail as its own readable clause
  if (f.skin_tone)    sentences.push(`${she} has ${humanize(f.skin_tone).toLowerCase()} skin.`)
  if (f.face_shape)   sentences.push(`${she} has a ${humanize(f.face_shape).toLowerCase()} shaped face.`)

  const faceDetails: string[] = []
  if (f.lips_fullness) faceDetails.push(`${humanize(f.lips_fullness).toLowerCase()} lips`)
  if (f.eye_color)     faceDetails.push(`${humanize(f.eye_color).toLowerCase()} eyes`)
  if (f.eye_makeup && f.eye_makeup !== 'no_makeup') faceDetails.push(`${humanize(f.eye_makeup).toLowerCase()} eye makeup`)
  if (f.skin_freckles && f.skin_freckles !== 'none') faceDetails.push(`${humanize(f.skin_freckles).toLowerCase()} freckles`)
  if (faceDetails.length) sentences.push(`${she} has ${faceDetails.join(', ')}.`)

  // Body
  if (f.height_cm) sentences.push(`${she} is ${f.height_cm} cm tall.`)

  const bodyShape: string[] = []
  if (f.body_type)   bodyShape.push(`${humanize(f.body_type).toLowerCase()} build`)
  if (f.bust_size)   bodyShape.push(`${humanize(f.bust_size).toLowerCase()} bust`)
  if (f.waist_shape) bodyShape.push(`${humanize(f.waist_shape).toLowerCase()} waist`)
  if (f.hip_width)   bodyShape.push(`${humanize(f.hip_width).toLowerCase()} hips`)
  if (f.butt_shape && f.butt_shape !== 'average') bodyShape.push(`${humanize(f.butt_shape).toLowerCase()} butt`)
  if (f.thigh_shape && f.thigh_shape !== 'average') bodyShape.push(`${humanize(f.thigh_shape).toLowerCase()} thighs`)
  if (f.midriff)     bodyShape.push(`${humanize(f.midriff).toLowerCase()} midriff`)
  if (bodyShape.length) sentences.push(`${she} has a ${bodyShape.join(', ')}.`)

  // Hair — one clear descriptive sentence
  const hairColor  = f.hair_color  ? humanize(f.hair_color).toLowerCase()  : ''
  const hairLen    = f.hair_length  ? humanize(f.hair_length).toLowerCase() : ''
  const styleDescMap: Record<string, string> = {
    straight: 'straight hair', wavy: 'wavy hair', curly: 'curly hair',
    coily: 'tightly coiled afro-textured hair', bald: 'shaved head',
    bob: 'bob cut', pixie: 'pixie cut', ponytail: 'hair in a ponytail',
    bun: 'hair in a bun', half_up: 'hair half-up half-down',
    updo: 'hair in an updo', braid: 'braided hair', box_braids: 'box braids',
    buzz: 'buzz-cut hair',
  }
  const hairStyleDesc = f.hair_style ? (styleDescMap[f.hair_style] ?? `${humanize(f.hair_style).toLowerCase()} hair`) : ''
  const hairParts = [hairColor && `${hairColor}-colored`, hairLen && `${hairLen}-length`, hairStyleDesc].filter(Boolean)
  if (hairParts.length) sentences.push(`${she} has ${hairParts.join(' ')}.`)

  return sentences.join(' ')
}

// ─── Chip components ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider opacity-40">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function Chip({ label, selected, onClick, desc }: { label:string; selected:boolean; onClick:()=>void; desc?:string }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2 text-left text-sm transition-all',
        selected ? 'border-primary bg-primary/15 text-primary ring-1 ring-primary/30'
                 : 'border-border bg-background/60 hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <div className="font-medium leading-tight">{label}</div>
      {desc && <div className="mt-0.5 text-[11px] leading-tight opacity-50">{desc}</div>}
    </button>
  )
}

function Pill({ label, selected, onClick }: { label:string; selected:boolean; onClick:()=>void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-all',
        selected ? 'border-primary bg-primary text-black font-medium'
                 : 'border-border hover:border-primary/50 hover:bg-primary/5',
      )}
    >{label}</button>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] opacity-60">
      {children}
    </span>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function AttributesForm({ initial, onSave }: {
  initial?: Attributes
  onSave: (payload: Attributes) => Promise<void> | void
}) {
  const [form, setForm] = React.useState<Attributes>(() => initial ?? {})
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => { setForm(initial ?? {}) }, [JSON.stringify(initial ?? {})])

  function set<K extends keyof Attributes>(key: K, val: Attributes[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }
  function toggle<K extends keyof Attributes>(key: K, val: Attributes[K]) {
    setForm(prev => ({ ...prev, [key]: prev[key] === val ? undefined : val }))
  }
  function toNum(v: string): number | undefined {
    const n = Number(v); return Number.isFinite(n) && n > 0 ? n : undefined
  }

  // Picking a body preset auto-fills all sub-attributes
  function applyPreset(bt: BodyType) {
    const p = BODY_PRESETS.find(x => x.value === bt)
    if (!p) { toggle('body_type', bt); return }
    setForm(prev => ({
      ...prev,
      body_type:   prev.body_type === bt ? undefined : bt,
      bust_size:   prev.body_type === bt ? prev.bust_size   : (p.bust   || prev.bust_size),
      waist_shape: prev.body_type === bt ? prev.waist_shape : (p.waist  || prev.waist_shape),
      hip_width:   prev.body_type === bt ? prev.hip_width   : (p.hip    || prev.hip_width),
      butt_shape:  prev.body_type === bt ? prev.butt_shape  : (p.butt   || prev.butt_shape),
      thigh_shape: prev.body_type === bt ? prev.thigh_shape : (p.thigh  || prev.thigh_shape),
      midriff:     prev.body_type === bt ? prev.midriff     : (p.midriff || prev.midriff),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.age)        { setError('Please enter your age.');         return }
    if (!form.height_cm)  { setError('Please enter your height.');      return }
    if (!form.skin_tone)  { setError('Please select your skin tone.');   return }
    if (!form.hair_style) { setError('Please select your hair style.');  return }
    setSubmitting(true); setError(null)
    try {
      logger.info('attributes.submit', form)
      await onSave({ ...form })
    } catch (e: any) {
      logger.error('attributes.submit.error', { error: e?.message })
      setError(e?.message || 'Failed to save')
    } finally { setSubmitting(false) }
  }

  const promptSnippet = buildPromptSnippet(form)

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 rounded-xl border border-blue-400/20 bg-blue-500/8 p-3 text-sm">
        <div className="font-medium">Why we ask this</div>
        <div className="opacity-60 text-xs mt-0.5">
          These attributes are embedded directly into your AI generation prompts to match your exact look.
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-6">

        {/* ── Left: fields ── */}
        <div className="space-y-7 lg:col-span-3">

          {/* Basics */}
          <div>
            <SectionLabel>Basics</SectionLabel>
            <div className="mb-4 flex flex-wrap gap-2">
              {GENDER.map(g => (
                <Pill key={g.value} label={g.label} selected={form.gender===g.value}
                  onClick={() => toggle('gender', g.value)} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <div className="mb-1 opacity-60">Age <span className="text-red-400">*</span></div>
                <input type="number" inputMode="numeric" min={1} max={120}
                  value={form.age ?? ''} onChange={e => set('age', toNum(e.target.value))}
                  placeholder="e.g. 26"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </label>
              <label className="block text-sm">
                <div className="mb-1 opacity-60">Height (cm) <span className="text-red-400">*</span></div>
                <input type="number" inputMode="numeric" min={100} max={230}
                  value={form.height_cm ?? ''} onChange={e => set('height_cm', toNum(e.target.value))}
                  placeholder="e.g. 165"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </label>
            </div>
          </div>

          {/* Body Type presets */}
          <div>
            <SectionLabel>Body Type — Quick Preset</SectionLabel>
            <p className="mb-3 text-xs opacity-50">Selecting a preset auto-fills the detail sliders below. You can fine-tune after.</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BODY_PRESETS.map(bt => (
                <Chip key={bt.value} label={bt.label} desc={bt.desc}
                  selected={form.body_type===bt.value} onClick={() => applyPreset(bt.value)} />
              ))}
            </div>
          </div>

          {/* Body Detail sub-attributes */}
          <div>
            <SectionLabel>Body Details — Fine Tune</SectionLabel>
            <div className="space-y-4">

              <div>
                <div className="mb-2 text-xs opacity-55">Bust</div>
                <div className="flex flex-wrap gap-2">
                  {BUST_OPTS.map(o => (
                    <Pill key={o.value} label={o.label} selected={form.bust_size===o.value}
                      onClick={() => toggle('bust_size', o.value)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs opacity-55">Waist</div>
                <div className="flex flex-wrap gap-2">
                  {WAIST_OPTS.map(o => (
                    <Pill key={o.value} label={o.label} selected={form.waist_shape===o.value}
                      onClick={() => toggle('waist_shape', o.value)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs opacity-55">Hips</div>
                <div className="flex flex-wrap gap-2">
                  {HIP_OPTS.map(o => (
                    <Pill key={o.value} label={o.label} selected={form.hip_width===o.value}
                      onClick={() => toggle('hip_width', o.value)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs opacity-55">Booty</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BUTT_OPTS.map(o => (
                    <Chip key={o.value} label={o.label} desc={o.desc}
                      selected={form.butt_shape===o.value} onClick={() => toggle('butt_shape', o.value)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs opacity-55">Thighs</div>
                <div className="flex flex-wrap gap-2">
                  {THIGH_OPTS.map(o => (
                    <Pill key={o.value} label={o.label} selected={form.thigh_shape===o.value}
                      onClick={() => toggle('thigh_shape', o.value)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs opacity-55">Midriff</div>
                <div className="flex flex-wrap gap-2">
                  {MIDRIFF_OPTS.map(o => (
                    <Pill key={o.value} label={o.label} selected={form.midriff===o.value}
                      onClick={() => toggle('midriff', o.value)} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Skin & Face */}
          <div>
            <SectionLabel>Skin &amp; Face</SectionLabel>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Skin tone <span className="text-red-400">*</span></div>
              <div className="flex flex-wrap gap-3">
                {SKIN_TONES.map(st => (
                  <button key={st.value} type="button" onClick={() => toggle('skin_tone', st.value)}
                    className={cn('flex flex-col items-center gap-1 rounded-lg p-1 transition-all',
                      form.skin_tone===st.value && 'ring-2 ring-primary ring-offset-1 ring-offset-background')}>
                    <div className="h-8 w-8 rounded-full border border-white/15 shadow" style={{background:st.hex}} />
                    <span className="text-[10px] opacity-55">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Ethnicity</div>
              <div className="flex flex-wrap gap-2">
                {ETHNICITIES.map(e => (
                  <Pill key={e} label={humanize(e)} selected={form.ethnicity===e}
                    onClick={() => toggle('ethnicity', e)} />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Face shape</div>
              <div className="flex flex-wrap gap-2">
                {FACE_SHAPES.map(f => (
                  <Pill key={f} label={humanize(f)} selected={form.face_shape===f}
                    onClick={() => toggle('face_shape', f)} />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Eye color</div>
              <div className="flex flex-wrap gap-3">
                {EYE_COLORS.map(ec => (
                  <button key={ec.value} type="button" onClick={() => toggle('eye_color', ec.value as any)}
                    title={ec.label}
                    className={cn('flex flex-col items-center gap-1 rounded-lg p-1 transition-all',
                      form.eye_color===ec.value && 'ring-2 ring-primary ring-offset-1 ring-offset-background')}>
                    <div className="h-7 w-7 rounded-full border border-white/15 shadow" style={{background:ec.hex}}/>
                    <span className="text-[10px] opacity-55">{ec.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Eye makeup</div>
              <div className="flex flex-wrap gap-2">
                {EYE_MAKEUP_OPTS.map(o => (
                  <Pill key={o.value} label={o.label} selected={form.eye_makeup===o.value as any}
                    onClick={() => toggle('eye_makeup', o.value as any)} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-xs opacity-55">Lips</div>
                <div className="flex flex-wrap gap-2">
                  {LIPS.map(l => <Pill key={l} label={humanize(l)} selected={form.lips_fullness===l} onClick={() => toggle('lips_fullness', l)} />)}
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs opacity-55">Freckles</div>
                <div className="flex flex-wrap gap-2">
                  {FRECKLES.map(f => <Pill key={f} label={humanize(f)} selected={form.skin_freckles===f} onClick={() => toggle('skin_freckles', f)} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Hair */}
          <div>
            <SectionLabel>Hair</SectionLabel>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Length</div>
              <div className="flex flex-wrap gap-2">
                {HAIR_LENGTHS.map(h => <Pill key={h.value} label={h.label} selected={form.hair_length===h.value} onClick={() => toggle('hair_length', h.value)} />)}
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-2 text-xs opacity-55">Style <span className="text-red-400">*</span></div>
              <div className="flex flex-wrap gap-2">
                {HAIR_STYLES.map(h => <Pill key={h.value} label={h.label} selected={form.hair_style===h.value} onClick={() => toggle('hair_style', h.value)} />)}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs opacity-55">Color</div>
              <div className="flex flex-wrap gap-3">
                {HAIR_COLORS.map(hc => (
                  <button key={hc.value} type="button" onClick={() => toggle('hair_color', hc.value)}
                    title={humanize(hc.value)}
                    className={cn('flex flex-col items-center gap-1 rounded-lg p-1 transition-all',
                      form.hair_color===hc.value && 'ring-2 ring-primary ring-offset-1 ring-offset-background')}>
                    <div className="h-7 w-7 rounded-full border border-white/15 shadow" style={{background:hc.hex}} />
                    <span className="text-[10px] opacity-55">{humanize(hc.value)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt preview */}
          <div>
            <SectionLabel>Prompt Preview</SectionLabel>
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-40">
                Injected into your generation prompt
              </div>
              <p className="font-mono text-xs leading-relaxed text-foreground/75 break-words">
                {promptSnippet}
              </p>
            </div>
          </div>

          {/* Error + submit */}
          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-300">{error}</div>
          )}
          <div className="flex items-center gap-3 pb-6">
            <button type="submit" disabled={submitting}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60">
              {submitting ? 'Saving…' : 'Save Attributes'}
            </button>
            <span className="text-xs opacity-40">You can update these anytime.</span>
          </div>
        </div>

        {/* ── Right: sticky avatar (desktop) ── */}
        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-6 rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-35">Live Preview</div>
            <AttributePreviewAvatar attrs={form} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {form.body_type   && <Tag>{humanize(form.body_type)}</Tag>}
              {form.bust_size   && <Tag>{humanize(form.bust_size)} bust</Tag>}
              {form.butt_shape  && <Tag>{humanize(form.butt_shape)} butt</Tag>}
              {form.thigh_shape && <Tag>{humanize(form.thigh_shape)} thighs</Tag>}
              {form.hair_style  && <Tag>{humanize(form.hair_style)}</Tag>}
              {form.skin_tone   && <Tag>{humanize(form.skin_tone)} skin</Tag>}
              {form.height_cm   && <Tag>{form.height_cm} cm</Tag>}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile avatar */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 lg:hidden">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-35">Live Preview</div>
        <div className="mx-auto max-w-[180px]">
          <AttributePreviewAvatar attrs={form} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {form.body_type  && <Tag>{humanize(form.body_type)}</Tag>}
          {form.bust_size  && <Tag>{humanize(form.bust_size)} bust</Tag>}
          {form.butt_shape && <Tag>{humanize(form.butt_shape)} butt</Tag>}
          {form.skin_tone  && <Tag>{humanize(form.skin_tone)}</Tag>}
        </div>
      </div>
    </form>
  )
}

function humanize(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
