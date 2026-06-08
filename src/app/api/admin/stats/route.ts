import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      activeUsers,
      totalLinks,
      activeLinks,
      totalClicks,
      uniqueClicks,
      totalApiKeys,
      recentClicks,
      recentClicksData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.shortLink.count(),
      prisma.shortLink.count({ where: { isActive: true } }),
      prisma.linkClick.count(),
      prisma.linkClick.count({ where: { isUnique: true } }),
      prisma.apiKey.count({ where: { isActive: true } }),
      prisma.linkClick.count({
        where: { timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      prisma.linkClick.findMany({
        where: { timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { timestamp: true },
        orderBy: { timestamp: "asc" },
      }),
    ]);

    const dailyMap = new Map<string, number>();
    for (const click of recentClicksData) {
      const date = click.timestamp.toISOString().slice(0, 10);
      dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1);
    }

    const clicksByDay = Array.from(dailyMap.entries()).map(([date, clicks]) => ({
      date,
      clicks,
    }));

    return NextResponse.json({
      data: {
        users: { total: totalUsers, active: activeUsers },
        links: { total: totalLinks, active: activeLinks },
        clicks: { total: totalClicks, unique: uniqueClicks, last24h: recentClicks },
        apiKeys: { total: totalApiKeys },
        clicksByDay,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
