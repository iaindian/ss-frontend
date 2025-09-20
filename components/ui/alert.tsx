export function Alert({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-warning">
      <div className="font-medium">{title}</div>
      {description && <div className="text-sm opacity-80">{description}</div>}
    </div>
  )
}
