// import * as React from "react";
// import { clsxx } from "@/lib/utils";

// export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   variant?: "default" | "ghost" | "outline";
//   loading?: boolean;
// };

// export function Button({
//   className,
//   variant = "default",
//   loading,
//   children,
//   ...props
// }: ButtonProps) {
//   const base =
//     "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary";
//   const variants = {
//     default: "bg-primary text-black hover:shadow-neon",
//     ghost: "bg-transparent text-foreground hover:bg-muted",
//     outline:
//       "border border-border bg-transparent text-foreground hover:bg-muted",
//   } as const;
//   return (
//     <button
//       className={clsxx(base, variants[variant], className)}
//       disabled={loading || props.disabled}
//       {...props}
//     >
//       {loading ? "…" : children}
//     </button>
//   );
// }


// components/ui/button.tsx
import * as React from "react";
import { clsxx } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  loading?: boolean;
};

export function Button({
  className,
  variant = "default",
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const base =
    [
      // layout
      "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition",
      // focus
      "focus:outline-none focus:ring-2 focus:ring-primary",
      // disabled visuals
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-75",
      // kill hovers when disabled
      "disabled:hover:shadow-none disabled:hover:bg-transparent",
      // kill focus ring when disabled
      "disabled:focus:ring-0",
    ].join(" ");

  const variants = {
    default:
      // neon hover only when enabled
      "bg-primary text-black hover:shadow-neon",
    ghost:
      "bg-transparent text-foreground hover:bg-muted",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-muted",
  } as const;

  const label = loading ? "…" : children;

  return (
    <button
      className={clsxx(base, variants[variant], className)}
      disabled={loading || props.disabled}
      aria-disabled={loading || props.disabled ? true : undefined}
      aria-busy={loading ? true : undefined}
      {...props}
    >
      {label}
    </button>
  );
}

