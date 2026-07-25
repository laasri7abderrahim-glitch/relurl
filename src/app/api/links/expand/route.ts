import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const expandSchema = z.object({
  shortUrl: z.string().min(1, "shortUrl is required"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = expandSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { shortUrl } = parsed.data
    const parts = shortUrl.replace(/^https?:\/\//, "").split("/")
    const slug = parts.slice(1).join("/") || parts[0]?.split(".")[0]

    const link = await prisma.shortLink.findFirst({
      where: {
        OR: [
          { slug },
          { slug: shortUrl.split("/").pop() },
        ],
      },
      select: {
        id: true,
        url: true,
        slug: true,
        domain: true,
        title: true,
        createdAt: true,
      },
    })

    if (!link) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        longUrl: link.url,
        id: link.id,
        slug: link.slug,
        domain: link.domain,
        title: link.title,
        createdAt: link.createdAt,
      },
      error: null,
    })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
