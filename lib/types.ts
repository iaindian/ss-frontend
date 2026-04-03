// export type Pack = {
//   id: string
//   slug: string
//   title: string
//   category: 'general' | 'premium' | 'festival'
//   price_cents: number
//   currency: string
//   preview_images: string[]
//   description?: string
//   active: boolean
// }

export type Job = {
  id: string
  pack_id: string
  pack_title?: string
  status: 'awaiting_payment' | 'queued' | 'processing' | 'ready' | 'failed'
  receipt_url?: string
  download_url?: string
  created_at?: string
  completed_at?: string | null
}

export type Me = {
  id: string
  email: string
  free_credits: number
  reference_image_url?: string | null
}

export type Gender = 'female' | 'male' | 'non_binary'

export type Attributes = {
  age?: number
  ethnicity?: Ethnicity
  face_shape?: FaceShape
  lips_fullness?: LipsFullness
  skin_tone?: SkinTone
  skin_freckles?: SkinFreckles
  hair_length?: HairLength
  hair_style?: HairStyle
  hair_color?: HairColor
  body_type?: BodyType
  height_cm?: number
  gender?: Gender
  // body detail sub-attributes
  bust_size?: BustSize
  waist_shape?: WaistShape
  hip_width?: HipWidth
  butt_shape?: ButtShape
  thigh_shape?: ThighShape
  midriff?: Midriff
  // eyes
  eye_color?: EyeColor
  eye_makeup?: EyeMakeup
}

export type AttributesResponse = {
  tenant_id: string
  attributes: Attributes | null
}

// Enums (string unions) – tweak lists as you like:
export type Ethnicity =
  | 'asian' | 'black' | 'latino' | 'middle_eastern' | 'south_asian'
  | 'white' | 'mixed' | 'other' | 'Russian' | 'Indian' | 'Chinese' | 'Korean'

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'
export type LipsFullness = 'thin' | 'medium' | 'full'
export type SkinTone =
  | 'porcelain' | 'ivory' | 'fair' | 'light_beige' | 'peach'
  | 'medium' | 'olive' | 'tan' | 'caramel' | 'brown' | 'mahogany' | 'dark' | 'ebony'
export type SkinFreckles = 'none' | 'light' | 'moderate' | 'heavy'
export type HairLength = 'buzz' | 'short' | 'medium' | 'long' | 'very_long'
export type HairStyle =
  | 'straight' | 'wavy' | 'curly' | 'coily'
  | 'bob' | 'pixie' | 'bun' | 'ponytail'
  | 'braid' | 'box_braids' | 'updo' | 'half_up'
  | 'bald'
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'auburn' | 'gray' | 'white' | 'colored' | 'green' | 'pink' | 'purple'
export type BodyType =
  | 'slim' | 'petite' | 'lean_athletic' | 'athletic'
  | 'curvy' | 'hourglass' | 'full_hourglass'
  | 'pear' | 'apple' | 'thick' | 'plus_size'
  | 'muscular' | 'rectangle' | 'busty'
  // legacy
  | 'average' | 'hour glass'

export type BustSize    = 'petite' | 'small' | 'medium' | 'large' | 'very_large'
export type WaistShape  = 'very_narrow' | 'narrow' | 'average' | 'wide'
export type HipWidth    = 'narrow' | 'average' | 'wide' | 'very_wide'
export type ButtShape   = 'flat' | 'average' | 'round' | 'bubble' | 'large_bubble'
export type ThighShape  = 'slim' | 'average' | 'thick' | 'very_thick'
export type Midriff     = 'toned' | 'soft' | 'defined'
export type EyeColor    = 'brown' | 'dark_brown' | 'hazel' | 'green' | 'blue' | 'gray' | 'amber' | 'black'
export type EyeMakeup   = 'natural' | 'cat_eye' | 'smoky' | 'bold_lashes' | 'no_makeup' | 'glam'

export type ApiError = {
  message: string
  code?: string
  details?: any
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'queued'
  | 'processing'
  | 'ready'
  | 'failed'


export type Order = {
  id: string
  pack_id: string
  pack_title?: string
  status: OrderStatus
  download_url?: string
  receipt_url?: string
  created_at?: string
}

export type Pack = {
  id: string
  slug: string
  title: string
  description?: string | null
  category: string
  price_cents: number
  currency: string
  preview_images: string[]
  active: boolean

  usage_count?: number
  expires_at?: string | null
  tag1?: string | null
  tag2?: string | null
  tag3?: string | null
  featured_weight?: number
  workflow?: string | null
  published_at?: string
  credit_cost?: number | null  // null = use global default (20)
}

export type Paginated<T> = { items: T[]; next_cursor?: string | null }
export type Section = { slug: string; name: string; type: 'latest'|'featured'|'trending'|'tags'; tags?: string[] }

export type CreditBundle = {
  id: string
  credits: number
  price_cents: number
  currency: string
  label: string        // e.g. "Starter"
  badge?: string       // e.g. "Best value"
}