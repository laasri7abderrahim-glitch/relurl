import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const bioPageSchema = z.object({
  slug: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  theme: z.object({
    background: z.string().optional(),
    textColor: z.string().optional(),
    buttonStyle: z.string().optional(),
  }).optional(),
  links: z.array(z.object({
    title: z.string().min(1),
    url: z.string().url(),
    icon: z.string().optional(),
    color: z.string().optional(),
    order: z.number().optional(),
  })).min(1).max(20),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = bioPageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const { slug, title, description, avatar, theme, links } = parsed.data

    const existing = await prisma.bioPage.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { data: null, error: "Slug already taken" },
        { status: 409 }
      )
    }

    const page = await prisma.bioPage.create({
      data: {
        userId: session.user.id,
        slug,
        title,
        description,
        avatar,
        theme: theme ? JSON.stringify(theme) : null,
        links: {
          create: links.map((l, i) => ({
            title: l.title,
            url: l.url,
            icon: l.icon,
            color: l.color,
            order: l.order ?? i,
          })),
        },
      },
      include: { links: true },
    })

    return NextResponse.json({ data: page, error: null })
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

    const pages = await prisma.bioPage.findMany({
      where: { userId: session.user.id },
      include: { links: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: pages, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
