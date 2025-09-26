import { Api } from '@/lib/api'
import { logger } from '@/lib/logger'

export async function uploadReferenceImage(file: File): Promise<string> {
  const { url } = await Api.uploadReferenceImage(file) // server saves to Spaces + tenant
  logger.info('ref.upload.saved', { url })
  return url
}