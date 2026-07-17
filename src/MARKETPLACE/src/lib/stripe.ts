import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
})

export const PLANS = {
  FREE: {
    name: "Gratuit",
    nameAr: "مجاني",
    price: 0,
    listings: 10,
    photosPerListing: 5,
    featured: false,
    boosted: false,
    analytics: false,
    priority: false,
  },
  PREMIUM: {
    name: "Premium",
    nameAr: "بريميوم",
    price: 99,
    listings: 50,
    photosPerListing: 15,
    featured: true,
    boosted: true,
    analytics: true,
    priority: false,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
  },
  PRO: {
    name: "Professionnel",
    nameAr: "محترف",
    price: 299,
    listings: -1,
    photosPerListing: 30,
    featured: true,
    boosted: true,
    analytics: true,
    priority: true,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
} as const

export type PlanType = keyof typeof PLANS

export async function createCheckoutSession(
  userId: string,
  plan: PlanType,
  successUrl: string,
  cancelUrl: string
) {
  const planConfig = PLANS[plan]
  if (!planConfig.stripePriceId) throw new Error("Invalid plan")

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: undefined,
    metadata: { userId, plan },
    line_items: [
      {
        price: planConfig.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createPromotionPayment(
  userId: string,
  listingId: string,
  promotionType: "FEATURED" | "BOOST" | "URGENT",
  durationDays: number,
  successUrl: string,
  cancelUrl: string
) {
  const prices: Record<string, number> = {
    FEATURED: 49,
    BOOST: 29,
    URGENT: 19,
  }

  const amount = (prices[promotionType] || 29) * 100 * durationDays

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    metadata: { userId, listingId, promotionType, durationDays: String(durationDays) },
    line_items: [
      {
        price_data: {
          currency: "mad",
          product_data: {
            name: `Promotion ${promotionType} - ${durationDays} jours`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  })

  return session
}

export async function handleStripeWebhook(
  body: Buffer,
  signature: string
) {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, plan, listingId, promotionType, durationDays } = session.metadata || {}

      if (plan) {
        return { type: "subscription", userId, plan }
      }
      if (listingId && promotionType) {
        return {
          type: "promotion",
          userId,
          listingId,
          promotionType,
          durationDays: Number(durationDays),
        }
      }
      break
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      return { type: "subscription_cancelled", subscriptionId: subscription.id }
    }
  }

  return null
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}

export default stripe