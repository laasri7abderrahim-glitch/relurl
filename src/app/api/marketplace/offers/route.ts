import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const offerSchema = z.object({
  amount: z.number().positive("Le montant doit être positif"),
  message: z.string().optional(),
  listingId: z.string().uuid(),
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = offerSchema.parse(body)

    if (data.buyerId === data.sellerId) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas faire une offre sur votre propre annonce" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        ...data,
        status: "PENDING",
        counterAmount: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: "Offre envoyée avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const listingId = searchParams.get("listingId")
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")

  return NextResponse.json({
    success: true,
    data: [],
    message: "Offres récupérées avec succès",
  })
}