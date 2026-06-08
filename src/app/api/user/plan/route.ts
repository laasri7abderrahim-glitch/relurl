import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getUserPlanLimits, checkLinkLimit, checkClickLimit } from "@/lib/plans"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, limits } = await getUserPlanLimits(session.user.id)
    const linkCheck = await checkLinkLimit(session.user.id)
    const clickCheck = await checkClickLimit(session.user.id)

    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const links = await prisma.shortLink.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    })
    const linkIds = links.map((l) => l.id)

    const totalLinks = await prisma.shortLink.count({
      where: { userId: session.user.id },
    })

    const totalClicks = linkIds.length > 0
      ? await prisma.linkClick.count({
          where: {
            linkId: { in: linkIds },
            timestamp: { gte: currentMonth },
          },
        })
      : 0

    return NextResponse.json({
      plan,
      limits,
      usage: {
        links: { current: linkCheck.current, max: limits.maxLinks },
        clicks: { current: clickCheck.current, max: limits.maxClicks },
        totalLinks,
        totalClicksThisMonth: totalClicks,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
