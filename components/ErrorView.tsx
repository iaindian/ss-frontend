'use client'
import { Alert } from './ui/alert'
import { logger } from '@/lib/logger'

export function ErrorView({ title = 'Something went wrong', description }: { title?: string; description?: string }) {
  logger.error('Render ErrorView', { title, description })
  return <Alert title={title} description={description} />
}
