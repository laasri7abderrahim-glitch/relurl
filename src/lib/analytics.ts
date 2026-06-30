import { prisma } from "@/lib/prisma";
import { parseUserAgent } from "@/lib/utils";
import { detectClickFraud } from "./fraud-detection";

type Period = "24h" | "7d" | "30d" | "90d" | "all";

const PERIOD_MAP: Record<Period, number | null> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "90d": 90 * 24 * 60 * 60 * 1000,
  all: null,
};

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return req.headers.get("cf-connecting-ip") ?? null;
}

function getReferer(req: Request): string | null {
  return req.headers.get("referer") ?? req.headers.get("referrer") ?? null;
}

async function geoLookup(ip: string): Promise<{
  country: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
}> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { country: null, city: null, region: null, latitude: null, longitude: null };
    const data = await res.json();
    return {
      country: data.country ?? null,
      city: data.city ?? null,
      region: data.regionName ?? null,
      latitude: data.lat ?? null,
      longitude: data.lon ?? null,
    };
  } catch {
    return { country: null, city: null, region: null, latitude: null, longitude: null };
  }
}

export async function trackClick(
  linkId: string,
  req: Request
): Promise<void> {
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent");
  const referer = getReferer(req);
  const language = req.headers.get("accept-language");

  const { browser, os, device } = parseUserAgent(userAgent);

  const geo = ip ? await geoLookup(ip) : { country: null, city: null, region: null, latitude: null, longitude: null };

  const recentClick = ip
    ? await prisma.linkClick.findFirst({
        where: {
          linkId,
          ip,
          timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      })
    : null;

  const fraudResult = await detectClickFraud(
    {
      ip: ip ?? "",
      userAgent: userAgent ?? "",
      linkId,
      timestamp: new Date(),
      referer,
    },
    async (linkId, ip, since) => {
      return prisma.linkClick.count({
        where: {
          linkId,
          ip,
          timestamp: { gte: since },
        },
      })
    }
  )

  await prisma.linkClick.create({
    data: {
      linkId,
      ip,
      userAgent,
      referer,
      language,
      country: geo.country,
      city: geo.city,
      region: geo.region,
      latitude: geo.latitude,
      longitude: geo.longitude,
      browser,
      os,
      device,
      isUnique: !recentClick,
      isSuspicious: fraudResult.isSuspicious,
    },
  });

  await prisma.shortLink.update({
    where: { id: linkId },
    data: { lastClickedAt: new Date() },
  });

  const { broadcastClick } = await import("@/lib/sse")

  const link = await prisma.shortLink.findUnique({ where: { id: linkId }, select: { userId: true } })
  if (link?.userId) {
    broadcastClick(link.userId, {
      linkId,
      timestamp: new Date().toISOString(),
      country: geo.country ?? undefined,
      device: device ?? undefined,
      browser: browser ?? undefined,
    })
  }
}

export async function getClickStats(
  linkId: string,
  period: Period = "30d"
): Promise<{
  totalClicks: number;
  uniqueClicks: number;
  dailyBreakdown: { date: string; clicks: number; uniqueClicks: number }[];
}> {
  const since = PERIOD_MAP[period] ? new Date(Date.now() - PERIOD_MAP[period]!) : undefined;

  const where = { linkId, ...(since ? { timestamp: { gte: since } } : {}) };

  const [totalClicks, uniqueClicks, clicks] = await Promise.all([
    prisma.linkClick.count({ where }),
    prisma.linkClick.count({ where: { ...where, isUnique: true } }),
    prisma.linkClick.findMany({
      where,
      select: { timestamp: true, isUnique: true },
      orderBy: { timestamp: "asc" },
    }),
  ]);

  const dailyMap = new Map<string, { clicks: number; uniqueClicks: number }>();
  for (const click of clicks) {
    const date = click.timestamp.toISOString().slice(0, 10);
    const entry = dailyMap.get(date) ?? { clicks: 0, uniqueClicks: 0 };
    entry.clicks++;
    if (click.isUnique) entry.uniqueClicks++;
    dailyMap.set(date, entry);
  }

  const dailyBreakdown = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    ...data,
  }));

  return { totalClicks, uniqueClicks, dailyBreakdown };
}

export async function getTopReferrers(
  linkId: string,
  limit: number = 10
): Promise<{ name: string; count: number }[]> {
  const results = await prisma.linkClick.groupBy({
    by: ["referer"],
    where: { linkId, referer: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    name: r.referer ?? "Direct",
    count: r._count.id,
  }));
}

export async function getTopCountries(
  linkId: string,
  limit: number = 10
): Promise<{ name: string; count: number }[]> {
  const results = await prisma.linkClick.groupBy({
    by: ["country"],
    where: { linkId, country: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    name: r.country ?? "Unknown",
    count: r._count.id,
  }));
}

export async function getTopBrowsers(
  linkId: string,
  limit: number = 10
): Promise<{ name: string; count: number }[]> {
  const results = await prisma.linkClick.groupBy({
    by: ["browser"],
    where: { linkId, browser: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    name: r.browser ?? "Unknown",
    count: r._count.id,
  }));
}

export async function getTopDevices(
  linkId: string,
  limit: number = 10
): Promise<{ name: string; count: number }[]> {
  const results = await prisma.linkClick.groupBy({
    by: ["device"],
    where: { linkId, device: { not: null } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return results.map((r) => ({
    name: r.device ?? "Unknown",
    count: r._count.id,
  }));
}
