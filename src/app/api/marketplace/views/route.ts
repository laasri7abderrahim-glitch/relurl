import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const viewSchema = z.object({
  listingId: z.string().uuid(),
  userId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = viewSchema.parse(body)

    const userAgent = request.headers.get("user-agent") || ""
    const referer = request.headers.get("referer") || ""
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const device = /mobile/i.test(userAgent) ? "mobile" : /tablet/i.test(userAgent) ? "tablet" : "desktop"
    const browser = userAgent.includes("Chrome") ? "Chrome" : userAgent.includes("Firefox") ? "Firefox" : userAgent.includes("Safari") ? "Safari" : "Other"
    const os = userAgent.includes("Windows") ? "Windows" : userAgent.includes("Mac") ? "macOS" : userAgent.includes("Linux") ? "Linux" : userAgent.includes("Android") ? "Android" : userAgent.includes("iOS") ? "iOS" : "Other"

    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        listingId: data.listingId,
        userId: data.userId,
        ip,
        userAgent,
        referer,
        device,
        browser,
        os,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Erreur interne" },
      { status: 500 }
    )
  }
}