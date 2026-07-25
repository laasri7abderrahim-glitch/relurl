import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") ?? ""

    const links = await prisma.shortLink.findMany({
      where: {
        userId: session.user.id,
        tags: { not: null },
        ...(search ? { tags: { contains: search, mode: "insensitive" as const } } : {}),
      },
      select: { tags: true },
    })

    const tagSet = new Set<string>()
    for (const link of links) {
      if (link.tags) {
        try {
          const parsed = JSON.parse(link.tags)
          if (Array.isArray(parsed)) {
            parsed.forEach((t: string) => tagSet.add(t))
          }
        } catch { }
      }
    }

    const tags = Array.from(tagSet).sort()
    return NextResponse.json({
      data: { tags, total: tags.length },
      error: null,
    })
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
