import * as React from "react";
import { clsxx } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsxx(
      "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
