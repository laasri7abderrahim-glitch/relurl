import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const notificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(["INFO", "OFFER", "MESSAGE", "FAVORITE", "REVIEW", "PROMOTION", "SYSTEM"]).default("INFO"),
  title: z.string().min(1),
  message: z.string().optional(),
  link: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = notificationSchema.parse(body)

    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        ...data,
        read: false,
        createdAt: new Date().toISOString(),
      },
      message: "Notification créée",
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  return NextResponse.json({
    success: true,
    data: [],
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    return NextResponse.json({
      success: true,
      message: "Notification mise à jour",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur interne" },
      { status: 500 }
    )
  }
}