export function cents(amount: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100)
}

export function clsx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
