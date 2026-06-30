import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") ?? ""
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")))

    const where: Record<string, unknown> = { userId: session.user.id }

    if (q) {
      where.OR = [
        { url: { contains: q, mode: "insensitive" as const } },
        { slug: { contains: q, mode: "insensitive" as const } },
        { title: { contains: q, mode: "insensitive" as const } },
        { tags: { contains: q, mode: "insensitive" as const } },
      ]
    }

    const [links, total] = await Promise.all([
      prisma.shortLink.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { linkClicks: true } } },
      }),
      prisma.shortLink.count({ where }),
    ])

    const mapped = links.map((l) => ({
      ...l,
      clicks: l._count.linkClicks,
      _count: undefined,
    }))

    return NextResponse.json({ data: { links: mapped, total, page }, error: null })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
