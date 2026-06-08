import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/nanoid"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 })
    }
    const apiKey = authHeader.slice(7)

    const key = await prisma.apiKey.findFirst({
      where: { key: apiKey, isActive: true },
      include: { user: { select: { id: true } } },
    })
    if (!key) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const body = await req.json()
    const { url, slug, title } = body

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    try { new URL(url) } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const finalSlug = slug || generateSlug()

    const existing = await prisma.shortLink.findUnique({ where: { slug: finalSlug } })
    if (existing) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 })
    }

    const link = await prisma.shortLink.create({
      data: {
        url,
        slug: finalSlug,
        title: title || null,
        userId: key.user.id,
      },
    })

    await prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    })

    return NextResponse.json({
      shortUrl: `https://relurl.com/${link.slug}`,
      slug: link.slug,
      originalUrl: link.url,
      createdAt: link.createdAt,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "RELURL Make integration is working" })
}
