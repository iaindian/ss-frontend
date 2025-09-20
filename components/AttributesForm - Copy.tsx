'use client'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, Option } from './ui/select'
import { Button } from './ui/button'
import { logger } from '@/lib/logger'
import type { Attributes } from '@/lib/types'

const Schema = z.object({
  age: z.string().optional(),
  hair_color: z.string().optional(),
  hair_style: z.string().optional(),
  body_type: z.string().optional(),
  skin_tone: z.string().optional(),
  notes: z.string().optional(),
  reference_image: z.any().optional()
})

type FormData = z.infer<typeof Schema>

export function AttributesForm({ initial, onSave }: { initial?: Attributes; onSave: (payload: FormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: initial,
  })

  return (
    <form className="space-y-3" onSubmit={handleSubmit(async (data) => {
      logger.info('Attributes submit')
      await onSave(data)
    })}>
      <div>
        <Label>Reference Face</Label>
        <Input type="file" accept="image/*" {...register('reference_image')} />
        <div className="text-xs opacity-70">JPG/PNG, ~5MB max.</div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <Label>Age</Label>
          <Select {...register('age' as const)} onChange={() => {}}>
            <Option value="">Select…</Option>
            <Option value="teen">Teen</Option>
            <Option value="20s">20s</Option>
            <Option value="30s">30s</Option>
            <Option value="40s">40s</Option>
            <Option value="50+">50+</Option>
          </Select>
        </div>
        <div>
          <Label>Hair Color</Label>
          <Input placeholder="e.g., black, brown, blonde" {...register('hair_color')} />
        </div>
        <div>
          <Label>Hair Style</Label>
          <Input placeholder="e.g., long, bob, curly" {...register('hair_style')} />
        </div>
        <div>
          <Label>Body Type</Label>
          <Input placeholder="e.g., athletic, slim, curvy" {...register('body_type')} />
        </div>
        <div>
          <Label>Skin Tone</Label>
          <Input placeholder="e.g., fair, tan, deep" {...register('skin_tone')} />
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea rows={3} placeholder="Anything else the model should know" {...register('notes')} />
      </div>
      <Button type="submit" loading={isSubmitting}>Save</Button>
    </form>
  )
}
