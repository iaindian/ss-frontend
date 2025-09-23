import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cents(amount: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100)
}

export function clsxx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}