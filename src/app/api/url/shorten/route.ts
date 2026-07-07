import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateSlug } from "@/lib/nanoid"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous"
    const rateCheck = await rateLimit(ip, { maxRequests: 10, windowMs: 60000 })
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const { url } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let finalUrl = url.trim()
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl
    }

    try { new URL(finalUrl) }
    catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }) }

    const session = await auth()
    const slug = generateSlug()

    const link = await prisma.shortLink.create({
      data: {
        url: finalUrl,
        slug,
        domain: "relurl.com",
        userId: session?.user?.id || null,
        isActive: true,
      },
    })

    return NextResponse.json({ shortUrl: `https://relurl.com/api/redirect?slug=${link.slug}` })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to shorten URL" },
      { status: 500 }
    )
  }
}
