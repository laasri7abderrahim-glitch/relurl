import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PERIODS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("linkId");
    const period = searchParams.get("period");

    const linkWhere = linkId ? { id: linkId, userId: session.user.id } : { userId: session.user.id };
    const accessibleLinks = await prisma.shortLink.findMany({
      where: linkWhere,
      select: { id: true, url: true, slug: true },
    });
    const linkIds = accessibleLinks.map((l) => l.id);
    const linkMap = new Map(accessibleLinks.map((l) => [l.id, l]));

    const csvHeader = "Link URL,Slug,Timestamp,IP,Country,Device,Browser,Referrer\n";

    if (linkIds.length === 0) {
      return new NextResponse(csvHeader, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="clicks-export.csv"',
        },
      });
    }

    const days = period ? PERIODS[period] : undefined;
    const since = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;

    const clicks = await prisma.linkClick.findMany({
      where: {
        linkId: { in: linkIds },
        ...(since ? { timestamp: { gte: since } } : {}),
      },
      orderBy: { timestamp: "desc" },
    });

    const headers = ["Link URL", "Slug", "Timestamp", "IP", "Country", "Device", "Browser", "Referrer"];
    const rows = clicks.map((click) => {
      const link = linkMap.get(click.linkId);
      return [
        link?.url ?? "",
        link?.slug ?? "",
        click.timestamp.toISOString(),
        click.ip ?? "",
        click.country ?? "",
        click.device ?? "",
        click.browser ?? "",
        click.referer ?? "",
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="clicks-export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
