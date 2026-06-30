import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/nanoid"
import { rateLimit } from "@/lib/rate-limit"

const bulkLinkSchema = z.object({
  links: z
    .array(
      z.object({
        url: z.string().url("Invalid URL"),
        slug: z
          .string()
          .min(3)
          .max(20)
          .regex(/^[a-zA-Z0-9_-]+$/, "Slug must be alphanumeric, hyphens, or underscores")
          .optional(),
        title: z.string().max(200).optional(),
      })
    )
    .min(1, "At least one link is required")
    .max(50, "Maximum 50 links per request"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const rateLimitResult = await rateLimit(session.user.id, { windowMs: 60_000, maxRequests: 10 })
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { data: null, error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = bulkLinkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { links } = parsed.data
    const created: Array<{ id: string; url: string; slug: string; shortUrl: string }> = []
    const errors: Array<{ index: number; url: string; error: string }> = []
    const usedSlugs = new Set<string>()

    for (let i = 0; i < links.length; i++) {
      const { url, slug, title } = links[i]
      const finalSlug = slug ?? generateSlug()

      if (usedSlugs.has(finalSlug)) {
        errors.push({ index: i, url, error: "Duplicate slug in batch" })
        continue
      }

      const existing = await prisma.shortLink.findUnique({ where: { slug: finalSlug } })
      if (existing) {
        errors.push({ index: i, url, error: "Slug already taken" })
        continue
      }

      usedSlugs.add(finalSlug)

      const link = await prisma.shortLink.create({
        data: {
          url,
          slug: finalSlug,
          title,
          userId: session.user.id,
        },
      })

      created.push({
        id: link.id,
        url: link.url,
        slug: link.slug,
        shortUrl: `https://${link.domain}/${link.slug}`,
      })
    }

    return NextResponse.json({
      data: { created, errors, total: links.length, successCount: created.length },
      error: null,
    })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
