import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: {
        _count: { select: { links: true } },
        links: {
          select: { _count: { select: { linkClicks: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const data = campaigns.map((c) => {
      const totalClicks = c.links.reduce((sum, l) => sum + l._count.linkClicks, 0)
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        color: c.color,
        linkCount: c._count.links,
        totalClicks,
        createdAt: c.createdAt,
      }
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, color } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || "#4f46e5",
        userId: session.user.id,
      },
    })

    return NextResponse.json({ data: campaign }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
