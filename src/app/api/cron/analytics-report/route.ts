import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { generateAnalyticsReportHtml } from "@/lib/email-templates/analytics-report"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const dayOfWeek = now.getDay()
  const dayOfMonth = now.getDate()

  const schedules = await prisma.reportSchedule.findMany({
    where: {
      isActive: true,
      OR: [
        { frequency: "daily" },
        { frequency: "weekly", dayOfWeek },
        { frequency: "monthly", dayOfMonth },
      ],
    },
    include: { user: true },
  })

  let sent = 0
  for (const schedule of schedules) {
    try {
      if (!schedule.user.email) continue

      const links = await prisma.shortLink.findMany({
        where: { userId: schedule.userId },
        select: { id: true },
      })
      const linkIds = links.map(l => l.id)

      if (linkIds.length === 0) continue

      const periodStart = new Date(now)
      if (schedule.frequency === "daily") periodStart.setDate(now.getDate() - 1)
      else if (schedule.frequency === "weekly") periodStart.setDate(now.getDate() - 7)
      else periodStart.setMonth(now.getMonth() - 1)

      const clicks = await prisma.linkClick.count({
        where: { linkId: { in: linkIds }, timestamp: { gte: periodStart } },
      })

      const uniqueVisitors = await prisma.linkClick.count({
        where: { linkId: { in: linkIds }, timestamp: { gte: periodStart }, isUnique: true },
      })

      const topClick = await prisma.linkClick.groupBy({
        by: ["linkId"],
        where: { linkId: { in: linkIds }, timestamp: { gte: periodStart } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      })

      let topLink = null
      if (topClick.length > 0) {
        const link = await prisma.shortLink.findUnique({
          where: { id: topClick[0].linkId },
          select: { slug: true },
        })
        if (link) topLink = { slug: link.slug, clicks: topClick[0]._count.id }
      }

      const referrers = await prisma.linkClick.groupBy({
        by: ["referer"],
        where: { linkId: { in: linkIds }, timestamp: { gte: periodStart }, referer: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      })

      const countries = await prisma.linkClick.groupBy({
        by: ["country"],
        where: { linkId: { in: linkIds }, timestamp: { gte: periodStart }, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      })

      const html = generateAnalyticsReportHtml({
        userName: schedule.user.name || "User",
        period: schedule.frequency,
        stats: {
          totalClicks: clicks,
          uniqueVisitors,
          totalLinks: linkIds.length,
          topLink,
        },
        topReferrers: referrers.map(r => ({ name: r.referer || "Direct", count: r._count.id })),
        topCountries: countries.map(c => ({ country: c.country || "Unknown", count: c._count.id })),
        reportUrl: `https://relurl.com/dashboard/analytics`,
      })

      await sendEmail({
        to: schedule.user.email,
        subject: `RELURL Analytics Report - ${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}`,
        html,
      })
      sent++
    } catch (err) {
      console.error(`Failed to send report for user ${schedule.userId}:`, err)
    }
  }

  return NextResponse.json({ sent, total: schedules.length })
}
