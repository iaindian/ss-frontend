import { twMerge } from "tailwind-merge"
// import { clsx, type ClassValue } from "clsx"
import clsx, { ClassValue } from "clsx"

export function cents(amount: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100)
}

export function clsxx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_CREDITS_PER_PACK = 20

/** Returns the credit cost for a pack, falling back to the global default. */
export function packCreditCost(pack: { credit_cost?: number | null }): number {
  return pack.credit_cost ?? DEFAULT_CREDITS_PER_PACK
}
