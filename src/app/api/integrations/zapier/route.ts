import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/nanoid"

// Zapier performs a POST to this endpoint to create a short link
// Authentication via API key in the Authorization header
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 })
    }
    const apiKey = authHeader.slice(7)

    // Verify API key
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

    // Validate URL
    try { new URL(url) } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug()

    // Check slug uniqueness
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

    // Update API key usage
    await prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    })

    const shortUrl = `https://relurl.com/${link.slug}`

    return NextResponse.json({
      id: link.id,
      short_url: shortUrl,
      slug: link.slug,
      original_url: link.url,
      created_at: link.createdAt,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

// Zapier tests the connection with a GET
export async function GET() {
  return NextResponse.json({ status: "ok", message: "RELURL Zapier integration is working" })
}
