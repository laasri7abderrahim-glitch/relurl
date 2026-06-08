import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackClick } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(
        { data: null, error: "Slug query parameter is required" },
        { status: 400 }
      );
    }

    const link = await prisma.shortLink.findUnique({ where: { slug } });
    if (!link || !link.isActive) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json({ data: null, error: "Link has expired" }, { status: 410 });
    }

    trackClick(link.id, req).catch(() => {});

    return NextResponse.redirect(link.url, 301);
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
