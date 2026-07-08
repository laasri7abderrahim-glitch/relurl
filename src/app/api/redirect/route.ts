import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackClick } from "@/lib/analytics";
import { getCachedOrFetch } from "@/lib/cache";
import { rateLimit } from "@/lib/rate-limit";

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

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';
    const { success } = await rateLimit(ip, { maxRequests: 100, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const link = await getCachedOrFetch(
      `link:slug:${slug}`,
      () => prisma.shortLink.findUnique({ where: { slug } }),
      300
    );
    if (!link || !link.isActive) {
      return NextResponse.json({ data: null, error: "Link not found" }, { status: 404 });
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json({ data: null, error: "Link has expired" }, { status: 410 });
    }

    trackClick(link.id, req, {
      country: req.headers.get('x-vercel-ip-country'),
      userId: link.userId
    }).catch(() => {});

    return NextResponse.redirect(link.url, 301);
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
