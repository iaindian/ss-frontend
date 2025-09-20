'use client'
import { ErrorView } from '@/components/ErrorView'
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return <html><body><ErrorView title="App crashed" description={error?.message} /></body></html>
}
