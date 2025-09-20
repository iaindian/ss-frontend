// types.ts

export type Me = {
  id: string
  email: string
  free_credits: number
  reference_image_url?: string
}

export type AttributeKey =
  | 'age'
  | 'hair_color'
  | 'hair_style'
  | 'body_type'
  | 'skin_tone'
  | 'notes'

export type Attributes = Partial<Record<AttributeKey, string>> & {
  reference_image_base64?: string // Only used for PUT
}

export type Pack = {
  id: string
  slug: string
  title: string
  category: string
  price_cents: number
  currency: string
  preview_images: string[]
  active: boolean
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
