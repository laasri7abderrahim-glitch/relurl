import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCachedOrFetch } from "@/lib/cache";

const querySchema = z.object({
  linkId: z.string().uuid().optional(),
  period: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
});

const PERIOD_MS: Record<string, number | null> = {
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
  all: null,
};

function aggregateClicks(
  clicks: { timestamp: Date; isUnique: boolean }[],
  groupBy: string
): { date: string; clicks: number; uniqueClicks: number }[] {
  const map = new Map<string, { clicks: number; uniqueClicks: number }>();
  for (const click of clicks) {
    const d = click.timestamp;
    let key: string;
    if (groupBy === "week") {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      key = start.toISOString().slice(0, 10);
    } else if (groupBy === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = d.toISOString().slice(0, 10);
    }
    const entry = map.get(key) ?? { clicks: 0, uniqueClicks: 0 };
    entry.clicks++;
    if (click.isUnique) entry.uniqueClicks++;
    map.set(key, entry);
  }
  return Array.from(map.entries()).map(([date, data]) => ({ date, ...data }));
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({
      linkId: searchParams.get("linkId") ?? undefined,
      period: searchParams.get("period") ?? "30d",
      groupBy: searchParams.get("groupBy") ?? "day",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { linkId, period, groupBy } = parsed.data;

    const cacheKey = `analytics:${session.user.id}:${linkId || "all"}:${period}:${groupBy}`;

    const result = await getCachedOrFetch(cacheKey, async () => {
      const accessibleLinks = await prisma.shortLink.findMany({
        where: linkId
          ? { id: linkId, userId: session.user.id }
          : { userId: session.user.id },
        select: { id: true },
      });
      const linkIds = accessibleLinks.map((l) => l.id);

      if (linkIds.length === 0) {
        return {
          clicks: 0,
          uniqueVisitors: 0,
          totalLinks: 0,
          clicksByDay: [],
          referrers: [],
          countries: [],
          browsers: [],
          devices: [],
          os: [],
          topLink: null,
        };
      }

      const since = PERIOD_MS[period]
        ? new Date(Date.now() - PERIOD_MS[period]!)
        : undefined;
      const clickWhere = {
        linkId: { in: linkIds },
        ...(since ? { timestamp: { gte: since } } : {}),
      };

      const [totalClicks, uniqueClicks, suspiciousClicks, clicks, referrers, countries, browsers, devices, os] =
        await Promise.all([
          prisma.linkClick.count({ where: clickWhere }),
          prisma.linkClick.count({ where: { ...clickWhere, isUnique: true } }),
          prisma.linkClick.count({ where: { ...clickWhere, isSuspicious: true } }),
          prisma.linkClick.findMany({
            where: clickWhere,
            select: { timestamp: true, isUnique: true },
            orderBy: { timestamp: "asc" },
          }),
          prisma.linkClick.groupBy({
            by: ["referer"],
            where: { ...clickWhere, referer: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
          }),
          prisma.linkClick.groupBy({
            by: ["country"],
            where: { ...clickWhere, country: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
          }),
          prisma.linkClick.groupBy({
            by: ["browser"],
            where: { ...clickWhere, browser: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
          }),
          prisma.linkClick.groupBy({
            by: ["device"],
            where: { ...clickWhere, device: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
          }),
          prisma.linkClick.groupBy({
            by: ["os"],
            where: { ...clickWhere, os: { not: null } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
          }),
        ]);

      const clicksByDay = aggregateClicks(clicks, groupBy);

      const topLinkGroup = await prisma.linkClick.groupBy({
        by: ["linkId"],
        where: clickWhere,
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      });

      let topLink: { url: string; slug: string; clicks: number } | null = null;
      if (topLinkGroup.length > 0) {
        const link = await prisma.shortLink.findUnique({
          where: { id: topLinkGroup[0].linkId },
          select: { url: true, slug: true },
        });
        if (link) {
          topLink = { url: link.url, slug: link.slug, clicks: topLinkGroup[0]._count.id };
        }
      }

      return {
        clicks: totalClicks,
        uniqueVisitors: uniqueClicks,
        suspiciousClicks,
        totalLinks: linkIds.length,
        clicksByDay,
        referrers: referrers.map((r) => ({
          referrer: r.referer ?? "Direct",
          count: r._count.id,
        })),
        countries: countries.map((c) => ({
          country: c.country ?? "Unknown",
          count: c._count.id,
        })),
        browsers: browsers.map((b) => ({
          browser: b.browser ?? "Unknown",
          count: b._count.id,
        })),
        devices: devices.map((d) => ({
          device: d.device ?? "Unknown",
          count: d._count.id,
        })),
        os: os.map((o) => ({
          os: o.os ?? "Unknown",
          count: o._count.id,
        })),
        topLink,
      };
    }, 30);

    return NextResponse.json(result ? result : {
      clicks: 0,
      uniqueVisitors: 0,
      totalLinks: 0,
      clicksByDay: [],
      referrers: [],
      countries: [],
      browsers: [],
      devices: [],
      os: [],
      topLink: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
