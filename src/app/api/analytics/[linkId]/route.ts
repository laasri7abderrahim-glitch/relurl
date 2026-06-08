import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getClickStats,
  getTopReferrers,
  getTopCountries,
  getTopBrowsers,
  getTopDevices,
} from "@/lib/analytics";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const { linkId } = await params;

    const link = await prisma.shortLink.findUnique({ where: { id: linkId } });
    if (!link || link.userId !== session.user.id) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    const period = "30d" as const;

    const [stats, referrers, countries, browsers, devices] = await Promise.all([
      getClickStats(linkId, period),
      getTopReferrers(linkId),
      getTopCountries(linkId),
      getTopBrowsers(linkId),
      getTopDevices(linkId),
    ]);

    return NextResponse.json({
      data: {
        link: { id: link.id, slug: link.slug, url: link.url, title: link.title },
        ...stats,
        topReferrers: referrers,
        topCountries: countries,
        topBrowsers: browsers,
        topDevices: devices,
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
