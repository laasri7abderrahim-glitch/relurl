import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const search = searchParams.get("search") ?? "";
    const userId = searchParams.get("userId");
    const isActive = searchParams.get("isActive");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { url: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
        { title: { contains: search, mode: "insensitive" as const } },
      ];
    }
    if (userId) where.userId = userId;
    if (isActive !== null) where.isActive = isActive === "true";

    const [links, total] = await Promise.all([
      prisma.shortLink.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { linkClicks: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shortLink.count({ where }),
    ]);

    return NextResponse.json({
      data: {
        links: links.map((l) => ({
          id: l.id,
          url: l.url,
          slug: l.slug,
          domain: l.domain,
          title: l.title,
          tags: l.tags,
          isActive: l.isActive,
          userId: l.userId,
          user: l.user,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
          lastClickedAt: l.lastClickedAt,
          clickCount: l._count.linkClicks,
        })),
        total,
        page,
        limit,
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
