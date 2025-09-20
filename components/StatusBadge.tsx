import { Badge } from './ui/badge'

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace('_', ' ')
  return <Badge>{label}</Badge>
}
