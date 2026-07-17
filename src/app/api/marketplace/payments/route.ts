import { NextRequest, NextResponse } from "next/server"
import {
  createCheckoutSession,
  createPromotionPayment,
  handleStripeWebhook,
  PLANS,
  type PlanType,
} from "@/MARKETPLACE/src/lib/stripe"
import stripe from "@/MARKETPLACE/src/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, plan, listingId, promotionType, durationDays } = body

    const successUrl = `${request.headers.get("origin")}/marketplace/dashboard/settings?success=true`
    const cancelUrl = `${request.headers.get("origin")}/marketplace/dashboard/settings?canceled=true`

    if (action === "subscribe") {
      if (!plan || !PLANS[plan as PlanType]) {
        return NextResponse.json(
          { success: false, error: "Plan invalide" },
          { status: 400 }
        )
      }
      const session = await createCheckoutSession(userId, plan as PlanType, successUrl, cancelUrl)
      return NextResponse.json({
        success: true,
        data: { checkoutUrl: session.url },
      })
    }

    if (action === "promote") {
      if (!listingId || !promotionType) {
        return NextResponse.json(
          { success: false, error: "Paramètres manquants" },
          { status: 400 }
        )
      }
      const session = await createPromotionPayment(
        userId,
        listingId,
        promotionType,
        durationDays || 7,
        successUrl,
        cancelUrl
      )
      return NextResponse.json({
        success: true,
        data: { checkoutUrl: session.url },
      })
    }

    return NextResponse.json(
      { success: false, error: "Action invalide" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du paiement" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: "session_id requis" },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({
      success: true,
      data: {
        status: session.payment_status,
        metadata: session.metadata,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Session invalide" },
      { status: 400 }
    )
  }
}