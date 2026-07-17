import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { checkListingFraud, checkUserFraud, generateFraudReport } from "@/MARKETPLACE/src/lib/fraud"

const checkSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().nullable().optional(),
  city: z.string(),
  contactPhone: z.string().nullable().optional(),
  userId: z.string(),
  images: z.array(z.object({ url: z.string() })).optional(),
  userEmail: z.string().optional(),
  userPhone: z.string().nullable().optional(),
  userCreatedAt: z.string().optional(),
  userListingsCount: z.number().optional(),
  userReportsCount: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = checkSchema.parse(body)

    const listingResult = checkListingFraud({
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      city: data.city,
      contactPhone: data.contactPhone,
      userId: data.userId,
      images: data.images,
    })

    let userResult = null
    if (data.userEmail && data.userCreatedAt) {
      userResult = checkUserFraud({
        email: data.userEmail,
        phone: data.userPhone,
        createdAt: new Date(data.userCreatedAt),
        listingsCount: data.userListingsCount,
        reportsCount: data.userReportsCount,
      })
    }

    const combinedScore = userResult
      ? Math.max(listingResult.score, userResult.score)
      : listingResult.score

    const allSignals = [
      ...listingResult.signals,
      ...(userResult?.signals || []),
    ]

    const result = {
      score: combinedScore,
      signals: allSignals,
      shouldBlock: listingResult.shouldBlock || userResult?.shouldBlock || false,
      shouldReview: listingResult.shouldReview || userResult?.shouldReview || false,
      report: generateFraudReport({
        score: combinedScore,
        signals: allSignals,
        shouldBlock: listingResult.shouldBlock || userResult?.shouldBlock || false,
        shouldReview: listingResult.shouldReview || userResult?.shouldReview || false,
      }),
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Erreur lors de la vérification" },
      { status: 500 }
    )
  }
}