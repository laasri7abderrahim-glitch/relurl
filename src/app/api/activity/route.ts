import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ activities: [], total: 0 }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "10"), 1), 50)
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0"), 0)

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const [recentLinks, recentClicksData, recentQrCodes, recentAuditLogs, recentTeamMembers] =
      await Promise.all([
        prisma.shortLink.findMany({
          where: { userId: session.user.id, createdAt: { gte: sevenDaysAgo } },
          select: { id: true, slug: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        }),

        prisma.linkClick.findMany({
          where: {
            link: { userId: session.user.id },
            timestamp: { gte: twentyFourHoursAgo },
          },
          select: { linkId: true, timestamp: true },
          orderBy: { timestamp: "desc" },
        }),

        prisma.qrCode.findMany({
          where: {
            link: { userId: session.user.id },
            createdAt: { gte: sevenDaysAgo },
          },
          select: { id: true, createdAt: true, link: { select: { slug: true } } },
          orderBy: { createdAt: "desc" },
        }),

        prisma.auditLog.findMany({
          where: {
            userId: session.user.id,
            entity: "ShortLink",
            action: { in: ["activate", "deactivate"] },
            createdAt: { gte: sevenDaysAgo },
          },
          select: { id: true, action: true, entityId: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        }),

        prisma.teamMember.findMany({
          where: {
            OR: [
              { userId: session.user.id, joinedAt: { gte: sevenDaysAgo } },
              {
                team: {
                  teamMembers: {
                    some: { userId: session.user.id, role: { in: ["OWNER", "ADMIN"] } },
                  },
                },
                joinedAt: { gte: sevenDaysAgo },
              },
            ],
          },
          select: {
            id: true,
            joinedAt: true,
            userId: true,
            user: { select: { name: true } },
            team: { select: { name: true } },
          },
          orderBy: { joinedAt: "desc" },
        }),
      ])

    const clickGroups = new Map<string, { count: number; lastTimestamp: Date }>()
    for (const click of recentClicksData) {
      const group = clickGroups.get(click.linkId)
      if (group) {
        group.count++
        if (click.timestamp > group.lastTimestamp) {
          group.lastTimestamp = click.timestamp
        }
      } else {
        clickGroups.set(click.linkId, { count: 1, lastTimestamp: click.timestamp })
      }
    }

    const clickLinkIds = Array.from(clickGroups.keys())
    const clickLinks =
      clickLinkIds.length > 0
        ? await prisma.shortLink.findMany({
            where: { id: { in: clickLinkIds } },
            select: { id: true, slug: true },
          })
        : []
    const clickLinkMap = new Map(clickLinks.map((l) => [l.id, l.slug]))

    const toggleLinkIds = recentAuditLogs.map((l) => l.entityId)
    const toggleLinks =
      toggleLinkIds.length > 0
        ? await prisma.shortLink.findMany({
            where: { id: { in: toggleLinkIds } },
            select: { id: true, slug: true },
          })
        : []
    const toggleLinkMap = new Map(toggleLinks.map((l) => [l.id, l.slug]))

    const activities: Array<{
      id: string
      type: string
      message: string
      timestamp: string
      linkSlug?: string
      count?: number
      status?: string
      memberName?: string
    }> = []

    for (const link of recentLinks) {
      activities.push({
        id: `link_created_${link.id}`,
        type: "link_created",
        message: link.slug,
        timestamp: link.createdAt.toISOString(),
        linkSlug: link.slug,
      })
    }

    for (const [linkId, group] of clickGroups) {
      const slug = clickLinkMap.get(linkId)
      if (slug) {
        activities.push({
          id: `link_clicked_${linkId}`,
          type: "link_clicked",
          message: `${group.count}|${slug}`,
          timestamp: group.lastTimestamp.toISOString(),
          linkSlug: slug,
          count: group.count,
        })
      }
    }

    for (const qr of recentQrCodes) {
      activities.push({
        id: `qr_${qr.id}`,
        type: "qr_generated",
        message: qr.link.slug,
        timestamp: qr.createdAt.toISOString(),
        linkSlug: qr.link.slug,
      })
    }

    for (const log of recentAuditLogs) {
      const slug = toggleLinkMap.get(log.entityId)
      if (slug) {
        activities.push({
          id: `toggle_${log.id}`,
          type: "link_toggled",
          message: `${log.action}|${slug}`,
          timestamp: log.createdAt.toISOString(),
          linkSlug: slug,
          status: log.action === "activate" ? "active" : "inactive",
        })
      }
    }

    for (const tm of recentTeamMembers) {
      const name = tm.user?.name ?? "A member"
      if (tm.userId !== session.user.id) {
        activities.push({
          id: `team_member_${tm.id}`,
          type: "team_member_added",
          message: name,
          timestamp: tm.joinedAt.toISOString(),
          memberName: name,
        })
      }
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const paginated = activities.slice(offset, offset + limit)

    return NextResponse.json({ activities: paginated, total: activities.length })
  } catch {
    return NextResponse.json(
      { activities: [], total: 0, error: "Internal server error" },
      { status: 500 }
    )
  }
}
