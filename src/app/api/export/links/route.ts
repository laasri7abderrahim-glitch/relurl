import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await prisma.shortLink.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { linkClicks: true } } },
    });

    const headers = ["URL", "Short URL", "Slug", "Title", "Clicks", "Created", "Status"];
    const rows = links.map((link) => [
      link.url,
      `https://${link.domain}/${link.slug}`,
      link.slug,
      link.title ?? "",
      String(link._count.linkClicks),
      link.createdAt.toISOString(),
      link.isActive ? "Active" : "Inactive",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="links-export.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
