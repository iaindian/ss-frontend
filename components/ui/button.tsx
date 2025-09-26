import * as React from "react";
import { clsxx } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  loading?: boolean;
};

export function Button({
  className,
  variant = "default",
  loading,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary";
  const variants = {
    default: "bg-primary text-black hover:shadow-neon",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-muted",
  } as const;
  return (
    <button
      className={clsxx(base, variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  );
}
