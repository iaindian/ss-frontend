import * as React from 'react'
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">{children}</div>
}
export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 flex items-center justify-between">{children}</div>
}
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>
}


// components/ui/card.tsx
// import * as React from 'react'


// function cn(...classes: (string | false | null | undefined)[]) {
//   return classes.filter(Boolean).join(" ")
// }

// export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

// export function Card({ className, ...props }: CardProps) {
//   return (
//     <div
//       className={cn('rounded-2xl border border-border bg-card text-card-foreground shadow-sm', className)}
//       {...props}
//     />
//   )
// }

// export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
//   return <div className={cn('flex flex-col space-y-1.5 p-4', className)} {...props} />
// }

// export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
//   return <h3 className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
// }

// export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
//   return <div className={cn('p-4 pt-0', className)} {...props} />
// }
