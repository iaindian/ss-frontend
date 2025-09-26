// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils" // or clsxx if that's what you use

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ children, className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 transition-all",
        "shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]",
        "hover:border-emerald-400/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: DivProps) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }: DivProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {children}
    </div>
  )
}




// import * as React from 'react'
// export function Card({ children }: { children: React.ReactNode }) {
//   return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">{children}</div>
// }
// export function CardHeader({ children }: { children: React.ReactNode }) {
//   return <div className="mb-3 flex items-center justify-between">{children}</div>
// }
// export function CardTitle({ children }: { children: React.ReactNode }) {
//   return <h3 className="text-lg font-semibold">{children}</h3>
// }
// export function CardContent({ children }: { children: React.ReactNode }) {
//   return <div className="space-y-3">{children}</div>
// }


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
