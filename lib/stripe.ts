import { loadStripe } from '@stripe/stripe-js'
import { logger } from './logger'

let stripePromise: Promise<import('@stripe/stripe-js').Stripe | null>

export function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePromise) {
    if (!key) {
      logger.warn('Stripe key missing — checkout_url flow only')
      stripePromise = Promise.resolve(null)
    } else {
      stripePromise = loadStripe(key)
    }
  }
  return stripePromise
}
