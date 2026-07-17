import { NextRequest, NextResponse } from "next/server"
import { handleStripeWebhook } from "@/MARKETPLACE/src/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Signature manquante" },
        { status: 400 }
      )
    }

    const result = await handleStripeWebhook(Buffer.from(body), signature)

    if (result) {
      console.log("Stripe webhook processed:", result)

      switch (result.type) {
        case "subscription": {
          console.log(`User ${result.userId} subscribed to plan ${result.plan}`)
          break
        }
        case "promotion": {
          console.log(`Listing ${result.listingId} promoted with ${result.promotionType}`)
          break
        }
        case "subscription_cancelled": {
          console.log(`Subscription ${result.subscriptionId} cancelled`)
          break
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Webhook error" },
      { status: 400 }
    )
  }
}