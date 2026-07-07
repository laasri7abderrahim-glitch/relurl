import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const links = await prisma.shortLink.findMany({
      where: { userId: session.user.id },
      select: { id: true, slug: true, url: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    const linkIds = (await prisma.shortLink.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    })).map((l) => l.id)

    const [thisWeekClicks, lastWeekClicks, topLinks, referrers, countries] = await Promise.all([
      prisma.linkClick.count({
        where: { linkId: { in: linkIds }, timestamp: { gte: weekAgo } },
      }),
      prisma.linkClick.count({
        where: { linkId: { in: linkIds }, timestamp: { gte: twoWeeksAgo, lt: weekAgo } },
      }),
      prisma.linkClick.groupBy({
        by: ["linkId"],
        _count: { id: true },
        where: { linkId: { in: linkIds }, timestamp: { gte: weekAgo } },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.linkClick.groupBy({
        by: ["referer"],
        _count: { id: true },
        where: { linkId: { in: linkIds }, timestamp: { gte: weekAgo }, referer: { not: null } },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.linkClick.groupBy({
        by: ["country"],
        _count: { id: true },
        where: { linkId: { in: linkIds }, timestamp: { gte: weekAgo }, country: { not: null } },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ])

    const topLinkIds = topLinks.map((t) => t.linkId)
    const topLinkDetails = topLinkIds.length > 0
      ? await prisma.shortLink.findMany({
          where: { id: { in: topLinkIds } },
          select: { id: true, slug: true, title: true, url: true },
        })
      : []

    const changePercent = lastWeekClicks > 0
      ? Math.round(((thisWeekClicks - lastWeekClicks) / lastWeekClicks) * 100)
      : thisWeekClicks > 0 ? 100 : 0

    return NextResponse.json({
      data: {
        thisWeekClicks,
        lastWeekClicks,
        changePercent,
        topLinks: topLinkDetails.map((l) => ({
          ...l,
          clicks: topLinks.find((t) => t.linkId === l.id)?._count.id ?? 0,
        })),
        topReferrers: referrers.map((r) => ({ source: r.referer, count: r._count.id })),
        topCountries: countries.map((c) => ({ country: c.country, count: c._count.id })),
        totalLinks: links.length,
        recentLinks: links.slice(0, 5),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get insights" }, { status: 500 })
  }
}
