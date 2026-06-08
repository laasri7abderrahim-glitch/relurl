import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import QRCodeLib from "qrcode"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createQrSchema = z.object({
  linkId: z.string().uuid("Invalid link ID"),
  size: z.number().int().min(100).max(1000).optional(),
  format: z.enum(["png", "svg"]).optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const qrCodes = await prisma.qrCode.findMany({
      where: {
        link: { userId: session.user.id },
      },
      include: {
        link: {
          select: { slug: true, url: true, domain: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: qrCodes, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createQrSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { linkId, size = 300, format = "png" } = parsed.data

    const link = await prisma.shortLink.findFirst({
      where: { id: linkId, userId: session.user.id },
    })
    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    const shortUrl = `https://${link.domain}/${link.slug}`
    const qrDataUrl = await QRCodeLib.toDataURL(shortUrl, {
      width: size,
      margin: 2,
    })

    const qrCode = await prisma.qrCode.create({
      data: {
        linkId,
        name: link.slug,
        size,
        format,
      },
    })

    return NextResponse.json(
      { data: { qrCode: qrDataUrl, id: qrCode.id }, error: null },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
