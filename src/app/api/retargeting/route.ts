import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const pixelSchema = z.object({
  linkId: z.string().uuid(),
  facebookPixel: z.string().optional(),
  googlePixel: z.string().optional(),
  tiktokPixel: z.string().optional(),
  linkedinPixel: z.string().optional(),
  twitterPixel: z.string().optional(),
  customPixels: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = pixelSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId, ...pixels } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const updated = await prisma.shortLink.update({
      where: { id: linkId },
      data: pixels,
    })

    return NextResponse.json({ data: updated, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const linkId = searchParams.get("linkId")

    if (!linkId) {
      return NextResponse.json({ data: null, error: "linkId required" }, { status: 400 })
    }

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
      select: {
        id: true,
        facebookPixel: true,
        googlePixel: true,
        tiktokPixel: true,
        linkedinPixel: true,
        twitterPixel: true,
        customPixels: true,
      },
    })

    return NextResponse.json({ data: link, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
